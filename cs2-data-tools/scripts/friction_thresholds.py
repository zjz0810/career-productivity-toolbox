"""Calculate OOS friction-rate boundaries from existing walk-forward CSVs.

No API calls are made here. Portfolio A/B/C uses the recorded 0%-friction gross
periods and transaction legs; D uses the existing ordinary-only trade outcomes.
"""
from pathlib import Path
import math
import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "results"
CUTOFF = pd.Timestamp("2026-09-04")
BENCHMARK = 0.013
PLATFORMS = {1: "BUFF", 2: "悠悠有品"}


def boundary(gross_equity: float, target_equity: float, exposure: float):
    if not np.isfinite(gross_equity) or gross_equity <= 0 or exposure <= 0:
        return np.nan, "无有效交易暴露"
    root = 1.0 - (target_equity / gross_equity) ** (1.0 / exposure)
    if root < -1e-12:
        return np.nan, "0%摩擦下已低于目标，无非负摩擦率解"
    if root > 1 + 1e-12:
        return 1.0, "临界点超过100%，按100%封顶"
    return max(0.0, float(root)), "临界边界（严格跑赢需低于该值）"


def portfolio_rows(trades: pd.DataFrame):
    rows = []
    zero = trades[np.isclose(trades["friction"], 0.0)].copy()
    zero["period_start"] = pd.to_datetime(zero["period_start"])
    zero["period_end"] = pd.to_datetime(zero["period_end"])
    oos = zero[(zero["period_start"] >= pd.Timestamp("2025-01-01")) & (zero["period_end"] <= CUTOFF)]
    for (strategy, platform), g in oos.groupby(["strategy", "platform"]):
        gross_equity = float((1.0 + g["gross_return"].astype(float)).prod())
        exposure = float(g["transaction_legs"].astype(float).sum()) / 2.0
        days = max(1, (g["period_end"].max() - g["period_start"].min()).days)
        base_total = gross_equity - 1.0
        base_ann = gross_equity ** (365.25 / days) - 1.0
        break_even, status0 = boundary(gross_equity, 1.0, exposure)
        target = 1.0 + BENCHMARK
        target_equity = target ** (days / 365.25)
        beat, status1 = boundary(gross_equity, target_equity, exposure)
        rows.append({
            "platform": platform, "platform_name": PLATFORMS[platform], "strategy": strategy,
            "model_type": "monthly_portfolio", "aggregation": "monthly equal-weight portfolio",
            "sample": "oos_2025_2026", "horizon_days": days, "n_periods": len(g),
            "transaction_exposure_legs": int(g["transaction_legs"].sum()),
            "base_return_at_0_friction": base_total, "base_annualized_at_0_friction": base_ann,
            "max_total_friction_break_even": break_even,
            "max_total_friction_beat_1_3_annualized": beat,
            "benchmark_annualized": BENCHMARK, "break_even_status": status0,
            "beat_benchmark_status": status1,
            "interpretation": "总摩擦率 f；双边调仓乘(1-f)，单边初始/最终交易乘sqrt(1-f)；临界点严格跑赢需小于该值。",
        })
    return rows


def dip_rows(dips: pd.DataFrame):
    rows = []
    x = dips.copy()
    x["entry_date"] = pd.to_datetime(x["entry_date"])
    x["exit_date"] = pd.to_datetime(x["exit_date"])
    x["gross_return"] = pd.to_numeric(x["gross_return"], errors="coerce")
    x["ordinary_only"] = x["ordinary_only"].astype(str).str.lower().eq("true")
    x = x[(x["ordinary_only"]) & (x["entry_date"] >= pd.Timestamp("2025-01-01")) & (x["entry_date"] <= CUTOFF)]
    for (platform, threshold, horizon), g in x.groupby(["platform", "threshold", "horizon_days"]):
        mean_gross = float(g["gross_return"].mean())
        base_ann = (1.0 + mean_gross) ** (365.25 / float(horizon)) - 1.0 if 1 + mean_gross > 0 else np.nan
        be, status0 = boundary(1.0 + mean_gross, 1.0, 1.0)
        target_trade_return = (1.0 + BENCHMARK) ** (float(horizon) / 365.25) - 1.0
        beat, status1 = boundary(1.0 + mean_gross, 1.0 + target_trade_return, 1.0)
        rows.append({
            "platform": platform, "platform_name": PLATFORMS[platform],
            "strategy": f"D_dip_repair_{int(abs(threshold) * 100)}pct_{int(horizon)}d",
            "model_type": "dip_repair_trade_aggregate", "aggregation": "ordinary-only equal-weight mean trade",
            "sample": "oos_2025_2026", "horizon_days": int(horizon), "n_periods": len(g),
            "transaction_exposure_legs": int(len(g) * 2), "trigger_threshold": threshold,
            "base_return_at_0_friction": mean_gross, "base_annualized_at_0_friction": base_ann,
            "max_total_friction_break_even": be,
            "max_total_friction_beat_1_3_annualized": beat,
            "benchmark_annualized": BENCHMARK, "break_even_status": status0,
            "beat_benchmark_status": status1,
            "interpretation": "D为普通交易的等权平均结果，不把不同箱子交易虚构成同一时点组合；事件污染交易已剔除。",
        })
    return rows


def append_report(result: pd.DataFrame):
    report_path = RESULTS / "report.md"
    original = report_path.read_text(encoding="utf-8") if report_path.exists() else "# CS2 武器箱回测报告\n"
    marker = "## 样本外摩擦率临界点"
    if marker in original:
        original = original.split(marker, 1)[0].rstrip() + "\n"
    lines = ["", marker, "", "以下临界值全部来自 2025–2026 样本外结果，沿用本项目的总买卖摩擦率口径。数值是边界：要严格跑赢目标，实际摩擦应低于该值；若显示“无解”，表示 0% 摩擦下已经低于目标。", "", "|平台|策略|0%摩擦样本外年化|盈亏平衡最大总摩擦|跑赢1.3%年化最大总摩擦|样本数|说明|", "|---|---|---:|---:|---:|---:|---|"]
    for _, r in result.sort_values(["platform", "strategy"]).iterrows():
        def v(name):
            val = r.get(name)
            return "无解" if pd.isna(val) else f"{float(val):.4%}"
        note = str(r["break_even_status"])
        lines.append(f"|{r['platform_name']}|{r['strategy']}|{v('base_annualized_at_0_friction')}|{v('max_total_friction_break_even')}|{v('max_total_friction_beat_1_3_annualized')}|{int(r['n_periods'])}|{note}|")
    lines += ["", "D 策略的临界率是逐笔普通交易平均收益口径；A/B/C 是月度等权组合口径，不能把两类数字当成同一种投资组合净值。", ""]
    report_path.write_text(original + "\n".join(lines), encoding="utf-8")


def main():
    trades = pd.read_csv(RESULTS / "walk_forward_trades.csv", encoding="utf-8-sig")
    dips = pd.read_csv(RESULTS / "walk_forward_dip_repair.csv", encoding="utf-8-sig")
    result = pd.DataFrame(portfolio_rows(trades) + dip_rows(dips))
    result.to_csv(RESULTS / "oos_friction_thresholds.csv", index=False, encoding="utf-8-sig")
    append_report(result)
    print(f"rows={len(result)}")
    print(result[["platform_name", "strategy", "max_total_friction_break_even", "max_total_friction_beat_1_3_annualized"]].to_string(index=False))


if __name__ == "__main__":
    main()
