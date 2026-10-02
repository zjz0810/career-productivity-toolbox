from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "results"


def read_csv(name: str) -> pd.DataFrame:
    return pd.read_csv(RESULTS / name, encoding="utf-8-sig")


def aggregate_core(annual: pd.DataFrame) -> pd.DataFrame:
    d = annual[(annual["scope"] == "per_item") & (annual["year"].isin([2023, 2024]))].copy()
    keys = ["platform", "platform_name", "strategy", "execution", "friction_total"]
    rows = []
    for key, g in d.groupby(keys, dropna=False):
        r = dict(zip(keys, key))
        v = pd.to_numeric(g["net_return"], errors="coerce").dropna()
        r.update({"scope": "core_2023_2024", "n_items": int(g["good_id"].nunique()), "n_trades": int(len(v)),
                  "avg_return": float(v.mean()) if len(v) else np.nan,
                  "median_return": float(v.median()) if len(v) else np.nan,
                  "win_rate": float((v > 0).mean()) if len(v) else np.nan,
                  "max_loss": float(v.min()) if len(v) else np.nan})
        rows.append(r)
    return pd.DataFrame(rows)


def main():
    old_summary = read_csv("knife_seasonality_summary.csv")
    new_summary = read_csv("expanded_knife_seasonality_summary.csv")
    old_core = aggregate_core(read_csv("knife_seasonality_annual.csv"))
    new_core = aggregate_core(read_csv("expanded_knife_seasonality_annual.csv"))
    old_all = old_summary[old_summary["scope"] == "all_sample"].copy()
    new_all = new_summary[new_summary["scope"] == "all_sample"].copy()
    common = ["platform", "platform_name", "strategy", "execution", "friction_total"]
    all_cmp = old_all.merge(new_all, on=common, how="outer", suffixes=("_original26", "_expanded75"))
    core_cmp = old_core.merge(new_core, on=common, how="outer", suffixes=("_original26", "_expanded75"))
    for frame in [all_cmp, core_cmp]:
        for metric in ["avg_return", "median_return", "win_rate", "max_loss", "n_trades", "n_items"]:
            left = f"{metric}_expanded75"; right = f"{metric}_original26"
            if left in frame.columns and right in frame.columns:
                frame[f"{metric}_delta"] = frame[left] - frame[right]
    comparison = pd.concat([all_cmp, core_cmp], ignore_index=True, sort=False)
    comparison.to_csv(RESULTS / "knife_expanded_vs_original_seasonality.csv", index=False, encoding="utf-8-sig")

    old_diag = read_csv("knife_current_diagnostic.csv")
    new_diag = read_csv("expanded_knife_current_diagnostic.csv")
    diag_rows = []
    for platform in [1, 2]:
        old = old_diag[old_diag["platform"] == platform]
        new = new_diag[new_diag["platform"] == platform]
        row = {"platform": platform, "platform_name": old["platform_name"].iloc[0], "original_n": len(old), "expanded_n": len(new)}
        for metric in ["return_7d", "return_14d", "return_30d", "return_60d", "return_90d", "index_return_30d", "index_return_60d", "index_return_90d"]:
            old_value = old[metric].mean() if metric in old else np.nan
            new_value = new[metric].mean() if metric in new else np.nan
            row[f"original_{metric}"] = old_value
            row[f"expanded_{metric}"] = new_value
            row[f"delta_{metric}"] = new_value - old_value
        diag_rows.append(row)
    pd.DataFrame(diag_rows).to_csv(RESULTS / "knife_expanded_vs_original_current_diagnostic.csv", index=False, encoding="utf-8-sig")

    lines = ["# 原26样本 vs 扩充75样本", "", "本比较只读取已经保存的 CSQAQ 历史 CSV 及两套本地回测输出；没有重新请求 API，也没有修改原始历史。扩充池为原26个保留样本加49个满足本次筛选条件的新增样本。", "", "## 2023—2024 核心完整样本", "", "以下为逐标的—年份收益的平均，不把缺少历史的标的补成零。", ""]
    focus = core_cmp[core_cmp["strategy"].isin(["7月买-9月卖", "8月买-9月卖"]) & core_cmp["execution"].isin(["A_first5_valid_days", "B_full_month_mean"])].copy()
    for _, r in focus.sort_values(["platform", "strategy", "execution", "friction_total"]).iterrows():
        lines.append(f"- {r['platform_name']} {r['strategy']} {r['execution']} 摩擦 {r['friction_total']:.0%}：原26 {r['avg_return_original26']:.2%}（n={int(r['n_trades_original26'])}），扩充75 {r['avg_return_expanded75']:.2%}（n={int(r['n_trades_expanded75'])}），变化 {r['avg_return_delta']:.2%}。")
    lines += ["", "## 2026-09-04 当前截面", ""]
    for _, r in pd.DataFrame(diag_rows).iterrows():
        lines.append(f"- {r.platform_name}：逐刀平均 30/60/90 日收益，原26 {r.original_return_30d:.2%}/{r.original_return_60d:.2%}/{r.original_return_90d:.2%}；扩充75 {r.expanded_return_30d:.2%}/{r.expanded_return_60d:.2%}/{r.expanded_return_90d:.2%}。")
    lines += ["", "## 解释", "", "扩充样本后的交易数因不同标的历史起点不同而不是简单的75×年份；所有统计均使用实际存在的日期。详细逐组合变化见 CSV。", "", "本文件不构成买入推荐。"]
    (RESULTS / "knife_expanded_vs_original_report.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"完成：季节性比较 {len(comparison)} 行，当前诊断比较 {len(diag_rows)} 行。")


if __name__ == "__main__":
    main()
