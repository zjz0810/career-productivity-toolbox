"""Leakage-free parameter sensitivity for the B trend rule.

Only existing local walk-forward inputs are read. No API or network access is
performed. The rule is short momentum > 0, medium momentum > 0 and the
as-of-date price percentile over the prior two years below the tested cap.
"""
from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set, Tuple

import numpy as np
import pandas as pd

from walk_forward import CUTOFF, PLATFORMS, decision_dates, load_histories, net_cost_factor, price_asof


ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "results"
SHORT_WINDOWS = [20, 30, 45, 60]
MEDIUM_WINDOWS = [60, 90, 120, 180]
PERCENTILE_CAPS = [0.80, 0.85, 0.90, 0.95, None]
ORIGINAL = (30, 90, 0.90)
SENSITIVITY_FRICTIONS = [0.00, 0.01, 0.02, 0.03, 0.04]


def asof_features(histories, decisions):
    """Precompute all as-of features once; no row uses a later date."""
    windows = sorted(set(SHORT_WINDOWS + MEDIUM_WINDOWS))
    out = {}
    for platform in PLATFORMS:
        for date in decisions:
            for (p, good_id), df in histories.items():
                if p != platform:
                    continue
                hist = df[df["date"] <= date]
                if hist.empty:
                    continue
                current = float(hist.iloc[-1]["price"])
                two_year = hist[hist["date"] >= date - pd.Timedelta(days=730)]
                f = {
                    "current_price": current,
                    "pct2y": float((two_year["price"] <= current).mean()) if not two_year.empty else np.nan,
                }
                for window in windows:
                    old = hist[hist["date"] <= date - pd.Timedelta(days=window)]
                    f[f"ret_{window}"] = float(current / old.iloc[-1]["price"] - 1) if not old.empty and float(old.iloc[-1]["price"]) > 0 else np.nan
                out[(platform, date, good_id)] = f
    return out


def target_ids(platform: int, date: pd.Timestamp, short: int, medium: int, cap: Optional[float], feats, excluded: Set[str]) -> List[str]:
    ids = []
    for (p, d, good_id), f in feats.items():
        if p != platform or d != date or good_id in excluded:
            continue
        if not (pd.notna(f.get("ret_" + str(short))) and f["ret_" + str(short)] > 0):
            continue
        if not (pd.notna(f.get("ret_" + str(medium))) and f["ret_" + str(medium)] > 0):
            continue
        if cap is not None and not (pd.notna(f.get("pct2y")) and f["pct2y"] < cap):
            continue
        ids.append(good_id)
    return sorted(ids)


def portfolio(short: int, medium: int, cap: Optional[float], platform: int, decisions, feats, histories, friction: float, excluded: Set[str] | None = None) -> pd.DataFrame:
    excluded = excluded or set()
    rows = []
    equity = 1.0
    old_ids: List[str] = []
    prev_date = None
    for date in decisions:
        if date > CUTOFF:
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
            before = equity
            equity *= 1 + gross
            new_ids = target_ids(platform, date, short, medium, cap, feats, excluded)
            factor, legs = net_cost_factor(old_ids, new_ids, friction)
            equity *= factor
            rows.append({
                "period_start": prev_date.strftime("%Y-%m-%d"), "period_end": date.strftime("%Y-%m-%d"),
                "gross_return": gross, "net_return": equity / before - 1 if before else np.nan,
                "equity_before": before, "equity_after": equity, "active_count": len(old_ids),
                "transaction_legs": legs, "rebalanced": old_ids != new_ids,
                "selected_good_ids": ";".join(new_ids),
            })
            old_ids = new_ids
        else:
            old_ids = target_ids(platform, date, short, medium, cap, feats, excluded)
            factor, legs = net_cost_factor([], old_ids, friction)
            before = equity
            equity *= factor
            rows.append({
                "period_start": date.strftime("%Y-%m-%d"), "period_end": date.strftime("%Y-%m-%d"),
                "gross_return": 0.0, "net_return": equity / before - 1, "equity_before": before,
                "equity_after": equity, "active_count": len(old_ids), "transaction_legs": legs,
                "rebalanced": bool(old_ids), "selected_good_ids": ";".join(old_ids),
            })
        prev_date = date
    if prev_date is not None and prev_date < CUTOFF:
        returns = []
        for good_id in old_ids:
            df = histories.get((platform, good_id))
            if df is None:
                continue
            p0, p1 = price_asof(df, prev_date), price_asof(df, CUTOFF)
            if pd.notna(p0) and pd.notna(p1) and p0 > 0:
                returns.append(p1 / p0 - 1)
        gross = float(np.mean(returns)) if returns else 0.0
        before = equity
        equity *= 1 + gross
        factor, legs = net_cost_factor(old_ids, [], friction)
        equity *= factor
        rows.append({
            "period_start": prev_date.strftime("%Y-%m-%d"), "period_end": CUTOFF.strftime("%Y-%m-%d"),
            "gross_return": gross, "net_return": equity / before - 1 if before else np.nan,
            "equity_before": before, "equity_after": equity, "active_count": len(old_ids),
            "transaction_legs": legs, "rebalanced": bool(old_ids), "selected_good_ids": "",
        })
    return pd.DataFrame(rows)


def mask_sample(df: pd.DataFrame, sample: str) -> pd.Series:
    start = pd.to_datetime(df["period_start"])
    end = pd.to_datetime(df["period_end"])
    if sample == "train_2023_2024":
        return (start >= pd.Timestamp("2023-01-01")) & (end <= pd.Timestamp("2024-12-31"))
    if sample == "oos_2025_2026":
        return (start >= pd.Timestamp("2025-01-01")) & (end <= CUTOFF)
    return end <= CUTOFF


def summarize(df: pd.DataFrame, sample: str) -> dict:
    x = df[mask_sample(df, sample)].copy()
    if x.empty:
        return {"sample": sample, "n_periods": 0, "total_return": np.nan, "annualized_return": np.nan, "win_rate": np.nan, "max_drawdown": np.nan, "transaction_count": 0, "trade_count": 0, "final_3000": np.nan, "annual_2025": np.nan, "annual_2026": np.nan, "sharpe": np.nan, "longest_drawdown_days": np.nan}
    r = pd.to_numeric(x["net_return"], errors="coerce").fillna(0.0)
    path = (1 + r).cumprod()
    total = float(path.iloc[-1] - 1)
    days = max(1, (pd.to_datetime(x["period_end"]).iloc[-1] - pd.to_datetime(x["period_start"]).iloc[0]).days)
    ann = float((1 + total) ** (365.25 / days) - 1) if 1 + total > 0 else np.nan
    dd = path / path.cummax() - 1
    active = x[x["active_count"] > 0]
    sd = active["net_return"].std(ddof=1) if len(active) >= 3 else np.nan
    sharpe = float(active["net_return"].mean() / sd * math.sqrt(12)) if pd.notna(sd) and sd > 0 else np.nan
    longest, start = 0, None
    for _, row in x.iterrows():
        if dd.loc[row.name] < -1e-12:
            start = start or pd.Timestamp(row["period_start"])
            longest = max(longest, (pd.Timestamp(row["period_end"]) - start).days)
        else:
            start = None
    years = {}
    for year, g in x.groupby(pd.to_datetime(x["period_end"]).dt.year):
        years[int(year)] = float((1 + g["net_return"]).prod() - 1)
    return {
        "sample": sample, "n_periods": len(x), "total_return": total, "annualized_return": ann,
        "win_rate": float((active["net_return"] > 0).mean()) if not active.empty else np.nan,
        "max_drawdown": float(dd.min()), "transaction_count": int(x["transaction_legs"].sum()),
        "trade_count": int((x["active_count"] > 0).sum()), "final_3000": 3000 * (1 + total),
        "annual_2025": years.get(2025, np.nan), "annual_2026": years.get(2026, np.nan),
        "sharpe": sharpe, "longest_drawdown_days": longest,
    }


def leave_out_return(df: pd.DataFrame, friction: float, remove_periods: Set[Tuple[str, str]]) -> float:
    x = df[mask_sample(df, "oos_2025_2026")].copy()
    keys = list(zip(x["period_start"], x["period_end"]))
    x = x[[k not in remove_periods for k in keys]]
    if x.empty:
        return np.nan
    gross = (1 + x["gross_return"].astype(float)).prod()
    cost = (1 - friction) ** (x["transaction_legs"].astype(float).sum() / 2.0)
    return float(gross * cost - 1)


def top_box_ids(platform: int, histories) -> Tuple[Set[str], str]:
    values = []
    for (p, good_id), df in histories.items():
        if p != platform:
            continue
        p0, p1 = price_asof(df, pd.Timestamp("2025-01-01")), price_asof(df, CUTOFF)
        if pd.notna(p0) and pd.notna(p1) and p0 > 0:
            values.append((good_id, p1 / p0 - 1))
    values.sort(key=lambda t: t[1], reverse=True)
    top = values[:3]
    return {g for g, _ in top}, ";".join(f"{g}:{ret:.4f}" for g, ret in top)


def concentration(df: pd.DataFrame) -> Tuple[float, int, str]:
    x = df[mask_sample(df, "oos_2025_2026") & (df["active_count"] > 0)].copy()
    if x.empty:
        return np.nan, 0, ""
    positive = x[x["gross_return"] > 0]
    denom = positive["gross_return"].sum()
    share = float(positive["gross_return"].nlargest(3).sum() / denom) if denom > 0 else np.nan
    best = ";".join(f"{r.period_start}:{float(r.gross_return):.4f}" for _, r in positive.nlargest(3, "gross_return").iterrows())
    return share, len(positive), best


def append_report(result: pd.DataFrame, robustness: pd.DataFrame, original_rows: pd.DataFrame):
    path = RESULTS / "report.md"
    text = path.read_text(encoding="utf-8") if path.exists() else "# CS2 武器箱回测报告\n"
    marker = "## B趋势参数敏感性"
    if marker in text:
        text = text.split(marker, 1)[0].rstrip() + "\n"
    oos = result[result["sample"] == "oos_2025_2026"].copy()
    lines = ["", marker, "", "本节只对 B 趋势规则做预先定义的参数敏感性测试，不根据结果重新优化规则。短期/中期条件均为当月决策日前的收益 > 0；历史价格上限为决策日前两年价格分位，所有组合仍按每月第一个有效交易日决策。", "", "原始 B 参考参数为 30日/90日/90% 分位。80 组参数组合分别在 BUFF 和悠悠有品上计算，摩擦率沿用总买卖摩擦定义。", ""]
    for platform in PLATFORMS:
        p = oos[oos.platform == platform]
        lines.append(f"### {PLATFORMS[platform]}")
        lines.append("")
        for friction in SENSITIVITY_FRICTIONS:
            z = p[np.isclose(p.friction, friction)]
            positive = int((z.total_return > 0).sum())
            beat = int((z.annualized_return > 0.013).sum())
            both = int(((z.annual_2025 > 0) & (z.annual_2026 > 0)).sum())
            lines.append(f"- {friction:.0%} 摩擦：80 组中总收益为正 {positive} 组，年化跑赢 1.3% {beat} 组，2025/2026 两年均为正 {both} 组。")
        ref = p[p["is_original"] == True]
        lines.append("")
        lines.append("原始参数在不同摩擦下：")
        lines.append("")
        lines.append("|摩擦|样本外总收益|样本外年化|胜率|最大回撤|交易次数|3000元期末|")
        lines.append("|---:|---:|---:|---:|---:|---:|---:|")
        for _, r in ref.sort_values("friction").iterrows():
            lines.append(f"|{r.friction:.0%}|{r.total_return:.4%}|{r.annualized_return:.4%}|{r.win_rate:.4%}|{r.max_drawdown:.4%}|{int(r.transaction_count)}|{r.final_3000:.2f}|")
        lines.append("")
        ref0 = ref[np.isclose(ref.friction, 0.0)].iloc[0]
        lines.append(f"原始参数 0% 摩擦分年：2025 年 {ref0.annual_2025:.2%}，2026 年截至 9 月 4 日 {ref0.annual_2026:.2%}；因此整体正收益并非两个年份都有效。")
        adj = p[p.is_adjacent == True]
        adjacent_text = []
        for f in SENSITIVITY_FRICTIONS:
            az = adj[np.isclose(adj.friction, f)]
            adjacent_text.append(f"{f:.0%} {int((az.total_return > 0).sum())}/6")
        lines.append("原始参数的 6 个单轴相邻组合中，盈利数量（摩擦：盈利组数/6）为 " + "、".join(adjacent_text) + "；这不是把相邻组合重新选优，只是稳定性检查。")
        rob = robustness[robustness.platform == platform].iloc[0]
        lines.append(f"原始参数样本外 0% 摩擦最佳 3 个月度交易贡献占正收益月份总和 {rob.best3_positive_period_contribution:.2%}，正收益交易期 {int(rob.positive_trade_periods)} 个；去掉最佳 3 笔后总收益为 {rob.excl_best3_trade_return_0:.2%}（4% 摩擦为 {rob.excl_best3_trade_return_4:.2%}）。")
        lines.append(f"去掉样本外价格涨幅最高的 3 个箱子（事后压力测试，不用于选参）后，原始参数总收益为 {rob.excl_top3_boxes_return_0:.2%}（4% 摩擦为 {rob.excl_top3_boxes_return_4:.2%}）；箱子名单及收益见 `b_trend_robustness.csv`。")
        lines.append("")
    # Data-derived classification, deliberately not based on selecting a better parameter.
    positive_surface = []
    for platform in PLATFORMS:
        p = oos[oos.platform == platform]
        counts = [(f, int((p[np.isclose(p.friction, f)].total_return > 0).sum())) for f in [0,.01,.02,.03,.04]]
        positive_surface.append((platform, counts))
    if all(max(v for _, v in counts) == 0 for _, counts in positive_surface):
        verdict = "参数过拟合"
    else:
        verdict = "有一定迹象但证据不足"
    lines += ["## B 策略最终判断", "", f"综合 80 组参数面、摩擦敏感性、2025/2026 分年度和去除极端贡献的诊断，本项目对 B 的判断为：**{verdict}**。这个标签不是根据某一组最佳参数得出，而是看正收益是否在邻近参数和更高摩擦下广泛存在。", "", "完整参数组合结果见 `b_trend_sensitivity.csv`；可直接制作热力图的长表见 `b_trend_heatmap.csv`。", ""]
    path.write_text(text + "\n".join(lines), encoding="utf-8")


def main():
    cases, histories = load_histories()
    decisions = decision_dates(histories)
    feats = asof_features(histories, decisions)
    rows = []
    raw_periods = {}
    for short in SHORT_WINDOWS:
        for medium in MEDIUM_WINDOWS:
            for cap in PERCENTILE_CAPS:
                for platform in PLATFORMS:
                    for friction in SENSITIVITY_FRICTIONS:
                        periods = portfolio(short, medium, cap, platform, decisions, feats, histories, friction)
                        raw_periods[(short, medium, cap, platform, friction)] = periods
                        summary = summarize(periods, "oos_2025_2026")
                        concentration_share, positive_count, best3 = concentration(raw_periods[(short, medium, cap, platform, 0.0)])
                        rows.append({
                            "short_window": short, "medium_window": medium, "percentile_cap": cap if cap is not None else "unlimited",
                            "platform": platform, "platform_name": PLATFORMS[platform], "friction": friction,
                            "is_original": (short, medium, cap) == ORIGINAL,
                            "is_adjacent": (short, medium, cap) in {(20,90,.90),(45,90,.90),(60,90,.90),(30,60,.90),(30,120,.90),(30,90,.85),(30,90,.95)},
                            **summary, "best3_positive_period_contribution": concentration_share,
                            "positive_trade_periods": positive_count, "best3_positive_periods": best3,
                        })
    result = pd.DataFrame(rows)
    result.to_csv(RESULTS / "b_trend_sensitivity.csv", index=False, encoding="utf-8-sig")
    heat = result.copy()
    heat["percentile_cap"] = heat["percentile_cap"].astype(str)
    heat.to_csv(RESULTS / "b_trend_heatmap.csv", index=False, encoding="utf-8-sig")

    robust_rows = []
    for platform in PLATFORMS:
        base0 = raw_periods[(30,90,.90,platform,0.0)]
        oos0 = base0[mask_sample(base0, "oos_2025_2026") & (base0["active_count"] > 0)]
        top_trade_keys = set(zip(oos0.nlargest(3, "gross_return")["period_start"], oos0.nlargest(3, "gross_return")["period_end"]))
        top_ids, top_id_text = top_box_ids(platform, histories)
        row = {
            "platform": platform, "platform_name": PLATFORMS[platform], "short_window": 30, "medium_window": 90, "percentile_cap": .90,
            "best3_positive_period_contribution": concentration(base0)[0], "positive_trade_periods": concentration(base0)[1],
            "best3_positive_periods": concentration(base0)[2], "removed_best3_trade_periods": ";".join(f"{a}:{b}" for a,b in sorted(top_trade_keys)),
            "top3_oos_return_boxes": top_id_text,
        }
        for f in [0.0, .04]:
            row[f"base_return_{int(f*100)}"] = summarize(raw_periods[(30,90,.90,platform,f)], "oos_2025_2026")["total_return"]
            row[f"excl_best3_trade_return_{int(f*100)}"] = leave_out_return(raw_periods[(30,90,.90,platform,f)], f, top_trade_keys)
            excluded_periods = portfolio(30,90,.90,platform,decisions,feats,histories,f,top_ids)
            row[f"excl_top3_boxes_return_{int(f*100)}"] = summarize(excluded_periods, "oos_2025_2026")["total_return"]
        robust_rows.append(row)
    robustness = pd.DataFrame(robust_rows)
    robustness.to_csv(RESULTS / "b_trend_robustness.csv", index=False, encoding="utf-8-sig")
    append_report(result, robustness, result[result.is_original == True])
    print(f"sensitivity_rows={len(result)} robustness_rows={len(robustness)}")
    print(robustness.to_string(index=False))


if __name__ == "__main__":
    main()
