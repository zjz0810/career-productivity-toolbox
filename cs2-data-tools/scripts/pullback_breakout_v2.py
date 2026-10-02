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
AS_OF = pd.Timestamp("2026-09-04")
EVENT_DATE = pd.Timestamp("2025-10-22")
FRICTIONS = (0.0, 0.01, 0.03, 0.05)
LOCK_DAYS = (7, 8)
PLATFORMS = ("BUFF", "悠悠")


def load_series(folder: Path, column: str) -> dict[int, pd.Series]:
    result: dict[int, pd.Series] = {}
    for path in folder.glob("*.csv"):
        frame = pd.read_csv(path)
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


def next_quote(series: pd.Series, date: pd.Timestamp) -> tuple[pd.Timestamp, float] | None:
    values = series.loc[series.index > date]
    if values.empty:
        return None
    return pd.Timestamp(values.index[0]), float(values.iloc[0])


def calendar_window(series: pd.Series, end: pd.Timestamp, days: int) -> pd.Series:
    return series.loc[end - pd.Timedelta(days=days) : end]


def calendar_return(series: pd.Series, end: pd.Timestamp, days: int) -> float | None:
    current = last_value(series, end)
    prior = last_value(series, end - pd.Timedelta(days=days))
    if current is None or prior is None or prior <= 0:
        return None
    return current / prior - 1


def calendar_mean(series: pd.Series, end: pd.Timestamp, days: int) -> float | None:
    values = calendar_window(series, end, days)
    return None if len(values) < 30 else float(values.mean())


def build_chain_index(price: dict[int, pd.Series], ids: list[int]) -> pd.DataFrame:
    dates = sorted(
        set().union(*(set(series.index[series.index <= AS_OF]) for series in price.values()))
    )
    rows: list[dict[str, object]] = []
    level: float | None = None
    for date in dates:
        previous_date = date - pd.Timedelta(days=1)
        returns: list[float] = []
        constituents: list[int] = []
        for good_id in ids:
            current = exact_value(price[good_id], date)
            previous = exact_value(price[good_id], previous_date)
            if current is None or previous is None or previous <= 0:
                continue
            returns.append(current / previous - 1)
            constituents.append(good_id)
        if not returns:
            continue
        if level is None:
            level = 1.0
        else:
            level *= 1 + float(np.mean(returns))
        rows.append(
            {
                "date": date,
                "index": level,
                "components": len(constituents),
                "component_ids": ",".join(map(str, constituents)),
            }
        )
    return pd.DataFrame(rows).set_index("date")


def market_metrics(index: pd.DataFrame, date: pd.Timestamp) -> dict[str, float] | None:
    if date not in index.index:
        return None
    current = float(index.loc[date, "index"])
    prior = last_value(index["index"], date - pd.Timedelta(days=60))
    current_window = index.loc[date - pd.Timedelta(days=60) : date, "index"]
    old_window = index.loc[date - pd.Timedelta(days=70) : date - pd.Timedelta(days=10), "index"]
    if prior is None or len(current_window) < 30 or len(old_window) < 30:
        return None
    current_ma = float(current_window.mean())
    old_ma = float(old_window.mean())
    return {
        "return60": current / prior - 1,
        "above_ma60": current / current_ma - 1,
        "ma60_slope": current_ma / old_ma - 1,
    }


def generate_setups(series: pd.Series) -> dict[pd.Timestamp, dict[str, object]]:
    active: dict[str, object] | None = None
    signals: dict[pd.Timestamp, dict[str, object]] = {}
    for date in series.index:
        if date > AS_OF:
            break
        ma60 = calendar_mean(series, date, 60)
        if ma60 is None:
            continue
        current = float(series.loc[date])
        if active is not None:
            start = pd.Timestamp(active["start"])
            peak = float(active["peak"])
            age = (date - start).days
            if age > 20 or current < ma60 or current < peak * 0.88:
                active = None

        if active is None:
            prior20 = series.loc[date - pd.Timedelta(days=20) : date - pd.Timedelta(days=1)]
            if len(prior20) >= 10:
                peak = float(prior20.max())
                pullback = current / peak - 1
                if -0.12 <= pullback <= -0.05 and current >= ma60:
                    active = {"start": date, "peak": peak}

        if active is None:
            continue
        start = pd.Timestamp(active["start"])
        age = (date - start).days
        if age > 20 or current < ma60:
            continue
        prior5 = series.loc[date - pd.Timedelta(days=5) : date - pd.Timedelta(days=1)]
        if len(prior5) < 3:
            continue
        if current > float(prior5.max()):
            signals[date] = {
                "setup_start": start,
                "setup_age_days": age,
                "setup_peak": float(active["peak"]),
                "pullback": current / float(active["peak"]) - 1,
            }
            active = None
    return signals


def signal_candidates(
    price: dict[str, dict[int, pd.Series]],
    inventory: dict[str, dict[int, pd.Series]],
    market: dict[str, pd.DataFrame],
    ids: list[int],
    names: dict[int, str],
) -> tuple[pd.DataFrame, pd.DataFrame]:
    setup_maps = {
        platform: {good_id: generate_setups(price[platform][good_id]) for good_id in ids if good_id in price[platform]}
        for platform in PLATFORMS
    }
    rejection_rows: list[dict[str, object]] = []
    rows: list[dict[str, object]] = []
    date_set = set().union(*(set(item) for platform in setup_maps.values() for item in platform.values()))
    for date in sorted(date_set):
        if date > AS_OF - pd.Timedelta(days=1):
            continue
        mm = {platform: market_metrics(market[platform], date) for platform in PLATFORMS}
        if any(value is None for value in mm.values()):
            continue
        if not all(m["above_ma60"] > 0 and m["ma60_slope"] > 0 for m in mm.values()):
            continue
        candidates: list[dict[str, object]] = []
        for good_id in ids:
            if date not in setup_maps["BUFF"].get(good_id, {}) or date not in setup_maps["悠悠"].get(good_id, {}):
                continue
            price_metrics: dict[str, float] = {}
            missing_inventory = []
            meets_liquidity = True
            for platform in PLATFORMS:
                series = price[platform][good_id]
                current = exact_value(series, date)
                r60 = calendar_return(series, date, 60)
                ma60 = calendar_mean(series, date, 60)
                inv = inventory[platform].get(good_id)
                inv_current = exact_value(inv, date) if inv is not None else None
                if current is None or r60 is None or ma60 is None:
                    meets_liquidity = False
                    break
                price_metrics[f"{platform}_return60"] = r60
                price_metrics[f"{platform}_above_ma60"] = current / ma60 - 1
                if inv_current is None:
                    missing_inventory.append(platform)
                    meets_liquidity = False
                elif inv_current < 60:
                    meets_liquidity = False
            if not meets_liquidity:
                rejection_rows.append(
                    {
                        "signal_date": date.date().isoformat(),
                        "good_id": good_id,
                        "name": names.get(good_id, ""),
                        "reason": "missing_inventory" if missing_inventory else "inventory_below_60",
                        "missing_platforms": ",".join(missing_inventory),
                    }
                )
                continue
            valid = all(
                price_metrics[f"{platform}_above_ma60"] > 0
                and price_metrics[f"{platform}_return60"] > mm[platform]["return60"]
                for platform in PLATFORMS
            )
            if not valid:
                continue
            score = float(np.mean([price_metrics[f"{p}_return60"] - mm[p]["return60"] for p in PLATFORMS]))
            candidates.append(
                {
                    "signal_date": date,
                    "good_id": good_id,
                    "name": names.get(good_id, ""),
                    "rank_score": score,
                    "market_return60_buff": mm["BUFF"]["return60"],
                    "market_return60_yyyp": mm["悠悠"]["return60"],
                    "buff_return60": price_metrics["BUFF_return60"],
                    "yyyp_return60": price_metrics["悠悠_return60"],
                }
            )
        candidates.sort(key=lambda row: (-float(row["rank_score"]), int(row["good_id"])))
        rows.extend(candidates[:3])
    return pd.DataFrame(rows), pd.DataFrame(rejection_rows)


@dataclass
class Position:
    good_id: int
    signal_date: pd.Timestamp
    entry_date: pd.Timestamp
    entry_price: float
    quantity: int
    cost: float
    peak_price: float
    stop_trigger_date: pd.Timestamp | None = None
    stop_reason: str = ""


def simulate_account(
    platform: str,
    lock_days: int,
    friction: float,
    signals: pd.DataFrame,
    prices: dict[int, pd.Series],
    market: pd.DataFrame,
    initial_cash: float = 3000.0,
) -> tuple[pd.DataFrame, pd.DataFrame, dict[str, object]]:
    events: dict[pd.Timestamp, pd.DataFrame] = {}
    for date, group in signals.groupby("signal_date"):
        events[pd.Timestamp(date)] = group.sort_values(["rank_score", "good_id"], ascending=[False, True])

    first_dates = [series.index.min() for series in prices.values() if not series.empty]
    start = min(first_dates)
    dates = pd.date_range(start, AS_OF, freq="D")
    cash = initial_cash
    positions: list[Position] = []
    pending_entries: dict[pd.Timestamp, list[dict[str, object]]] = {}
    trades: list[dict[str, object]] = []
    equity_rows: list[dict[str, object]] = []
    skipped_buys = 0

    def net_value(date: pd.Timestamp) -> float:
        value = cash
        for pos in positions:
            quote = last_value(prices[pos.good_id], date)
            if quote is not None:
                value += pos.quantity * quote
        return value

    for date in dates:
        # Existing positions are marked and exits are executed only after a
        # trigger day and after the lock has expired.
        for pos in list(positions):
            quote = exact_value(prices[pos.good_id], date)
            if quote is None:
                continue
            pos.peak_price = max(pos.peak_price, quote)
            age = (date - pos.entry_date).days
            stop_reason = ""
            if quote <= pos.entry_price * 0.92:
                stop_reason = "stop_loss_8pct"
            elif pos.peak_price > pos.entry_price and quote <= pos.peak_price * 0.92:
                stop_reason = "trailing_stop_8pct"
            elif age >= 60:
                stop_reason = "max_hold_60_calendar_days"
            if stop_reason and pos.stop_trigger_date is None:
                pos.stop_trigger_date = date
                pos.stop_reason = stop_reason
            if pos.stop_trigger_date is not None:
                earliest = max(
                    pos.stop_trigger_date + pd.Timedelta(days=1),
                    pos.entry_date + pd.Timedelta(days=lock_days),
                )
                if date >= earliest:
                    sell_gross = pos.quantity * quote
                    friction_cost = sell_gross * friction
                    sell_net = sell_gross - friction_cost
                    trades.append(
                        {
                            "platform": platform,
                            "lock_days": lock_days,
                            "friction": friction,
                            "good_id": pos.good_id,
                            "name": "",
                            "signal_date": pos.signal_date.date().isoformat(),
                            "buy_date": pos.entry_date.date().isoformat(),
                            "buy_price": pos.entry_price,
                            "quantity": pos.quantity,
                            "buy_cost": pos.cost,
                            "stop_trigger_date": pos.stop_trigger_date.date().isoformat(),
                            "sell_date": date.date().isoformat(),
                            "sell_price": quote,
                            "sell_gross": sell_gross,
                            "friction_cost": friction_cost,
                            "sell_net": sell_net,
                            "net_return": sell_net / pos.cost - 1,
                            "holding_calendar_days": (date - pos.entry_date).days,
                            "exit_reason": pos.stop_reason,
                            "event_between_entry_exit": bool(pos.entry_date < EVENT_DATE <= date),
                            "closed_trade": True,
                        }
                    )
                    cash += sell_net
                    positions.remove(pos)

        # A signal can only queue a next-day entry. The actual integer order is
        # filled on that next quote date.
        if date in events:
            reserved = sum(len(items) for items in pending_entries.values())
            for row in events[date].itertuples(index=False):
                if len(positions) + reserved >= 3:
                    break
                if any(pos.good_id == int(row.good_id) for pos in positions) or any(
                    int(item["good_id"]) == int(row.good_id)
                    for items in pending_entries.values()
                    for item in items
                ):
                    continue
                quote = next_quote(prices[int(row.good_id)], date)
                if quote is None or quote[0] > AS_OF:
                    continue
                buy_date, buy_price = quote
                pending_entries.setdefault(buy_date, []).append(
                    {
                        "good_id": int(row.good_id),
                        "signal_date": date,
                        "buy_price": buy_price,
                    }
                )
                reserved += 1

        if date in pending_entries:
            for item in pending_entries.pop(date):
                equity = net_value(date)
                budget = min(cash, equity / 3)
                quantity = math.floor(budget / float(item["buy_price"]))
                if quantity < 1:
                    skipped_buys += 1
                    continue
                cost = quantity * float(item["buy_price"])
                cash -= cost
                positions.append(
                    Position(
                        good_id=int(item["good_id"]),
                        signal_date=pd.Timestamp(item["signal_date"]),
                        entry_date=date,
                        entry_price=float(item["buy_price"]),
                        quantity=quantity,
                        cost=cost,
                        peak_price=float(item["buy_price"]),
                    )
                )

        total = net_value(date)
        equity_rows.append(
            {
                "date": date.date().isoformat(),
                "platform": platform,
                "lock_days": lock_days,
                "friction": friction,
                "cash": cash,
                "position_count": len(positions),
                "gross_position_value": total - cash,
                "net_value": total,
                "position_ids": ",".join(str(pos.good_id) for pos in positions),
                "market_index": exact_value(market["index"], date),
                "market_components": exact_value(market["components"], date),
                "signals_today": len(events.get(date, [])),
            }
        )

    equity = pd.DataFrame(equity_rows)
    equity["drawdown"] = equity["net_value"] / equity["net_value"].cummax() - 1
    return equity, pd.DataFrame(trades), {"skipped_buys": skipped_buys, "open_positions": positions}


def annual_returns(equity: pd.DataFrame) -> dict[str, float]:
    frame = equity.copy()
    frame["date"] = pd.to_datetime(frame["date"])
    year_end = frame.groupby(frame["date"].dt.year)["net_value"].last()
    result: dict[str, float] = {}
    previous = float(frame["net_value"].iloc[0])
    for year, value in year_end.items():
        result[str(year)] = float(value / previous - 1)
        previous = float(value)
    return result


def annual_trade_stats(trades: pd.DataFrame) -> dict[str, dict[str, float | int]]:
    if trades.empty:
        return {}
    frame = trades.copy()
    frame["year"] = pd.to_datetime(frame["sell_date"]).dt.year
    result: dict[str, dict[str, float | int]] = {}
    for year, group in frame.groupby("year"):
        result[str(year)] = {
            "trades": int(len(group)),
            "average_net_return": float(group["net_return"].mean()),
            "win_rate": float((group["net_return"] > 0).mean()),
        }
    return result


def sha256_files() -> dict[str, str]:
    result: dict[str, str] = {}
    for path in sorted(RAW_ROOT.rglob("*.csv")):
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        result[str(path.relative_to(ROOT))] = digest
    return result


def audit_no_lookahead(
    price: dict[str, dict[int, pd.Series]],
    inventory: dict[str, dict[int, pd.Series]],
    market: dict[str, pd.DataFrame],
    ids: list[int],
    names: dict[int, str],
    audit_date: pd.Timestamp,
) -> bool:
    original = signal_candidates(price, inventory, market, ids, names)[0]
    trunc_price = {
        platform: {good_id: series.loc[:audit_date] for good_id, series in price[platform].items()}
        for platform in PLATFORMS
    }
    trunc_market = {platform: market[platform].loc[:audit_date].copy() for platform in PLATFORMS}
    truncated = signal_candidates(trunc_price, inventory, trunc_market, ids, names)[0]
    cols = ["signal_date", "good_id", "rank_score"]
    left = original.loc[pd.to_datetime(original["signal_date"]) <= audit_date, cols].copy()
    right = truncated.loc[pd.to_datetime(truncated["signal_date"]) <= audit_date, cols].copy()
    left["signal_date"] = pd.to_datetime(left["signal_date"])
    right["signal_date"] = pd.to_datetime(right["signal_date"])
    left = left.sort_values(cols).reset_index(drop=True)
    right = right.sort_values(cols).reset_index(drop=True)
    return left.equals(right)


def main() -> None:
    hashes_before = sha256_files()
    metadata = pd.read_csv(META_PATH, encoding="utf-8-sig")
    ids = sorted(metadata["good_id"].astype(int).tolist())
    names = dict(zip(metadata["good_id"].astype(int), metadata["中文名"].astype(str)))
    price = {
        "BUFF": load_series(RAW_ROOT / "buff", "price"),
        "悠悠": load_series(RAW_ROOT / "yyyp", "price"),
    }
    inventory = {
        "BUFF": load_series(RAW_ROOT / "buff_sell_num", "sell_num"),
        "悠悠": load_series(RAW_ROOT / "yyyp_sell_num", "sell_num"),
    }
    both_inventory_ids = sorted(set(inventory["BUFF"]) & set(inventory["悠悠"]))
    trade_ids = sorted(set(ids) & set(price["BUFF"]) & set(price["悠悠"]) & set(both_inventory_ids))
    missing_inventory_ids = sorted(set(ids) - set(both_inventory_ids))
    coverage_rows = []
    for good_id in ids:
        coverage_rows.append(
            {
                "good_id": good_id,
                "name": names.get(good_id, ""),
                "has_buff_inventory": good_id in inventory["BUFF"],
                "has_yyyp_inventory": good_id in inventory["悠悠"],
                "buff_inventory_start": inventory["BUFF"].get(good_id, pd.Series(dtype=float)).index.min(),
                "buff_inventory_end": inventory["BUFF"].get(good_id, pd.Series(dtype=float)).index.max(),
                "yyyp_inventory_start": inventory["悠悠"].get(good_id, pd.Series(dtype=float)).index.min(),
                "yyyp_inventory_end": inventory["悠悠"].get(good_id, pd.Series(dtype=float)).index.max(),
                "tradable_for_signal": good_id in trade_ids,
            }
        )
    coverage = pd.DataFrame(coverage_rows)

    market = {platform: build_chain_index(price[platform], ids) for platform in PLATFORMS}
    signals, rejections = signal_candidates(price, inventory, market, trade_ids, names)
    if signals.empty:
        raise RuntimeError("没有产生信号，无法生成v2结果。")

    all_trades: list[pd.DataFrame] = []
    all_equity: list[pd.DataFrame] = []
    summary_rows: list[dict[str, object]] = []
    open_rows: list[dict[str, object]] = []
    for platform in PLATFORMS:
        platform_prices = price[platform]
        platform_signals = signals.copy()
        platform_signals["signal_date"] = pd.to_datetime(platform_signals["signal_date"])
        for lock_days in LOCK_DAYS:
            for friction in FRICTIONS:
                equity, trades, state = simulate_account(
                    platform, lock_days, friction, platform_signals, platform_prices, market[platform]
                )
                if not trades.empty:
                    trades["name"] = trades["good_id"].map(names).fillna("")
                all_trades.append(trades)
                all_equity.append(equity)
                final_value = float(equity["net_value"].iloc[-1])
                closed = trades[trades["closed_trade"]] if not trades.empty else trades
                net_returns = closed["net_return"] if not closed.empty else pd.Series(dtype=float)
                annual = annual_returns(equity)
                benchmark = 3000 * (1.013 ** ((AS_OF - pd.to_datetime(equity["date"].iloc[0])).days / 365.25))
                summary_rows.append(
                    {
                        "platform": platform,
                        "lock_days_assumption": lock_days,
                        "friction": friction,
                        "signals_generated": len(signals),
                        "executed_trades": len(closed),
                        "open_positions": len(state["open_positions"]),
                        "skipped_buys_insufficient_for_one_unit": state["skipped_buys"],
                        "average_net_return": net_returns.mean() if not net_returns.empty else np.nan,
                        "median_net_return": net_returns.median() if not net_returns.empty else np.nan,
                        "net_win_rate": (net_returns > 0).mean() if not net_returns.empty else np.nan,
                        "average_winning_return": net_returns[net_returns > 0].mean() if any(net_returns > 0) else np.nan,
                        "average_losing_return": net_returns[net_returns <= 0].mean() if any(net_returns <= 0) else np.nan,
                        "max_drawdown": equity["drawdown"].min(),
                        "total_return": final_value / 3000 - 1,
                        "final_assets_3000": final_value,
                        "benchmark_1_3pct_final": benchmark,
                        "beats_1_3pct": final_value > benchmark,
                        "annual_returns": json.dumps(annual, ensure_ascii=False),
                        "annual_trade_stats": json.dumps(annual_trade_stats(closed), ensure_ascii=False),
                    }
                )
                for pos in state["open_positions"]:
                    quote = last_value(platform_prices[pos.good_id], AS_OF)
                    open_rows.append(
                        {
                            "platform": platform,
                            "lock_days_assumption": lock_days,
                            "friction": friction,
                            "good_id": pos.good_id,
                            "name": names.get(pos.good_id, ""),
                            "signal_date": pos.signal_date.date().isoformat(),
                            "buy_date": pos.entry_date.date().isoformat(),
                            "buy_price": pos.entry_price,
                            "quantity": pos.quantity,
                            "as_of_date": AS_OF.date().isoformat(),
                            "as_of_price": quote,
                            "unrealized_return_before_friction": quote / pos.entry_price - 1 if quote else np.nan,
                        }
                    )

    trades = pd.concat(all_trades, ignore_index=True) if all_trades else pd.DataFrame()
    equity = pd.concat(all_equity, ignore_index=True) if all_equity else pd.DataFrame()
    summary = pd.DataFrame(summary_rows)
    open_positions = pd.DataFrame(open_rows)
    if open_positions.empty:
        open_positions = pd.DataFrame(
            columns=[
                "platform", "lock_days_assumption", "friction", "good_id", "name",
                "signal_date", "buy_date", "buy_price", "quantity", "as_of_date",
                "as_of_price", "unrealized_return_before_friction",
            ]
        )

    hashes_after = sha256_files()
    hash_ok = hashes_before == hashes_after
    no_lookahead = audit_no_lookahead(price, inventory, market, trade_ids, names, pd.Timestamp("2024-12-31"))
    exit_reasons = trades["exit_reason"].value_counts().to_dict() if not trades.empty else {}
    has_ordinary_exit_sample = "max_hold_60_calendar_days" in exit_reasons
    has_trailing_exit_sample = "trailing_stop_8pct" in exit_reasons
    has_event_jump_sample = bool(trades["event_between_entry_exit"].any()) if not trades.empty else False
    if not trades.empty:
        no_same_day_buy = bool((pd.to_datetime(trades["signal_date"]) < pd.to_datetime(trades["buy_date"])).all())
        no_locked_sell = bool(((pd.to_datetime(trades["sell_date"]) - pd.to_datetime(trades["buy_date"])).dt.days >= trades["lock_days"]).all())
        no_negative_cash = bool((equity["cash"] >= -1e-8).all())
        no_more_than_three = bool((equity["position_count"] <= 3).all())
        no_duplicate_positions = bool(
            all(
                len([x for x in str(ids).split(",") if x])
                == len(set(x for x in str(ids).split(",") if x))
                for ids in equity["position_ids"]
            )
        )
        reconciliation_ok = bool(
            (abs(equity["net_value"] - equity["cash"] - equity["gross_position_value"]) <= 1e-8).all()
        )
    else:
        no_same_day_buy = no_locked_sell = no_negative_cash = no_more_than_three = no_duplicate_positions = reconciliation_ok = True

    out = ROOT / "results"
    trades.to_csv(out / "pullback_breakout_v2_trades.csv", index=False, encoding="utf-8-sig")
    equity.to_csv(out / "pullback_breakout_v2_equity.csv", index=False, encoding="utf-8-sig")
    summary.to_csv(out / "pullback_breakout_v2_summary.csv", index=False, encoding="utf-8-sig")
    open_positions.to_csv(out / "pullback_breakout_v2_open_positions.csv", index=False, encoding="utf-8-sig")
    coverage.to_csv(out / "pullback_breakout_v2_liquidity_coverage.csv", index=False, encoding="utf-8-sig")
    pd.DataFrame(
        [
            {
                "date": date.date().isoformat(),
                "platform": platform,
                "index": row["index"],
                "components": row["components"],
                "component_ids": row["component_ids"],
            }
            for platform in PLATFORMS
            for date, row in market[platform].iterrows()
        ]
    ).to_csv(out / "pullback_breakout_v2_index_diagnostics.csv", index=False, encoding="utf-8-sig")

    buff_zero = summary[(summary["platform"] == "BUFF") & (summary["lock_days_assumption"] == 7) & (summary["friction"] == 0.0)].iloc[0]
    yyyp_zero = summary[(summary["platform"] == "悠悠") & (summary["lock_days_assumption"] == 7) & (summary["friction"] == 0.0)].iloc[0]
    buff_one = summary[(summary["platform"] == "BUFF") & (summary["lock_days_assumption"] == 7) & (summary["friction"] == 0.01)].iloc[0]
    yyyp_one = summary[(summary["platform"] == "悠悠") & (summary["lock_days_assumption"] == 7) & (summary["friction"] == 0.01)].iloc[0]
    report_lines = [
        "# 趋势回调后突破回测 v2",
        "",
        "本报告只使用本地CSV，没有请求API，也没有修改原始历史文件。价格截止日为2026-09-04。当前候选元数据共%d把；实际具有BUFF和悠悠双方历史在售数量的标的为%d把；缺少任一平台历史在售数据的标的为%d把，已排除交易。" % (len(ids), len(trade_ids), len(missing_inventory_ids)),
        "",
        "固定规则：以60个自然日趋势为背景；回调从此前20个自然日高点回撤5%～12%，且回调发生时仍在60日均线上方；设置最多保留20个自然日；等待中跌破60日均线或从设置高点回撤超过12%即失效；同一设置触发一次后必须重新形成新的回调；重新突破此前5个自然日高点才产生信号；信号日收盘后决定，下一有效报价成交；两平台同日都满足条件，并按两平台60日相对各自指数超额收益排序，good_id作为并列排序依据；最多3个不同标的，每仓不超过当时净资产三分之一，只买整数把；跌破买入价8%、从持仓高点回撤8%或持有60个自然日触发退出。",
        "",
        "交易锁定：现有本地资料没有足以确认平台逐项历史锁定时长的统一字段，因此7日和8日分别作为假设情景；止损触发当天只记录触发，必须在触发日次日且锁定期结束后第一个有效报价执行。总摩擦一次性从卖出毛收入中扣除，使单笔净收益等于(卖出价/买入价)×(1-摩擦)-1。",
        "",
        "指数：使用75把价格历史建立每日链式等权指数。当日和前一自然日都有报价的标的才计入当天收益；没有报价不向前填充；新标的从取得连续报价后进入指数。每日成分数和缺失情况见pullback_breakout_v2_index_diagnostics.csv。",
        "",
        "## 流动性覆盖",
        "",
        "交易所需的双方历史在售数量均必须存在，且信号日双方都至少60件。缺少历史在售数据的标的：",
        "",
        ", ".join(f"{row.good_id} {row.name}" for row in coverage[~coverage["tradable_for_signal"]].itertuples()),
        "",
        "## 固定规则结果",
        "",
        "```text",
        summary.to_string(index=False, float_format=lambda x: f"{x:.6f}"),
        "```",
        "",
        "## 验证结果",
        "",
        f"- 原始CSV哈希前后相同：{hash_ok}",
        f"- 截至2024-12-31截断数据后，既有信号未改变：{no_lookahead}",
        f"- 没有信号日当日成交：{no_same_day_buy}",
        f"- 没有锁定期内卖出：{no_locked_sell}",
        f"- 没有负现金：{no_negative_cash}",
        f"- 持仓数量没有超过3个：{no_more_than_three}",
        f"- 没有重复持仓：{no_duplicate_positions}",
        f"- 现金加持仓市值与净值对账：{reconciliation_ok}",
        f"- 价格信号因历史在售数据缺失或低于60而排除的记录：{len(rejections)}",
        f"- 退出样本数量：{json.dumps(exit_reasons, ensure_ascii=False)}",
        f"- 普通最长持有退出样本：{has_ordinary_exit_sample}；移动止损样本：{has_trailing_exit_sample}；跨越2025-10-22事件的实际持仓样本：{has_event_jump_sample}",
        "",
        "普通退出、移动止损和事件跳跌的交易样本见交易明细中的exit_reason与event_between_entry_exit字段。若某类退出在v2实际成交中没有出现，报告保留为无样本，不能用其他版本交易代替。未平仓记录见pullback_breakout_v2_open_positions.csv；本次截至日没有未平仓记录时，该文件仍保留表头。",
        "",
        "## 结论",
        "",
        "修正后的结论发生了变化：v1产生了较多独立信号和假想交易，v2把历史在售量、次日成交、锁定期、整数持仓和最多3仓落实后，只剩3个双平台信号，3000元账户在整数单位约束下每个平台实际成交1笔。结果从“存在可统计交易但表现不佳”变成“按真实执行约束几乎没有可执行机会，已有成交亏损”。",
        f"在7日锁定、0%摩擦下，BUFF唯一已平仓交易平均净收益为{buff_zero['average_net_return']:.2%}、胜率为{buff_zero['net_win_rate']:.0%}；悠悠为{yyyp_zero['average_net_return']:.2%}、胜率为{yyyp_zero['net_win_rate']:.0%}。加入1%摩擦后，BUFF为{buff_one['average_net_return']:.2%}、悠悠为{yyyp_one['average_net_return']:.2%}，最终资产均低于1.3%年化现金基准。",
        "结论变化来自实现修正：历史流动性由信号日双方实际在售数量决定；75把刀的指数改为连续报价链式指数；信号与成交分离到下一有效报价；止损触发后按下一有效报价且受7/8日锁定假设约束；账户使用整数把和现金账本。固定规则没有达到“扣摩擦后正收益且胜率超过50%”。",
        "v2没有出现最长持有退出或跨越2025-10-22的实际持仓，因此这两类事件无法从v2交易中抽查；交易明细明确保留了退出原因和事件标记，没有用其他版本的交易替代。",
    ]
    (out / "pullback_breakout_v2_report.md").write_text("\n".join(report_lines), encoding="utf-8")
    print(f"ids={len(ids)} trade_ids={len(trade_ids)} signals={len(signals)} trades={len(trades)}")
    print(summary.to_string(index=False))
    print(f"validation hash_ok={hash_ok} no_lookahead={no_lookahead} no_same_day_buy={no_same_day_buy} no_locked_sell={no_locked_sell} no_negative_cash={no_negative_cash} no_more_than_three={no_more_than_three} no_duplicate_positions={no_duplicate_positions} reconciliation_ok={reconciliation_ok}")
    print("results/pullback_breakout_v2_trades.csv")
    print("results/pullback_breakout_v2_equity.csv")
    print("results/pullback_breakout_v2_summary.csv")
    print("results/pullback_breakout_v2_report.md")


if __name__ == "__main__":
    main()
