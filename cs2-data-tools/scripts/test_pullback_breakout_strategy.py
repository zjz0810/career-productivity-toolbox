from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
PRICE_ROOT = ROOT / "data" / "raw" / "knives"
META_PATH = ROOT / "data" / "knife_candidates_expanded.csv"
AS_OF = pd.Timestamp("2026-09-04")
FRICTIONS = (0.0, 0.01, 0.03, 0.05)
PLATFORMS = ("BUFF", "悠悠")


def load_history(folder: Path, value_col: str) -> dict[int, pd.Series]:
    result: dict[int, pd.Series] = {}
    for path in folder.glob("*.csv"):
        frame = pd.read_csv(path)
        frame["date"] = pd.to_datetime(frame["date"], errors="coerce")
        frame[value_col] = pd.to_numeric(frame[value_col], errors="coerce")
        frame = frame.dropna(subset=["date", value_col]).sort_values("date")
        if frame.empty:
            continue
        good_id = int(frame["good_id"].iloc[0])
        result[good_id] = (
            frame.drop_duplicates("date", keep="last")
            .set_index("date")[value_col]
            .astype(float)
        )
    return result


def previous_value(series: pd.Series, date: pd.Timestamp) -> float | None:
    values = series.loc[:date]
    return None if values.empty else float(values.iloc[-1])


def next_value(series: pd.Series, date: pd.Timestamp) -> tuple[pd.Timestamp, float] | None:
    values = series.loc[series.index > date]
    if values.empty:
        return None
    return pd.Timestamp(values.index[0]), float(values.iloc[0])


def return_over(series: pd.Series, date: pd.Timestamp, observations: int) -> float | None:
    values = series.loc[:date]
    if len(values) <= observations:
        return None
    prior = float(values.iloc[-observations - 1])
    current = float(values.iloc[-1])
    return None if prior <= 0 else current / prior - 1


def ma(series: pd.Series, date: pd.Timestamp, observations: int) -> float | None:
    values = series.loc[:date]
    if len(values) < observations:
        return None
    return float(values.tail(observations).mean())


def ma_before(series: pd.Series, date: pd.Timestamp, observations: int, lag: int) -> float | None:
    values = series.loc[:date]
    if len(values) < observations + lag:
        return None
    return float(values.iloc[:-lag].tail(observations).mean())


def price_metrics(series: pd.Series, date: pd.Timestamp) -> dict[str, float] | None:
    values = series.loc[:date]
    if len(values) < 100:
        return None
    ma60 = ma(series, date, 60)
    old_ma60 = ma_before(series, date, 60, 10)
    r60 = return_over(series, date, 60)
    if None in (ma60, old_ma60, r60):
        return None

    # A setup exists if any of the last 20 observations closed 5% to 12% below
    # the high seen in the 20 observations before that close.
    prior_high = values.shift(1).rolling(20).max()
    pullback = values / prior_high - 1
    had_pullback = bool(pullback.tail(20).between(-0.12, -0.05).any())
    prior5_high = float(values.iloc[:-1].tail(5).max())
    current = float(values.iloc[-1])
    return {
        "current": current,
        "ma60": float(ma60),
        "ma60_slope": float(ma60 / old_ma60 - 1),
        "return60": float(r60),
        "above_ma60": float(current / ma60 - 1),
        "had_pullback": float(had_pullback),
        "breakout5": float(current > prior5_high),
    }


def build_market_index(price: dict[int, pd.Series], ids: list[int]) -> pd.Series:
    frame = pd.concat({good_id: price[good_id] for good_id in ids}, axis=1).sort_index()
    frame = frame.ffill()
    normalized = frame.div(frame.iloc[0])
    return normalized.mean(axis=1).dropna()


def market_metrics(index: pd.Series, date: pd.Timestamp) -> dict[str, float] | None:
    values = index.loc[:date]
    if len(values) < 100:
        return None
    ma60 = ma(index, date, 60)
    old_ma60 = ma_before(index, date, 60, 10)
    r60 = return_over(index, date, 60)
    if None in (ma60, old_ma60, r60):
        return None
    current = float(values.iloc[-1])
    return {
        "return60": float(r60),
        "above_ma60": float(current / ma60 - 1),
        "ma60_slope": float(ma60 / old_ma60 - 1),
    }


def setup_at(series: pd.Series, date: pd.Timestamp) -> bool:
    values = series.loc[:date]
    if len(values) < 100:
        return False
    prior_high = values.shift(1).rolling(20).max()
    pullback = values / prior_high - 1
    return bool(pullback.tail(20).between(-0.12, -0.05).any())


def breakout_at(series: pd.Series, date: pd.Timestamp) -> bool:
    values = series.loc[:date]
    if len(values) < 100:
        return False
    current = float(values.iloc[-1])
    prior5 = float(values.iloc[:-1].tail(5).max())
    current_ma60 = ma(series, date, 60)
    return current > prior5 and current > float(current_ma60)


def find_exit(series: pd.Series, buy_date: pd.Timestamp, buy_price: float) -> tuple[pd.Timestamp, float, str]:
    future = series.loc[series.index >= buy_date].iloc[:80]
    peak = buy_price
    for held, (date, value) in enumerate(future.items()):
        if date < buy_date:
            continue
        value = float(value)
        peak = max(peak, value)
        reason = None
        if value <= buy_price * 0.92:
            reason = "stop_loss_8pct"
        elif value <= peak * 0.92 and peak > buy_price:
            reason = "trailing_stop_8pct"
        elif held >= 60:
            reason = "max_hold_60_observations"
        if reason:
            return pd.Timestamp(date), value, reason
    last_date = pd.Timestamp(future.index[-1])
    return last_date, float(future.iloc[-1]), "data_end"


@dataclass
class Position:
    good_id: int
    entry_date: pd.Timestamp
    entry_price: float
    amount: float
    peak_price: float


def simulate_portfolio(
    signals: pd.DataFrame,
    prices: dict[int, pd.Series],
    friction: float,
    as_of: pd.Timestamp,
) -> dict[str, float | int]:
    # Three fixed equal slots. A position uses one third of current equity;
    # unfilled slots remain in cash.
    events = {pd.Timestamp(d): group for d, group in signals.groupby("signal_date")}
    pending: dict[pd.Timestamp, list[tuple[int, float]]] = {}
    dates = sorted(set().union(*(set(series.index[series.index <= as_of]) for series in prices.values())))
    cash = 1.0
    positions: list[Position] = []
    equity_curve: list[float] = []
    for date in dates:
        for position in list(positions):
            current = previous_value(prices[position.good_id], date)
            if current is None:
                continue
            position.peak_price = max(position.peak_price, current)
            stop = current <= position.entry_price * 0.92 or (
                position.peak_price > position.entry_price
                and current <= position.peak_price * 0.92
            )
            age = len(prices[position.good_id].loc[position.entry_date:date]) - 1
            if stop or age >= 60:
                cash += position.amount * current / position.entry_price * (1 - friction)
                positions.remove(position)

        if date in events and len(positions) + sum(len(items) for items in pending.values()) < 3:
            group = events[date].sort_values("rank_score", ascending=False)
            for row in group.itertuples(index=False):
                if len(positions) + sum(len(items) for items in pending.values()) >= 3 or any(p.good_id == row.good_id for p in positions):
                    continue
                buy = next_value(prices[int(row.good_id)], date)
                if buy is None:
                    continue
                buy_date, buy_price = buy
                if buy_date > as_of:
                    continue
                pending.setdefault(buy_date, []).append((int(row.good_id), buy_price))

        if date in pending:
            for good_id, buy_price in pending.pop(date):
                equity = cash + sum(
                    p.amount * float(previous_value(prices[p.good_id], date)) / p.entry_price
                    for p in positions
                    if previous_value(prices[p.good_id], date) is not None
                )
                amount = min(cash, equity / 3)
                if amount <= 0:
                    continue
                cash -= amount
                positions.append(Position(good_id, date, buy_price, amount, buy_price))

        marked = cash
        for position in positions:
            current = previous_value(prices[position.good_id], date)
            if current is not None:
                marked += position.amount * current / position.entry_price * (1 - friction)
        equity_curve.append(marked)

    curve = pd.Series(equity_curve, index=dates, dtype=float)
    drawdown = curve / curve.cummax() - 1
    return {
        "start_equity": 1.0,
        "end_equity": float(curve.iloc[-1]),
        "total_return": float(curve.iloc[-1] - 1),
        "max_drawdown": float(drawdown.min()),
        "open_positions_at_asof": int(len(positions)),
        "months_with_signals": int(len(events)),
    }


def main() -> None:
    meta = pd.read_csv(META_PATH, encoding="utf-8-sig")
    meta["BUFF在售数量"] = pd.to_numeric(meta["BUFF在售数量"], errors="coerce")
    meta["悠悠在售数量"] = pd.to_numeric(meta["悠悠在售数量"], errors="coerce")
    universe = meta.loc[(meta["BUFF在售数量"] >= 60) & (meta["悠悠在售数量"] >= 60)]
    ids = sorted(universe["good_id"].astype(int).tolist())
    names = dict(zip(meta["good_id"].astype(int), meta["中文名"].astype(str)))

    price = {
        platform: load_history(PRICE_ROOT / folder, "price")
        for platform, folder in (("BUFF", "buff"), ("悠悠", "yyyp"))
    }
    common_ids = [good_id for good_id in ids if good_id in price["BUFF"] and good_id in price["悠悠"]]
    market = {platform: build_market_index(price[platform], common_ids) for platform in PLATFORMS}

    signal_rows: list[dict[str, object]] = []
    candidate_dates = sorted(set(market["BUFF"].index) & set(market["悠悠"].index))
    for date in candidate_dates:
        date = pd.Timestamp(date)
        if date < pd.Timestamp("2023-07-01") or date > AS_OF - pd.Timedelta(days=2):
            continue
        mm = {platform: market_metrics(market[platform], date) for platform in PLATFORMS}
        if any(value is None for value in mm.values()):
            continue
        market_ok = all(m["above_ma60"] > 0 and m["ma60_slope"] > 0 for m in mm.values())
        if not market_ok:
            continue

        candidates: list[dict[str, object]] = []
        for good_id in common_ids:
            metrics = {platform: price_metrics(price[platform][good_id], date) for platform in PLATFORMS}
            if any(value is None for value in metrics.values()):
                continue
            valid = all(
                bool(m["had_pullback"])
                and bool(m["breakout5"])
                and m["above_ma60"] > 0
                and m["return60"] > mm[platform]["return60"]
                for platform, m in metrics.items()
            )
            # A same-day signal on both venues is required. The observed
            # sell_price histories provide the common signal date.
            if valid and all(setup_at(price[platform][good_id], date) and breakout_at(price[platform][good_id], date) for platform in PLATFORMS):
                score = float(np.mean([metrics[p]["return60"] - mm[p]["return60"] for p in PLATFORMS]))
                candidates.append({
                    "signal_date": date.date().isoformat(),
                    "good_id": good_id,
                    "name": names.get(good_id, ""),
                    "rank_score": score,
                    "market_return60_buff": mm["BUFF"]["return60"],
                    "market_return60_yyyp": mm["悠悠"]["return60"],
                    "buff_return60": metrics["BUFF"]["return60"],
                    "yyyp_return60": metrics["悠悠"]["return60"],
                    "buff_pullback": metrics["BUFF"]["had_pullback"],
                    "yyyp_pullback": metrics["悠悠"]["had_pullback"],
                })
        if candidates:
            candidates = sorted(candidates, key=lambda row: float(row["rank_score"]), reverse=True)[:3]
            signal_rows.extend(candidates)

    signals = pd.DataFrame(signal_rows)
    if signals.empty:
        print("没有产生双平台同步突破信号。")
        return

    trade_rows: list[dict[str, object]] = []
    for row in signals.itertuples(index=False):
        signal_date = pd.Timestamp(row.signal_date)
        for platform in PLATFORMS:
            buy = next_value(price[platform][int(row.good_id)], signal_date)
            if buy is None:
                continue
            buy_date, buy_price = buy
            sell_date, sell_price, exit_reason = find_exit(price[platform][int(row.good_id)], buy_date, buy_price)
            gross = sell_price / buy_price - 1
            trade_rows.append({
                "signal_date": signal_date.date().isoformat(),
                "year": signal_date.year,
                "platform": platform,
                "good_id": int(row.good_id),
                "name": row.name,
                "buy_date": buy_date.date().isoformat(),
                "buy_price": buy_price,
                "sell_date": sell_date.date().isoformat(),
                "sell_price": sell_price,
                "holding_observations": len(price[platform][int(row.good_id)].loc[buy_date:sell_date]) - 1,
                "gross_return": gross,
                "exit_reason": exit_reason,
                "closed_trade": exit_reason != "data_end",
                "rank_score": row.rank_score,
            })

    trades = pd.DataFrame(trade_rows)
    closed_trades = trades[trades["closed_trade"]].copy()
    results: list[dict[str, object]] = []
    for platform, group in trades.groupby("platform", sort=True):
        platform_closed = closed_trades[closed_trades["platform"] == platform]
        for period, subset in [("all", platform_closed), ("development_2023_2024", platform_closed[platform_closed["year"].isin([2023, 2024])]), ("oos_2025_2026", platform_closed[platform_closed["year"].isin([2025, 2026])])]:
            if subset.empty:
                continue
            for friction in FRICTIONS:
                net = (1 + subset["gross_return"]) * (1 - friction) - 1
                results.append({
                    "period": period,
                    "platform": platform,
                    "friction": friction,
                    "trades": len(subset),
                    "average_return": net.mean(),
                    "median_return": net.median(),
                    "win_rate": (net > 0).mean(),
                    "best_return": net.max(),
                    "worst_return": net.min(),
                })

    summary = pd.DataFrame(results)
    portfolio_rows: list[dict[str, object]] = []
    for platform in PLATFORMS:
        platform_signals = signals.copy()
        platform_signals["signal_date"] = pd.to_datetime(platform_signals["signal_date"])
        for friction in FRICTIONS:
            stats = simulate_portfolio(platform_signals, price[platform], friction, AS_OF)
            portfolio_rows.append({"platform": platform, "friction": friction, **stats})
    portfolio = pd.DataFrame(portfolio_rows)

    out_trades = ROOT / "results" / "pullback_breakout_trades.csv"
    out_summary = ROOT / "results" / "pullback_breakout_summary.csv"
    out_portfolio = ROOT / "results" / "pullback_breakout_portfolio.csv"
    trades.to_csv(out_trades, index=False, encoding="utf-8-sig")
    summary.to_csv(out_summary, index=False, encoding="utf-8-sig")
    portfolio.to_csv(out_portfolio, index=False, encoding="utf-8-sig")

    report = ROOT / "results" / "pullback_breakout_report.md"
    lines = [
        "# 趋势回调后突破策略回测",
        "",
        "规则固定为：月度观察；BUFF和悠悠同日同时满足市场在60日均线上方且60日均线向上；单个刀皮两平台均处于60日收益跑赢各自指数、价格高于60日均线、此前20个有效点出现过相对20点高位回撤5%～12%，并重新突破前5个有效点高位；信号次日买入。最多3个持仓，每个持仓最多占当时净值三分之一；跌破买入价8%、从持仓后高点回撤8%或持有60个有效点时退出。",
        "",
        f"当前候选池：{len(common_ids)} 把；信号事件：{len(signals)} 个；交易记录：{len(trades)} 条，其中已完成{len(closed_trades)}条；价格截止：{AS_OF.date()}。",
        "",
        "注意：信号只使用当日及此前数据，买入使用信号后的下一条价格。2026年尚未结束，未完成持仓按截至日估值，仅在交易统计中保留已经退出的记录。当前候选池按2026年快照筛选，存在幸存者偏差。",
        "",
        "## 交易统计",
        "",
        "```text",
        summary.to_string(index=False, float_format=lambda value: f"{value:.4f}"),
        "```",
        "",
        "## 三仓位组合统计",
        "",
        "```text",
        portfolio.to_string(index=False, float_format=lambda value: f"{value:.4f}"),
        "```",
    ]
    report.write_text("\n".join(lines), encoding="utf-8")

    print(f"universe={len(common_ids)} signals={len(signals)} trades={len(trades)} closed={len(closed_trades)}")
    print("\nSUMMARY")
    print(summary.to_string(index=False))
    print("\nPORTFOLIO")
    print(portfolio.to_string(index=False))
    print("\nFILES")
    print(out_trades)
    print(out_summary)
    print(out_portfolio)
    print(report)


if __name__ == "__main__":
    main()
