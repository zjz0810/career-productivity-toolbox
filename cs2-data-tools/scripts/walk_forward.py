"""Strict, local-only walk-forward analysis for CSQAQ case histories.

This script deliberately reads only data/cases.csv and data/raw. It never calls an API.
All features at a decision date are calculated from observations dated on or before it.
"""
from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RAW = DATA / "raw"
RESULTS = ROOT / "results"
RESULTS.mkdir(parents=True, exist_ok=True)

CUTOFF = pd.Timestamp("2026-09-04")
FOCUS_START = pd.Timestamp("2024-09-05")
EVENTS = {
    pd.Timestamp("2025-07-15"): "Trade Protection/可撤回交易",
    pd.Timestamp("2025-10-22"): "五红合刀/手套",
}
FRICTIONS = [0.00, 0.03, 0.05, 0.08]
PLATFORMS = {1: "BUFF", 2: "悠悠有品"}
THRESHOLDS = [-0.15, -0.20, -0.25]


def clean(v) -> str:
    return str(v).replace("\n", " ").replace("\r", " ").strip()


def fmt(v, digits=4):
    if v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v))):
        return ""
    return round(float(v), digits)


def json_or_empty(values: Sequence[str]) -> str:
    return json.dumps(list(values), ensure_ascii=False)


def c_params(strategy: str) -> Tuple[List[int], List[int]]:
    """Fixed, executable calendar months for each C variant."""
    mapping = {
        "C_6to10": ([6], [10]), "C_6to11": ([6], [11]),
        "C_7to10": ([7], [10]), "C_7to11": ([7], [11]),
        "C_8to10": ([8], [10]), "C_8to11": ([8], [11]),
        "C_staggered_to10": ([6, 7, 8], [10]),
        "C_staggered_to11": ([6, 7, 8], [11]),
    }
    return mapping[strategy]


def load_histories() -> Tuple[pd.DataFrame, Dict[Tuple[int, str], pd.DataFrame]]:
    cases = pd.read_csv(DATA / "cases.csv", dtype={"good_id": str}, encoding="utf-8-sig")
    cases["good_id"] = cases["good_id"].astype(str)
    cases["case_name"] = cases["case_name"].map(clean)
    histories: Dict[Tuple[int, str], pd.DataFrame] = {}
    for platform, folder in [(1, "buff"), (2, "yyyp")]:
        for path in sorted((RAW / folder).glob("*.csv")):
            df = pd.read_csv(path, encoding="utf-8-sig")
            if df.empty or not {"date", "price"}.issubset(df.columns):
                continue
            df["date"] = pd.to_datetime(df["date"], errors="coerce")
            df["price"] = pd.to_numeric(df["price"], errors="coerce")
            df = df.dropna(subset=["date", "price"])
            df = df[df["price"] > 0].sort_values("date").drop_duplicates("date", keep="last")
            if df.empty:
                continue
            row = df.iloc[-1]
            good_id = str(row.get("good_id", path.name.split("_", 1)[0]))
            name = clean(row.get("case_name", path.stem.split("_", 1)[-1]))
            histories[(platform, good_id)] = df[["date", "price"]].reset_index(drop=True)
    return cases, histories


def last_row(df: pd.DataFrame, date: pd.Timestamp) -> Optional[pd.Series]:
    x = df[df["date"] <= date]
    return None if x.empty else x.iloc[-1]


def first_row(df: pd.DataFrame, date: pd.Timestamp) -> Optional[pd.Series]:
    x = df[df["date"] >= date]
    return None if x.empty else x.iloc[0]


def price_asof(df: pd.DataFrame, date: pd.Timestamp) -> float:
    r = last_row(df, date)
    return float(r["price"]) if r is not None else float("nan")


def forward_price(df: pd.DataFrame, date: pd.Timestamp) -> float:
    r = first_row(df, date)
    return float(r["price"]) if r is not None else float("nan")


def past_return(df: pd.DataFrame, date: pd.Timestamp, days: int) -> float:
    now = last_row(df, date)
    old = last_row(df, date - pd.Timedelta(days=days))
    if now is None or old is None or float(old["price"]) <= 0:
        return float("nan")
    return float(now["price"]) / float(old["price"]) - 1.0


def drawdown(window: pd.DataFrame) -> float:
    if window.empty:
        return float("nan")
    peak = window["price"].cummax()
    return float((window["price"] / peak - 1).min())


def features(df: pd.DataFrame, date: pd.Timestamp) -> dict:
    hist = df[df["date"] <= date].copy()
    if hist.empty:
        return {}
    current = float(hist.iloc[-1]["price"])
    one_year = hist[hist["date"] >= date - pd.Timedelta(days=365)]
    two_year = hist[hist["date"] >= date - pd.Timedelta(days=730)]
    f = {
        "current_price": current,
        "ret7": past_return(df, date, 7),
        "ret14": past_return(df, date, 14),
        "ret30": past_return(df, date, 30),
        "ret90": past_return(df, date, 90),
        "ret180": past_return(df, date, 180),
        "pct1y": float((one_year["price"] <= current).mean()) if not one_year.empty else float("nan"),
        "pct2y": float((two_year["price"] <= current).mean()) if not two_year.empty else float("nan"),
        "max_dd_1y": drawdown(one_year),
        "max_dd_2y": drawdown(two_year),
        "current_sell_num": float("nan"),  # raw chart has no inventory series
        "asof_date": hist.iloc[-1]["date"].strftime("%Y-%m-%d"),
    }
    f["stabilizing"] = bool(
        pd.notna(f["ret30"])
        and pd.notna(f["ret7"])
        and pd.notna(f["ret14"])
        and (f["ret7"] >= 0 or f["ret14"] >= 0 or (f["ret7"] > f["ret14"] > f["ret30"]))
    )
    f["A"] = bool(pd.notna(f["pct1y"]) and f["pct1y"] <= 0.30 and pd.notna(f["ret30"]) and f["ret30"] < 0 and f["stabilizing"])
    f["B"] = bool(pd.notna(f["ret90"]) and f["ret90"] > 0 and pd.notna(f["ret30"]) and f["ret30"] > 0 and pd.notna(f["pct2y"]) and f["pct2y"] < 0.90)
    f["D15"] = bool(pd.notna(f["ret30"]) and f["ret30"] <= -0.15)
    f["D20"] = bool(pd.notna(f["ret30"]) and f["ret30"] <= -0.20)
    f["D25"] = bool(pd.notna(f["ret30"]) and f["ret30"] <= -0.25)
    return f


def decision_dates(histories: Dict[Tuple[int, str], pd.DataFrame]) -> List[pd.Timestamp]:
    dates = sorted({d for df in histories.values() for d in df["date"] if d <= CUTOFF})
    if not dates:
        return []
    all_dates = pd.Series(pd.to_datetime(dates)).drop_duplicates().sort_values()
    groups = all_dates.groupby(all_dates.dt.to_period("M"))
    return [g.iloc[0] for _, g in groups]


def all_features(decisions: Sequence[pd.Timestamp], histories: Dict[Tuple[int, str], pd.DataFrame]) -> Dict[Tuple[int, pd.Timestamp, str], dict]:
    out = {}
    for platform in PLATFORMS:
        for date in decisions:
            for (_, good_id), df in [(k, v) for k, v in histories.items() if k[0] == platform]:
                f = features(df, date)
                if f:
                    out[(platform, date, good_id)] = f
    return out


def signal_ids(strategy: str, platform: int, date: pd.Timestamp, feats: Dict[Tuple[int, pd.Timestamp, str], dict], histories: Dict[Tuple[int, str], pd.DataFrame]) -> List[str]:
    ids = []
    for (p, d, good_id), f in feats.items():
        if p != platform or d != date or not pd.notna(f.get("current_price")):
            continue
        if strategy == "A_low_reversal" and f.get("A"):
            ids.append(good_id)
        elif strategy == "B_trend" and f.get("B"):
            ids.append(good_id)
        elif strategy.startswith("C_"):
            month = date.month
            buy_months, _ = c_params(strategy)
            if month in buy_months:
                ids.append(good_id)
        elif strategy.startswith("D_"):
            threshold = float(strategy.split("_")[-1])
            if f.get("ret30", float("nan")) <= threshold:
                ids.append(good_id)
    # C is a portfolio state machine; return [] in its sell months.
    if strategy.startswith("C_") and date.month in c_params(strategy)[1]:
        return []
    return sorted(set(ids))


def target_for(strategy: str, platform: int, date: pd.Timestamp, feats, histories, previous: List[str]) -> List[str]:
    if strategy.startswith("C_"):
        month = date.month
        buy_months, sell = c_params(strategy)
        if month in sell:
            return []
        if month in buy_months:
            return signal_ids(strategy, platform, date, feats, histories)
        return previous
    return signal_ids(strategy, platform, date, feats, histories)


def net_cost_factor(old: List[str], new: List[str], friction: float) -> Tuple[float, int]:
    if not old and not new:
        return 1.0, 0
    if old == new:
        return 1.0, 0
    legs = (1 if old else 0) + (1 if new else 0)
    # A change of equal-weight basket means one sell leg and one buy leg.
    return (1.0 - friction) ** (legs / 2.0), legs


def portfolio_intervals(strategy: str, platform: int, decisions, feats, histories, friction: float, cutoff=CUTOFF) -> pd.DataFrame:
    rows = []
    equity = 1.0
    old_ids: List[str] = []
    prev_date = None
    for date in decisions:
        if date > cutoff:
            break
        if prev_date is not None:
            returns = []
            for good_id in old_ids:
                df = histories.get((platform, good_id))
                if df is None:
                    continue
                p0, p1 = price_asof(df, prev_date), price_asof(df, date)
                if pd.notna(p0) and pd.notna(p1) and p0 > 0:
                    returns.append(p1 / p0 - 1)
            gross = float(np.mean(returns)) if returns else 0.0
            equity_before = equity
            equity *= 1 + gross
            new_ids = target_for(strategy, platform, date, feats, histories, old_ids)
            factor, legs = net_cost_factor(old_ids, new_ids, friction)
            equity *= factor
            rows.append({
                "strategy": strategy, "platform": platform, "platform_name": PLATFORMS[platform],
                "friction": friction, "period_start": prev_date.strftime("%Y-%m-%d"),
                "period_end": date.strftime("%Y-%m-%d"), "gross_return": gross,
                "net_return": equity / equity_before - 1 if equity_before else float("nan"),
                "equity_before": equity_before, "equity_after": equity,
                "active_count": len(old_ids), "rebalanced": old_ids != new_ids,
                "transaction_legs": legs, "selected_good_ids": ";".join(new_ids),
            })
            old_ids = new_ids
        else:
            old_ids = target_for(strategy, platform, date, feats, histories, [])
            factor, legs = net_cost_factor([], old_ids, friction)
            before = equity
            equity *= factor
            rows.append({
                "strategy": strategy, "platform": platform, "platform_name": PLATFORMS[platform],
                "friction": friction, "period_start": date.strftime("%Y-%m-%d"),
                "period_end": date.strftime("%Y-%m-%d"), "gross_return": 0.0,
                "net_return": equity / before - 1, "equity_before": before, "equity_after": equity,
                "active_count": len(old_ids), "rebalanced": bool(old_ids), "transaction_legs": legs,
                "selected_good_ids": ";".join(old_ids),
            })
        prev_date = date
    if prev_date is not None and prev_date < cutoff:
        returns = []
        for good_id in old_ids:
            df = histories.get((platform, good_id))
            if df is None:
                continue
            p0, p1 = price_asof(df, prev_date), price_asof(df, cutoff)
            if pd.notna(p0) and pd.notna(p1) and p0 > 0:
                returns.append(p1 / p0 - 1)
        gross = float(np.mean(returns)) if returns else 0.0
        before = equity
        equity *= 1 + gross
        factor, legs = net_cost_factor(old_ids, [], friction)
        equity *= factor
        rows.append({
            "strategy": strategy, "platform": platform, "platform_name": PLATFORMS[platform],
            "friction": friction, "period_start": prev_date.strftime("%Y-%m-%d"),
            "period_end": cutoff.strftime("%Y-%m-%d"), "gross_return": gross,
            "net_return": equity / before - 1, "equity_before": before, "equity_after": equity,
            "active_count": len(old_ids), "rebalanced": bool(old_ids), "transaction_legs": legs,
            "selected_good_ids": "",
        })
    return pd.DataFrame(rows)


def sample_mask(df: pd.DataFrame, sample: str) -> pd.Series:
    s = pd.to_datetime(df["period_start"])
    e = pd.to_datetime(df["period_end"])
    if sample == "train_2023_2024":
        return (s >= pd.Timestamp("2023-01-01")) & (e <= pd.Timestamp("2024-12-31"))
    if sample == "oos_2025_2026":
        return (s >= pd.Timestamp("2025-01-01")) & (e <= CUTOFF)
    if sample == "focus_since_2024_09_05":
        return (e >= FOCUS_START) & (e <= CUTOFF)
    return e <= CUTOFF


def metrics(periods: pd.DataFrame, sample: str) -> dict:
    x = periods[sample_mask(periods, sample)].copy()
    if x.empty:
        return {"sample": sample, "n_periods": 0, "total_return": np.nan, "annualized_return": np.nan, "win_rate": np.nan, "max_drawdown": np.nan, "sharpe": np.nan, "longest_drawdown_days": np.nan, "trade_count": 0, "transaction_count": 0, "final_3000": np.nan, "annual_returns": "{}"}
    r = pd.to_numeric(x["net_return"], errors="coerce").fillna(0)
    equity = (1 + r).cumprod()
    total = float(equity.iloc[-1] - 1)
    days = max(1, (pd.to_datetime(x["period_end"]).iloc[-1] - pd.to_datetime(x["period_start"]).iloc[0]).days)
    ann = float((1 + total) ** (365.25 / days) - 1) if 1 + total > 0 else np.nan
    peak = equity.cummax()
    dd = equity / peak - 1
    max_dd = float(dd.min())
    active = x[x["active_count"] > 0]
    sharpe = float(active["net_return"].mean() / active["net_return"].std(ddof=1) * math.sqrt(12)) if len(active) >= 3 and active["net_return"].std(ddof=1) > 0 else np.nan
    longest = 0
    start = None
    for _, row in x.iterrows():
        if row["equity_after"] < x.loc[x.index[:len(x[x.index <= row.name])], "equity_after"].cummax().iloc[-1] - 1e-12:
            start = start or pd.Timestamp(row["period_start"])
            longest = max(longest, (pd.Timestamp(row["period_end"]) - start).days)
        else:
            start = None
    years = {}
    for year, grp in x.groupby(pd.to_datetime(x["period_end"]).dt.year):
        years[str(year)] = float((1 + grp["net_return"]).prod() - 1)
    return {
        "sample": sample, "n_periods": len(x), "total_return": total, "annualized_return": ann,
        "win_rate": float((active["net_return"] > 0).mean()) if not active.empty else np.nan,
        "max_drawdown": max_dd, "sharpe": sharpe, "longest_drawdown_days": longest,
        "trade_count": int((x["active_count"] > 0).sum()), "transaction_count": int(x["transaction_legs"].sum()),
        "final_3000": 3000 * (1 + total), "annual_returns": json.dumps(years, ensure_ascii=False),
    }


def dip_repair(histories, feats, decisions) -> pd.DataFrame:
    rows = []
    for platform in PLATFORMS:
        for good_id in sorted({k[1] for k in histories if k[0] == platform}):
            previous = {t: np.nan for t in THRESHOLDS}
            last_signal = {t: None for t in THRESHOLDS}
            for date in decisions:
                if date > CUTOFF:
                    break
                f = feats.get((platform, date, good_id), {})
                r30 = f.get("ret30", np.nan)
                if pd.isna(r30):
                    continue
                for threshold in THRESHOLDS:
                    crossed = r30 <= threshold and (pd.isna(previous[threshold]) or previous[threshold] > threshold)
                    cooldown = last_signal[threshold] is None or date - last_signal[threshold] >= pd.Timedelta(days=90)
                    if crossed and cooldown:
                        entry = price_asof(histories[(platform, good_id)], date)
                        for horizon in [30, 60, 90]:
                            exit_date = date + pd.Timedelta(days=horizon)
                            erow = first_row(histories[(platform, good_id)], exit_date)
                            if erow is None or not pd.notna(entry) or entry <= 0:
                                continue
                            actual_exit = erow["date"]
                            gross = float(erow["price"]) / entry - 1
                            event_flags = [name for ev, name in EVENTS.items() if ev >= date - pd.Timedelta(days=30) and ev <= actual_exit + pd.Timedelta(days=30)]
                            rows.append({
                                "platform": platform, "platform_name": PLATFORMS[platform], "good_id": good_id,
                                "entry_date": date.strftime("%Y-%m-%d"), "entry_price": entry, "threshold": threshold,
                                "horizon_days": horizon, "exit_date": actual_exit.strftime("%Y-%m-%d"),
                                "exit_price": float(erow["price"]), "gross_return": gross,
                                "event_flag": ";".join(event_flags), "ordinary_only": not bool(event_flags),
                            })
                        last_signal[threshold] = date
                previous.update({t: r30 for t in THRESHOLDS})
    return pd.DataFrame(rows)


def dip_metrics(dips: pd.DataFrame) -> List[dict]:
    out = []
    for (platform, threshold, horizon), g in dips.groupby(["platform", "threshold", "horizon_days"]):
        for sample in ["full", "train_2023_2024", "oos_2025_2026"]:
            d = pd.to_datetime(g["entry_date"])
            if sample == "train_2023_2024":
                x = g[(d >= "2023-01-01") & (d <= "2024-12-31")]
            elif sample == "oos_2025_2026":
                x = g[(d >= "2025-01-01") & (d <= CUTOFF)]
            else:
                x = g
            x = x[x["ordinary_only"] == True]
            for friction in FRICTIONS:
                nr = (1 + x["gross_return"]) * (1 - friction) - 1
                ordered = x.assign(net_return=nr).sort_values("exit_date") if len(x) else x.assign(net_return=pd.Series(dtype=float))
                if len(ordered):
                    path = (1 + ordered["net_return"]).cumprod()
                    peak = path.cummax()
                    dd = path / peak - 1
                    dip_max_dd = float(dd.min())
                    dip_sharpe = float(ordered["net_return"].mean() / ordered["net_return"].std(ddof=1) * math.sqrt(365 / horizon)) if len(ordered) >= 3 and ordered["net_return"].std(ddof=1) > 0 else np.nan
                    longest = 0
                    dd_start = None
                    for (idx, trade), dd_value in zip(ordered.iterrows(), dd):
                        if dd_value < -1e-12:
                            dd_start = dd_start or pd.Timestamp(trade["entry_date"])
                            longest = max(longest, (pd.Timestamp(trade["exit_date"]) - dd_start).days)
                        else:
                            dd_start = None
                else:
                    dip_max_dd, dip_sharpe, longest = np.nan, np.nan, np.nan
                out.append({
                    "strategy": f"D_dip_repair_{int(abs(threshold)*100)}pct_{horizon}d", "platform": platform,
                    "platform_name": PLATFORMS[platform], "friction": friction, "sample": sample,
                    "n_periods": len(x), "total_return": float(nr.mean()) if len(x) else np.nan,
                    "annualized_return": float(((1 + nr.mean()) ** (365 / horizon) - 1)) if len(x) and 1 + nr.mean() > 0 else np.nan,
                    "win_rate": float((nr > 0).mean()) if len(x) else np.nan,
                    "max_drawdown": dip_max_dd, "sharpe": dip_sharpe, "longest_drawdown_days": longest,
                    "trade_count": len(x), "transaction_count": len(x) * 2,
                    "final_3000": float(3000 * (1 + nr.mean())) if len(x) else np.nan,
                    "annual_returns": "{}", "dip_trade_aggregate": "mean_trade_return",
                })
    return out


def current_candidates(cases, histories, cutoff=CUTOFF) -> pd.DataFrame:
    rows = []
    for _, case in cases.iterrows():
        good_id = str(case["good_id"])
        row = {"case_name": clean(case["case_name"]), "good_id": good_id}
        for platform, label in PLATFORMS.items():
            df = histories.get((platform, good_id))
            f = features(df, cutoff) if df is not None else {}
            prefix = "buff" if platform == 1 else "yyyp"
            for key in ["current_price", "pct1y", "pct2y", "ret30", "ret90", "ret180", "max_dd_1y", "current_sell_num", "asof_date"]:
                row[f"{prefix}_{key}"] = f.get(key, np.nan)
            triggers = []
            if f.get("A"): triggers.append("A_low_reversal")
            if f.get("B"): triggers.append("B_trend")
            d_hits = [f"D{int(abs(t)*100)}" for t in THRESHOLDS if f.get(f"D{int(abs(t)*100)}", False)]
            triggers.extend(d_hits)
            row[f"{prefix}_triggered_rules"] = ";".join(triggers)
            if triggers and not (pd.notna(f.get("pct2y")) and f["pct2y"] >= .90):
                status = "当前可以买"
            elif pd.notna(f.get("pct2y")) and f["pct2y"] >= .90:
                status = "当前不碰"
            else:
                status = "当前只观察"
            row[f"{prefix}_status"] = status
            row[f"{prefix}_trigger_count"] = len(triggers)
        rows.append(row)
    out = pd.DataFrame(rows)
    for prefix in ["buff", "yyyp"]:
        buys = out[out[f"{prefix}_status"] == "当前可以买"].sort_values([f"{prefix}_trigger_count", f"{prefix}_pct1y", "good_id"], ascending=[False, True, True])
        ranks = {idx: i + 1 for i, idx in enumerate(buys.index)}
        out[f"{prefix}_buy_rank"] = out.index.map(ranks).fillna("")
    out["asof_cutoff"] = cutoff.strftime("%Y-%m-%d")
    return out


def event_comparison(cases, histories) -> pd.DataFrame:
    event = pd.Timestamp("2025-10-22")
    rows = []
    for platform in PLATFORMS:
        values = []
        for _, case in cases.iterrows():
            good_id = str(case["good_id"])
            df = histories.get((platform, good_id))
            if df is None: continue
            base = last_row(df, event)
            if base is None: continue
            base_price = float(base["price"])
            values.append((good_id, base_price))
        median = float(np.median([v for _, v in values])) if values else np.nan
        for good_id, base_price in values:
            case_name = clean(cases.loc[cases["good_id"].astype(str) == good_id, "case_name"].iloc[0])
            rec = {"section": "case_recovery", "platform": platform, "platform_name": PLATFORMS[platform], "case_name": case_name, "good_id": good_id, "event_date": event.strftime("%Y-%m-%d"), "event_group": "金池状态：待补充（CSQAQ历史数据未提供）", "price_group": "低价箱" if base_price < median else "贵价箱", "event_price": base_price}
            for horizon in [30, 60, 90]:
                r = first_row(histories[(platform, good_id)], event + pd.Timedelta(days=horizon))
                rec[f"return_{horizon}d"] = float(r["price"] / base_price - 1) if r is not None else np.nan
            rec["recovery_score"] = np.nanmean([rec.get("return_30d", np.nan), rec.get("return_60d", np.nan), rec.get("return_90d", np.nan)])
            rows.append(rec)
        case_rows = pd.DataFrame([r for r in rows if r["platform"] == platform])
        for group_name, group in [("全部箱子", case_rows), ("低价箱", case_rows[case_rows["price_group"] == "低价箱"]), ("贵价箱", case_rows[case_rows["price_group"] == "贵价箱"])]:
            rows.append({"section": "group_comparison", "platform": platform, "platform_name": PLATFORMS[platform], "case_name": group_name, "good_id": "", "event_date": event.strftime("%Y-%m-%d"), "event_group": "金池状态待补充", "price_group": group_name, "event_price": group["event_price"].mean() if not group.empty else np.nan, "return_30d": group["return_30d"].mean() if not group.empty else np.nan, "return_60d": group["return_60d"].mean() if not group.empty else np.nan, "return_90d": group["return_90d"].mean() if not group.empty else np.nan, "recovery_score": group["recovery_score"].mean() if not group.empty else np.nan})
    return pd.DataFrame(rows)


def before_after(strategy_periods: Dict[Tuple[str, int, float], pd.DataFrame]) -> pd.DataFrame:
    rows = []
    event = pd.Timestamp("2025-10-22")
    for (strategy, platform, friction), periods in strategy_periods.items():
        for label, mask in [("before_tradeup", pd.to_datetime(periods["period_end"]) < event), ("after_tradeup", pd.to_datetime(periods["period_start"]) > event + pd.Timedelta(days=30))]:
            x = periods[mask]
            m = metrics(x.assign(period_start=x["period_start"], period_end=x["period_end"]), "full") if not x.empty else metrics(periods.iloc[0:0], "full")
            rows.append({"section": "strategy_before_after", "row_type": "summary", "strategy": strategy, "platform": platform, "platform_name": PLATFORMS[platform], "friction": friction, "period": label, **m})
    return pd.DataFrame(rows)


def run():
    cases, histories = load_histories()
    decisions = decision_dates(histories)
    feats = all_features(decisions, histories)
    strategies = ["A_low_reversal", "B_trend", "C_6to10", "C_7to10", "C_8to10", "C_6to11", "C_7to11", "C_8to11", "C_staggered_to10", "C_staggered_to11"]
    summary_rows = []
    trade_frames = []
    strategy_periods = {}
    for strategy in strategies:
        for platform in PLATFORMS:
            for friction in FRICTIONS:
                periods = portfolio_intervals(strategy, platform, decisions, feats, histories, friction)
                if periods.empty: continue
                strategy_periods[(strategy, platform, friction)] = periods
                trade_frames.append(periods)
                for sample in ["full", "train_2023_2024", "oos_2025_2026", "focus_since_2024_09_05"]:
                    summary_rows.append({"strategy": strategy, "platform": platform, "platform_name": PLATFORMS[platform], "friction": friction, **metrics(periods, sample)})
    dips = dip_repair(histories, feats, decisions)
    dips.to_csv(RESULTS / "walk_forward_dip_repair.csv", index=False, encoding="utf-8-sig")
    summary_rows.extend(dip_metrics(dips))
    summary = pd.DataFrame(summary_rows)
    summary.to_csv(RESULTS / "walk_forward_summary.csv", index=False, encoding="utf-8-sig")
    pd.concat(trade_frames, ignore_index=True).to_csv(RESULTS / "walk_forward_trades.csv", index=False, encoding="utf-8-sig")
    candidates = current_candidates(cases, histories)
    candidates.to_csv(RESULTS / "current_candidates.csv", index=False, encoding="utf-8-sig")
    comp = event_comparison(cases, histories)
    strat = before_after(strategy_periods)
    pd.concat([comp, strat], ignore_index=True, sort=False).to_csv(RESULTS / "before_vs_after_tradeup.csv", index=False, encoding="utf-8-sig")
    report(cases, histories, summary, candidates, comp, strat, decisions, dips)
    print(f"histories={len(histories)} cases={len(cases)} decisions={len(decisions)}")
    print(f"outputs={len(list(RESULTS.glob('walk_forward*')))}")


def report(cases, histories, summary, candidates, comp, strat, decisions, dips):
    def get(strategy, platform, friction=.05, sample="oos_2025_2026"):
        x = summary[(summary.strategy == strategy) & (summary.platform == platform) & (summary.friction == friction) & (summary['sample'] == sample)]
        return x.iloc[0] if not x.empty else None
    lines = [
        "# CS2 武器箱无未来数据泄漏策略回测报告",
        "",
        "## 数据与方法",
        "",
        f"本报告只读取本地 CSQAQ 历史 CSV，未重新请求 API。样本包含 {len(cases)} 个箱子、{len(histories)//2} 个 good_id、两个平台各 {len([k for k in histories if k[0]==1])} 个历史序列。月度决策日取每月第一个有效交易日，特征严格使用该日及之前的数据；当前截面截止 {CUTOFF.date()}。库存/在售数量历史序列未在 chart CSV 中提供，因此不将其用于规则。",
        "",
        "训练期固定为 2023–2024，样本外期固定为 2025–2026；样本外结果没有反向修改规则。组合按满足规则的箱子等权，月度调仓。组合指标按月度净值计算；D 暴跌修复为逐笔入场、30/60/90 日退出。摩擦按总买卖摩擦计，使用 0%、3%、5%、8% 四档。",
        "",
        "策略 A：过去 1 年价格不高于 30% 分位、30 日为负，且 7/14 日出现止跌/转正；策略 B：90 日和 30 日均为正，且 2 年分位低于 90%；策略 C：6/7/8 月在月初有效日买入，10/11 月月初有效日卖出；策略 D：30 日跌幅首次穿越 -15%/-20%/-25%，并剔除事件污染交易后单独统计。",
        "",
        "## 5% 摩擦下的训练期 / 样本外结果",
        "",
        "|策略|平台|训练期年化|训练期总收益|样本外年化|样本外总收益|样本外胜率|最大回撤|Sharpe|交易期数|3000元期末|",
        "|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|",
    ]
    for s in ["A_low_reversal", "B_trend", "C_6to10", "C_7to10", "C_8to10", "C_6to11", "C_7to11", "C_8to11", "C_staggered_to10", "C_staggered_to11"]:
        for p in PLATFORMS:
            tr, oo = get(s, p, .05, "train_2023_2024"), get(s, p, .05, "oos_2025_2026")
            if tr is None or oo is None: continue
            lines.append(f"|{s}|{PLATFORMS[p]}|{fmt(tr.annualized_return)}|{fmt(tr.total_return)}|{fmt(oo.annualized_return)}|{fmt(oo.total_return)}|{fmt(oo.win_rate)}|{fmt(oo.max_drawdown)}|{fmt(oo.sharpe)}|{int(oo.trade_count)}|{fmt(oo.final_3000,2)}|")
    lines += ["", "完整摩擦敏感性见 `walk_forward_summary.csv`；每年收益、最长回撤时间和交易笔数也在该文件中。", "", "## 事件前后与五红更新", "", "五红事件日为 2025-10-22。事件分析的金池/掉落状态在 CSQAQ 本地历史数据中没有提供，报告不虚构该标签；因此只做全部箱子与事件日价格中位数划分的低价/贵价比较。", "", "|平台|分组|30日变化|60日变化|90日变化|", "|---|---|---:|---:|---:|"]
    for _, r in comp[comp.section == "group_comparison"].iterrows():
        lines.append(f"|{r.platform_name}|{r.price_group}|{fmt(r.get('return_30d'))}|{fmt(r.get('return_60d'))}|{fmt(r.get('return_90d'))}|")
    lines += ["", "按事件后 30/60/90 日平均变化排序，恢复最快的前 3 个箱子如下（这只是事件后的恢复速度，不是当前买入推荐）："]
    for platform in PLATFORMS:
        x = comp[(comp.section == "case_recovery") & (comp.platform == platform)].sort_values("recovery_score", ascending=False).head(3)
        names = "；".join(f"{r.case_name}（30日 {fmt(r.return_30d)}，60日 {fmt(r.return_60d)}，90日 {fmt(r.return_90d)}）" for _, r in x.iterrows())
        lines.append(f"- {PLATFORMS[platform]}：{names or '无足够数据'}")
    lines += ["", "策略同一套规则在五红前后（事件后留出 30 天缓冲）5% 摩擦表现见该文件的 `strategy_before_after` 行；该比较用于检验结构变化，不把事件本身混入普通 D 下跌信号。", "", "## 当前候选（截至 2026-09-04）", "", "当前状态按平台分别判断，不混合 BUFF 与悠悠价格；不使用未来收益或历史涨幅排名。当前可以买名单按触发规则数、1 年分位排序，最多取前 3 个作为候选。", ""]
    for prefix, label in [("buff", "BUFF"), ("yyyp", "悠悠有品")]:
        lines.append(f"### {label}")
        lines.append("")
        lines.append("|状态|箱子|当前价|1年分位|30日|90日|180日|1年最大回撤|触发规则|")
        lines.append("|---|---|---:|---:|---:|---:|---:|---:|---|")
        ordered = candidates.sort_values([f"{prefix}_status", f"{prefix}_buy_rank"], na_position="last")
        for _, r in ordered.iterrows():
            if r[f"{prefix}_status"] == "当前只观察" or r[f"{prefix}_status"] == "当前不碰" or (r[f"{prefix}_buy_rank"] != "" and float(r[f"{prefix}_buy_rank"]) <= 3):
                lines.append(f"|{r[f'{prefix}_status']}|{r.case_name}|{fmt(r[f'{prefix}_current_price'],2)}|{fmt(r[f'{prefix}_pct1y'])}|{fmt(r[f'{prefix}_ret30'])}|{fmt(r[f'{prefix}_ret90'])}|{fmt(r[f'{prefix}_ret180'])}|{fmt(r[f'{prefix}_max_dd_1y'])}|{clean(r[f'{prefix}_triggered_rules']) or '无'}|")
        lines.append("")
    lines += ["## 结论", ""]
    # Data-derived headline conclusions.
    oos5 = summary[(summary["sample"] == "oos_2025_2026") & (summary["friction"] == .05)].copy()
    stable = oos5[(oos5["annualized_return"] > 0) & (oos5["total_return"] > 0) & (oos5["win_rate"] > .5) & (oos5["trade_count"] >= 3)]
    best = oos5.sort_values("annualized_return", ascending=False).head(1)
    buy_counts = {label: int((candidates[f"{prefix}_status"] == "当前可以买").sum()) for prefix, label in [("buff", "BUFF"), ("yyyp", "悠悠有品")]}
    top = candidates[(candidates.buff_status == "当前可以买") | (candidates.yyyp_status == "当前可以买")].copy()
    if not stable.empty:
        s = stable.iloc[0]
        lines.append(f"1. 稳定正期望：按预先固定的筛选标准（样本外总收益、年化均为正，胜率超过 50%，至少 3 个持有期），5% 摩擦下有 {len(stable)} 个平台-策略组合满足；其中样本外年化最高为 {s.strategy}/{s.platform_name}，年化 {fmt(s.annualized_return)}。这只表示历史样本外正结果，不保证未来。")
    else:
        lines.append("1. 稳定正期望：5% 摩擦下，没有平台-策略组合同时满足样本外总收益为正、年化为正、胜率超过 50% 且至少 3 个持有期；不能据此宣称存在稳定正期望策略。")
    bench = 3000 * (1.013 ** (365.25 / 365.25))
    lines.append(f"2. 5% 摩擦与理财：1.3% 年化作为基准，3000 元一年约为 {bench:.2f} 元。是否显著超过要看样本外年化；不能只看事后最高涨幅。")
    lines.append(f"3. 3000 元当前行动：截至 {CUTOFF.date()}，规则触发的候选数为 BUFF {buy_counts['BUFF']} 个、悠悠有品 {buy_counts['悠悠有品']} 个。由于该报告不把当前信号当作未来收益保证，若样本外 5% 摩擦没有稳定通过，应保持观望并等待规则信号确认。")
    if not top.empty:
        top["_rank_num"] = pd.to_numeric(top["buff_buy_rank"], errors="coerce").fillna(999999)
        buff_names = "、".join(top[top["buff_status"] == "当前可以买"].sort_values(["_rank_num", "case_name"]).case_name.head(3).tolist()) or "无"
        top["_rank_num_yyyp"] = pd.to_numeric(top["yyyp_buy_rank"], errors="coerce").fillna(999999)
        yyyp_names = "、".join(top[top["yyyp_status"] == "当前可以买"].sort_values(["_rank_num_yyyp", "case_name"]).case_name.head(3).tolist()) or "无"
        lines.append(f"4. 若必须按规则建立观察仓，候选最多 3 个（仅列当前触发规则者，不是历史涨幅推荐）：BUFF 为 {buff_names}；悠悠有品为 {yyyp_names}。具体分平台指标见 `current_candidates.csv`。")
    else:
        lines.append("4. 当前没有箱子同时触发可执行买入规则，因此按规则最多买 3 个为空。")
    lines.append("5. 等待信号：A 需要低于过去一年 30% 分位、30 日仍为负但 7/14 日止跌；B 需要 30/90 日均为正且不在过去两年 90% 以上高位；D 需要 30 日跌幅穿越固定阈值。五红事件标签与掉落状态缺失时，不将其猜测为金池或普通箱。")
    lines += ["", "## 文件", "", "- `walk_forward_summary.csv`：A/B/C/D 在不同摩擦与样本区间的统计。", "- `walk_forward_trades.csv`：月度组合区间、持仓、净值和交易腿数。", "- `walk_forward_dip_repair.csv`：D 策略逐笔 30/60/90 日结果及事件污染标记。", "- `current_candidates.csv`：截至 2026-09-04 的平台分离候选截面。", "- `before_vs_after_tradeup.csv`：五红事件分组恢复与策略前后对比。", ""]
    (RESULTS / "report.md").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    run()
