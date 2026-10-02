from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RAW_ROOT = ROOT / "data" / "raw" / "knives"
META_PATH = ROOT / "data" / "knife_candidates_expanded.csv"
RESULTS = ROOT / "results"
AS_OF = pd.Timestamp("2026-09-04")
EVENT_DATE = pd.Timestamp("2025-10-22")
PLATFORMS = ("BUFF", "悠悠")
FRICTIONS = (0.00, 0.01, 0.03, 0.05)

# Fixed before the first run.  This is not a parameter search.
EXCESS_14_THRESHOLD = -0.08
MARKET_14_FLOOR = -0.05
RECENT_3_FLOOR = -0.02
INVENTORY_MEDIAN_CAP = 1.20
LIQUIDITY_FLOOR = 60
REARM_EXCESS = -0.03
RECOVERY_TARGET = 0.05
HARD_STOP = -0.10
MAX_HOLD_DAYS = 30
LOCK_DAYS = 8
MAX_POSITIONS = 3
INITIAL_CASH = 3000.0


def hash_raw_files() -> dict[str, str]:
    hashes: dict[str, str] = {}
    for folder in ("buff", "yyyp", "buff_sell_num", "yyyp_sell_num"):
        for path in sorted((RAW_ROOT / folder).glob("*.csv")):
            hashes[str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
    return hashes


def load_series(folder: Path, column: str) -> dict[int, pd.Series]:
    result: dict[int, pd.Series] = {}
    for path in sorted(folder.glob("*.csv")):
        frame = pd.read_csv(path)
        if frame.empty or column not in frame.columns:
            continue
        frame["date"] = pd.to_datetime(frame["date"], errors="coerce")
        frame[column] = pd.to_numeric(frame[column], errors="coerce")
        frame = frame.dropna(subset=["date", column]).sort_values("date")
        if frame.empty:
            continue
        good_id = int(frame["good_id"].iloc[0])
        result[good_id] = (
            frame.drop_duplicates("date", keep="last")
            .set_index("date")[column]
            .astype(float)
            .loc[:AS_OF]
        )
    return result


def exact_value(series: pd.Series, date: pd.Timestamp) -> float | None:
    if date not in series.index:
        return None
    value = series.loc[date]
    if isinstance(value, pd.Series):
        value = value.iloc[-1]
    return float(value)


def last_value(series: pd.Series, date: pd.Timestamp) -> float | None:
    values = series.loc[:date]
    return None if values.empty else float(values.iloc[-1])


def calendar_return(series: pd.Series, date: pd.Timestamp, days: int) -> float | None:
    current = exact_value(series, date)
    prior = last_value(series, date - pd.Timedelta(days=days))
    if current is None or prior is None or prior <= 0:
        return None
    return current / prior - 1


def next_quote_date(series: pd.Series, after: pd.Timestamp, not_before: pd.Timestamp | None = None) -> pd.Timestamp | None:
    eligible = series.index[series.index > after]
    if not_before is not None:
        eligible = eligible[eligible >= not_before]
    return None if len(eligible) == 0 else pd.Timestamp(eligible[0])


def build_chain_index(prices: dict[int, pd.Series], ids: list[int]) -> pd.DataFrame:
    dates = sorted(set().union(*(set(s.index) for s in prices.values())))
    rows: list[dict[str, object]] = []
    level = 1.0
    started = False
    for date in dates:
        prior_date = date - pd.Timedelta(days=1)
        returns: list[float] = []
        members: list[int] = []
        for good_id in ids:
            series = prices.get(good_id)
            if series is None:
                continue
            current = exact_value(series, date)
            prior = exact_value(series, prior_date)
            if current is None or prior is None or prior <= 0:
                continue
            returns.append(current / prior - 1)
            members.append(good_id)
        if not returns:
            continue
        if started:
            level *= 1 + float(np.mean(returns))
        else:
            started = True
        rows.append({
            "date": date,
            "index": level,
            "components": len(members),
            "missing_components": len(ids) - len(members),
        })
    return pd.DataFrame(rows).set_index("date")


def prior_inventory_median(series: pd.Series, date: pd.Timestamp) -> float | None:
    values = series.loc[date - pd.Timedelta(days=60): date - pd.Timedelta(days=1)]
    return None if len(values) < 30 else float(values.median())


def generate_signals(
    prices: dict[str, dict[int, pd.Series]],
    inventories: dict[str, dict[int, pd.Series]],
    indices: dict[str, pd.DataFrame],
    trade_ids: list[int],
    names: dict[int, str],
) -> tuple[pd.DataFrame, pd.DataFrame]:
    common_dates = sorted(set(indices["BUFF"].index) & set(indices["悠悠"].index))
    armed = {good_id: True for good_id in trade_ids}
    signal_rows: list[dict[str, object]] = []
    diagnostic_rows: list[dict[str, object]] = []

    for date in common_dates:
        if date > AS_OF - pd.Timedelta(days=1):
            continue
        market14 = {
            platform: calendar_return(indices[platform]["index"], date, 14)
            for platform in PLATFORMS
        }
        if any(value is None for value in market14.values()):
            continue
        for good_id in trade_ids:
            metrics: dict[str, float] = {}
            complete = True
            for platform in PLATFORMS:
                price = prices[platform].get(good_id)
                inv = inventories[platform].get(good_id)
                if price is None or inv is None:
                    complete = False
                    break
                item14 = calendar_return(price, date, 14)
                recent3 = calendar_return(price, date, 3)
                inv_now = exact_value(inv, date)
                inv_median = prior_inventory_median(inv, date)
                current = exact_value(price, date)
                if None in (item14, recent3, inv_now, inv_median, current):
                    complete = False
                    break
                metrics[f"{platform}_price"] = float(current)
                metrics[f"{platform}_item14"] = float(item14)
                metrics[f"{platform}_market14"] = float(market14[platform])
                metrics[f"{platform}_excess14"] = float(item14 - market14[platform])
                metrics[f"{platform}_recent3"] = float(recent3)
                metrics[f"{platform}_inventory"] = float(inv_now)
                metrics[f"{platform}_inventory_median60"] = float(inv_median)
                metrics[f"{platform}_inventory_ratio"] = float(inv_now / inv_median) if inv_median > 0 else math.nan
            if not complete:
                continue

            excesses = [metrics[f"{p}_excess14"] for p in PLATFORMS]
            if not armed[good_id]:
                if all(value > REARM_EXCESS for value in excesses):
                    armed[good_id] = True
                else:
                    continue

            conditions = {
                "dual_excess": all(value <= EXCESS_14_THRESHOLD for value in excesses),
                "market_not_crash": all(metrics[f"{p}_market14"] > MARKET_14_FLOOR for p in PLATFORMS),
                "stabilized": all(metrics[f"{p}_recent3"] >= RECENT_3_FLOOR for p in PLATFORMS),
                "liquid": all(metrics[f"{p}_inventory"] >= LIQUIDITY_FLOOR for p in PLATFORMS),
                "inventory_not_piling": all(
                    metrics[f"{p}_inventory_ratio"] <= INVENTORY_MEDIAN_CAP for p in PLATFORMS
                ),
            }
            if not all(conditions.values()):
                if conditions["dual_excess"]:
                    diagnostic_rows.append({
                        "date": date,
                        "good_id": good_id,
                        "item_name": names.get(good_id, str(good_id)),
                        **metrics,
                        **conditions,
                    })
                continue

            mean_excess = float(np.mean(excesses))
            signal_rows.append({
                "signal_date": date,
                "good_id": good_id,
                "item_name": names.get(good_id, str(good_id)),
                "priority_score": mean_excess,
                **metrics,
            })
            armed[good_id] = False

    signals = pd.DataFrame(signal_rows)
    if not signals.empty:
        signals = signals.sort_values(["signal_date", "priority_score", "good_id"]).reset_index(drop=True)
    diagnostics = pd.DataFrame(diagnostic_rows)
    return signals, diagnostics


@dataclass
class Position:
    good_id: int
    item_name: str
    signal_date: pd.Timestamp
    entry_date: pd.Timestamp
    entry_price: float
    quantity: int
    entry_index: float
    signal_excess14: float
    unlock_date: pd.Timestamp
    exit_trigger_date: pd.Timestamp | None = None
    exit_reason: str | None = None
    exit_date: pd.Timestamp | None = None


def marked_equity(cash: float, positions: dict[int, Position], price_map: dict[int, pd.Series], date: pd.Timestamp) -> float:
    value = cash
    for pos in positions.values():
        price = last_value(price_map[pos.good_id], date)
        if price is not None:
            value += pos.quantity * price
    return float(value)


def simulate_account(
    platform: str,
    friction: float,
    signals: pd.DataFrame,
    prices: dict[int, pd.Series],
    index: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    dates = sorted(set(index.index) | set().union(*(set(s.index) for s in prices.values())))
    dates = [d for d in dates if d <= AS_OF]
    signal_by_date = {
        pd.Timestamp(date): group.sort_values(["priority_score", "good_id"]).to_dict("records")
        for date, group in signals.groupby("signal_date")
    } if not signals.empty else {}

    cash = INITIAL_CASH
    positions: dict[int, Position] = {}
    pending_buys: list[dict[str, object]] = []
    trades: list[dict[str, object]] = []
    equity_rows: list[dict[str, object]] = []

    for date in dates:
        # Sell orders execute at the first valid quote after the trigger and after the lock.
        for good_id, pos in list(positions.items()):
            if pos.exit_date != date:
                continue
            sell_price = exact_value(prices[good_id], date)
            if sell_price is None:
                continue
            gross_proceeds = pos.quantity * sell_price
            net_proceeds = gross_proceeds * (1 - friction)
            cash += net_proceeds
            gross_return = sell_price / pos.entry_price - 1
            net_return = (sell_price / pos.entry_price) * (1 - friction) - 1
            trades.append({
                "platform": platform,
                "friction": friction,
                "good_id": good_id,
                "item_name": pos.item_name,
                "signal_date": pos.signal_date,
                "entry_date": pos.entry_date,
                "entry_price": pos.entry_price,
                "quantity": pos.quantity,
                "entry_cost": pos.quantity * pos.entry_price,
                "exit_trigger_date": pos.exit_trigger_date,
                "exit_date": date,
                "exit_price": sell_price,
                "gross_proceeds": gross_proceeds,
                "friction_cost": gross_proceeds * friction,
                "net_proceeds": net_proceeds,
                "gross_return": gross_return,
                "net_return": net_return,
                "net_profit": net_proceeds - pos.quantity * pos.entry_price,
                "holding_days": (date - pos.entry_date).days,
                "exit_reason": pos.exit_reason,
                "signal_excess14": pos.signal_excess14,
                "crossed_tradeup_event": pos.entry_date < EVENT_DATE <= date,
            })
            del positions[good_id]

        # Pending entries are one-day orders.  Unfilled orders expire rather than linger.
        todays_orders = [o for o in pending_buys if o["entry_date"] == date]
        pending_buys = [o for o in pending_buys if o["entry_date"] > date]
        for order in sorted(todays_orders, key=lambda x: (x["priority_score"], x["good_id"])):
            good_id = int(order["good_id"])
            if good_id in positions or len(positions) >= MAX_POSITIONS:
                continue
            buy_price = exact_value(prices[good_id], date)
            if buy_price is None or buy_price <= 0:
                continue
            equity_before = marked_equity(cash, positions, prices, date)
            budget = min(cash, equity_before / 3)
            quantity = int(math.floor(budget / buy_price))
            if quantity < 1:
                continue
            cost = quantity * buy_price
            if cost > cash + 1e-9:
                continue
            index_level = exact_value(index["index"], date)
            if index_level is None:
                continue
            cash -= cost
            positions[good_id] = Position(
                good_id=good_id,
                item_name=str(order["item_name"]),
                signal_date=pd.Timestamp(order["signal_date"]),
                entry_date=date,
                entry_price=buy_price,
                quantity=quantity,
                entry_index=index_level,
                signal_excess14=float(order["priority_score"]),
                unlock_date=date + pd.Timedelta(days=LOCK_DAYS),
            )

        # Close-of-day exit checks.  They never execute at the trigger price.
        index_level = exact_value(index["index"], date)
        if index_level is not None:
            for good_id, pos in positions.items():
                if pos.exit_trigger_date is not None:
                    continue
                current = exact_value(prices[good_id], date)
                if current is None:
                    continue
                absolute_return = current / pos.entry_price - 1
                relative_return = (current / pos.entry_price) / (index_level / pos.entry_index) - 1
                hold_days = (date - pos.entry_date).days
                reason: str | None = None
                if absolute_return <= HARD_STOP:
                    reason = "hard_stop"
                elif relative_return >= RECOVERY_TARGET:
                    reason = "relative_recovery"
                elif hold_days >= MAX_HOLD_DAYS:
                    reason = "max_hold"
                if reason is not None:
                    pos.exit_trigger_date = date
                    pos.exit_reason = reason
                    pos.exit_date = next_quote_date(prices[good_id], date, pos.unlock_date)

        # Signals are observed after today's close and can only trade later.
        held_or_pending = set(positions) | {int(o["good_id"]) for o in pending_buys}
        for signal in signal_by_date.get(date, []):
            good_id = int(signal["good_id"])
            if good_id in held_or_pending:
                continue
            entry_date = next_quote_date(prices[good_id], date)
            if entry_date is None or entry_date > AS_OF:
                continue
            pending_buys.append({**signal, "entry_date": entry_date})
            held_or_pending.add(good_id)

        equity = marked_equity(cash, positions, prices, date)
        equity_rows.append({
            "date": date,
            "platform": platform,
            "friction": friction,
            "cash": cash,
            "position_value": equity - cash,
            "equity": equity,
            "position_count": len(positions),
            "position_ids": ",".join(map(str, sorted(positions))),
        })

    open_rows: list[dict[str, object]] = []
    for pos in positions.values():
        price = last_value(prices[pos.good_id], AS_OF)
        open_rows.append({
            "platform": platform,
            "friction": friction,
            "good_id": pos.good_id,
            "item_name": pos.item_name,
            "entry_date": pos.entry_date,
            "entry_price": pos.entry_price,
            "quantity": pos.quantity,
            "valuation_date": AS_OF,
            "valuation_price": price,
            "unrealized_return_before_exit_friction": None if price is None else price / pos.entry_price - 1,
            "exit_trigger_date": pos.exit_trigger_date,
            "pending_exit_reason": pos.exit_reason,
        })
    return pd.DataFrame(trades), pd.DataFrame(equity_rows), pd.DataFrame(open_rows)


def max_drawdown(series: pd.Series) -> float:
    if series.empty:
        return math.nan
    return float((series / series.cummax() - 1).min())


def annual_returns(equity: pd.DataFrame) -> dict[str, float]:
    result: dict[str, float] = {}
    for year, group in equity.groupby(equity["date"].dt.year):
        result[str(int(year))] = float(group["equity"].iloc[-1] / group["equity"].iloc[0] - 1)
    return result


def summarize(trades: pd.DataFrame, equity: pd.DataFrame, platform: str, friction: float) -> dict[str, object]:
    closed = trades.copy()
    wins = closed.loc[closed["net_return"] > 0, "net_return"] if not closed.empty else pd.Series(dtype=float)
    losses = closed.loc[closed["net_return"] < 0, "net_return"] if not closed.empty else pd.Series(dtype=float)
    final_equity = float(equity["equity"].iloc[-1])
    start_date = pd.Timestamp(equity["date"].iloc[0])
    end_date = pd.Timestamp(equity["date"].iloc[-1])
    years = max((end_date - start_date).days / 365.25, 1 / 365.25)
    benchmark = INITIAL_CASH * (1.013 ** years)
    return {
        "platform": platform,
        "friction": friction,
        "strategy_name": "跨平台相对错杀修复",
        "start_date": start_date,
        "end_date": end_date,
        "closed_trades": len(closed),
        "win_rate": float((closed["net_return"] > 0).mean()) if len(closed) else math.nan,
        "average_trade_return": float(closed["net_return"].mean()) if len(closed) else math.nan,
        "median_trade_return": float(closed["net_return"].median()) if len(closed) else math.nan,
        "average_win": float(wins.mean()) if len(wins) else math.nan,
        "average_loss": float(losses.mean()) if len(losses) else math.nan,
        "max_drawdown": max_drawdown(equity["equity"]),
        "total_return": final_equity / INITIAL_CASH - 1,
        "annualized_return": (final_equity / INITIAL_CASH) ** (1 / years) - 1,
        "final_assets": final_equity,
        "benchmark_1_3_final": benchmark,
        "beats_1_3_benchmark": final_equity > benchmark,
        "annual_returns": json.dumps(annual_returns(equity), ensure_ascii=False),
    }


def write_report(
    signals: pd.DataFrame,
    diagnostics: pd.DataFrame,
    summaries: pd.DataFrame,
    trades: pd.DataFrame,
    open_positions: pd.DataFrame,
    index_diagnostics: pd.DataFrame,
    price_ids: int,
    trade_ids: int,
    missing_ids: list[int],
    hashes_ok: bool,
) -> None:
    lines = [
        "# 跨平台相对错杀修复策略回测",
        "",
        "## 固定规则",
        "",
        "这套规则不使用季节月份、历史价格百分位、横盘区间或趋势回调突破。它寻找单个标的相对整个刀市的短期异常落后。所有阈值在首次运行前固定，本报告没有参数搜索。",
        "",
        f"- 14自然日相对75刀等权指数超额收益：BUFF和悠悠均≤{EXCESS_14_THRESHOLD:.0%}。",
        f"- 两个平台指数14日收益均>{MARKET_14_FLOOR:.0%}。",
        f"- 两个平台最近3日收益均≥{RECENT_3_FLOOR:.0%}。",
        f"- 两个平台当日在售均≥{LIQUIDITY_FLOOR}，且不超过各自此前60日中位数的{INVENTORY_MEDIAN_CAP:.0%}。",
        f"- 同一轮错杀只入场一次；14日超额收益恢复到>{REARM_EXCESS:.0%}后才重新允许发出信号。",
        f"- 收盘后形成信号，下一有效报价成交；最短持有按{LOCK_DAYS}自然日假设。",
        f"- 相对指数自入场修复{RECOVERY_TARGET:.0%}、绝对亏损达到{HARD_STOP:.0%}或持有满{MAX_HOLD_DAYS}日时触发退出，下一有效报价执行。",
        f"- 初始现金{INITIAL_CASH:.0f}元，整数购买，最多{MAX_POSITIONS}个不同标的，每个新仓预算不超过当时净资产三分之一。",
        "- 总摩擦在卖出时一次性从卖出总额扣除，分别测试0%、1%、3%、5%。",
        "",
        "## 数据与覆盖",
        "",
        f"- 指数使用现有{price_ids}把刀；可验证双平台历史价格与历史在售量的标的为{trade_ids}把。",
        f"- 因缺少任一平台历史在售量而不进入交易池：{len(missing_ids)}把。",
        f"- 共同信号：{len(signals)}个；仅达到相对错杀但被市场、稳定性、流动性或库存条件拒绝：{len(diagnostics)}条观察。",
        "- 指数按相邻自然日均有报价的标的收益链式连接，不向前填充缺失报价。",
        f"- 原始CSV运行前后哈希一致：{'是' if hashes_ok else '否'}。",
        "",
        "## 汇总结果",
        "",
    ]
    display_cols = [
        "platform", "friction", "closed_trades", "win_rate", "average_trade_return",
        "average_win", "average_loss", "max_drawdown", "total_return", "annualized_return",
        "final_assets", "benchmark_1_3_final", "beats_1_3_benchmark",
    ]
    table = summaries[display_cols].copy()
    for col in ["win_rate", "average_trade_return", "average_win", "average_loss", "max_drawdown", "total_return", "annualized_return"]:
        table[col] = table[col].map(lambda x: "" if pd.isna(x) else f"{x:.2%}")
    table["friction"] = table["friction"].map(lambda x: f"{x:.0%}")
    for col in ["final_assets", "benchmark_1_3_final"]:
        table[col] = table[col].map(lambda x: f"{x:.2f}")
    lines.extend(["```text", table.to_string(index=False), "```", ""])

    five = summaries.loc[summaries["friction"] == 0.05]
    lines.extend(["## 结论", ""])
    if five.empty:
        lines.append("没有5%摩擦情景结果。")
    else:
        positive = five["total_return"] > 0
        majority = five["win_rate"] > 0.5
        if bool((positive & majority).all()):
            lines.append("在两个平台的5%摩擦情景下，策略均为正收益且已平仓胜率均超过50%。")
        elif bool((positive & majority).any()):
            lines.append("只有一个平台同时达到5%摩擦后正收益和胜率超过50%，不能视为双平台稳定规律。")
        else:
            lines.append("策略没有同时达到5%摩擦后正收益和已平仓胜率超过50%。")
    if len(trades):
        top = trades.sort_values("net_profit", ascending=False).head(5)[
            ["platform", "friction", "item_name", "entry_date", "exit_date", "net_return", "exit_reason"]
        ].copy()
        top["friction"] = top["friction"].map(lambda x: f"{x:.0%}")
        top["net_return"] = top["net_return"].map(lambda x: f"{x:.2%}")
        lines.extend(["", "净利润最高的5条实际成交记录（不同摩擦情景分别列示）：", "", "```text", top.to_string(index=False), "```"])
    lines.extend([
        "",
        f"期末未平仓记录：{len(open_positions)}条（不同平台与摩擦情景分别计数）；期末按{AS_OF.date()}最后有效报价估值，不纳入已平仓胜率。",
        "",
        "2025—2026仅属于后段历史检验，不称为真正样本外。五红事件没有从样本中删除。",
        "",
        "## 指数覆盖",
        "",
        f"BUFF每日成分数范围：{int(index_diagnostics.loc[index_diagnostics['platform']=='BUFF', 'components'].min())}—{int(index_diagnostics.loc[index_diagnostics['platform']=='BUFF', 'components'].max())}。",
        f"悠悠每日成分数范围：{int(index_diagnostics.loc[index_diagnostics['platform']=='悠悠', 'components'].min())}—{int(index_diagnostics.loc[index_diagnostics['platform']=='悠悠', 'components'].max())}。",
    ])
    (RESULTS / "relative_dislocation_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    RESULTS.mkdir(parents=True, exist_ok=True)
    before_hashes = hash_raw_files()
    meta = pd.read_csv(META_PATH)
    all_ids = sorted(meta["good_id"].astype(int).unique().tolist())
    names = dict(zip(meta["good_id"].astype(int), meta["中文名"].astype(str)))

    prices = {
        "BUFF": load_series(RAW_ROOT / "buff", "price"),
        "悠悠": load_series(RAW_ROOT / "yyyp", "price"),
    }
    inventories = {
        "BUFF": load_series(RAW_ROOT / "buff_sell_num", "sell_num"),
        "悠悠": load_series(RAW_ROOT / "yyyp_sell_num", "sell_num"),
    }
    price_ids = sorted(set(all_ids) & set(prices["BUFF"]) & set(prices["悠悠"]))
    trade_ids = sorted(set(price_ids) & set(inventories["BUFF"]) & set(inventories["悠悠"]))
    missing_ids = sorted(set(all_ids) - set(trade_ids))

    indices = {platform: build_chain_index(prices[platform], price_ids) for platform in PLATFORMS}
    signals, diagnostics = generate_signals(prices, inventories, indices, trade_ids, names)

    all_trades: list[pd.DataFrame] = []
    all_equity: list[pd.DataFrame] = []
    all_open: list[pd.DataFrame] = []
    summary_rows: list[dict[str, object]] = []
    for platform in PLATFORMS:
        platform_prices = {good_id: prices[platform][good_id] for good_id in trade_ids}
        for friction in FRICTIONS:
            trades, equity, open_positions = simulate_account(
                platform, friction, signals, platform_prices, indices[platform]
            )
            all_trades.append(trades)
            all_equity.append(equity)
            all_open.append(open_positions)
            summary_rows.append(summarize(trades, equity, platform, friction))

    trades_out = pd.concat(all_trades, ignore_index=True) if any(not x.empty for x in all_trades) else pd.DataFrame()
    equity_out = pd.concat(all_equity, ignore_index=True)
    open_out = pd.concat(all_open, ignore_index=True) if any(not x.empty for x in all_open) else pd.DataFrame()
    summary_out = pd.DataFrame(summary_rows)
    index_out = pd.concat([
        frame.reset_index().assign(platform=platform)
        for platform, frame in indices.items()
    ], ignore_index=True)

    signals.to_csv(RESULTS / "relative_dislocation_signals.csv", index=False, encoding="utf-8-sig")
    diagnostics.to_csv(RESULTS / "relative_dislocation_rejections.csv", index=False, encoding="utf-8-sig")
    trades_out.to_csv(RESULTS / "relative_dislocation_trades.csv", index=False, encoding="utf-8-sig")
    equity_out.to_csv(RESULTS / "relative_dislocation_equity.csv", index=False, encoding="utf-8-sig")
    open_out.to_csv(RESULTS / "relative_dislocation_open_positions.csv", index=False, encoding="utf-8-sig")
    summary_out.to_csv(RESULTS / "relative_dislocation_summary.csv", index=False, encoding="utf-8-sig")
    index_out.to_csv(RESULTS / "relative_dislocation_index.csv", index=False, encoding="utf-8-sig")

    after_hashes = hash_raw_files()
    hashes_ok = before_hashes == after_hashes
    write_report(
        signals, diagnostics, summary_out, trades_out, open_out, index_out,
        len(price_ids), len(trade_ids), missing_ids, hashes_ok,
    )
    print(
        f"DONE price_ids={len(price_ids)} trade_ids={len(trade_ids)} "
        f"signals={len(signals)} trades={len(trades_out)} hashes_ok={hashes_ok}"
    )


if __name__ == "__main__":
    main()
