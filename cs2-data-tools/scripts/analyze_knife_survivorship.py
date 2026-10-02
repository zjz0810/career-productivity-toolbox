from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RESULTS = ROOT / "results"
TARGET_STRATEGIES = ["7月买-9月卖", "8月买-9月卖"]
TARGET_EXECUTIONS = ["A_first5_valid_days", "B_full_month_mean"]
FRICTIONS = [0.0, 0.03, 0.05]


def summary(frame: pd.DataFrame, keys: list[str], scope: str) -> pd.DataFrame:
    rows = []
    for group_key, group in frame.groupby(keys, dropna=False):
        if not isinstance(group_key, tuple):
            group_key = (group_key,)
        row = dict(zip(keys, group_key))
        values = pd.to_numeric(group["net_return"], errors="coerce").dropna()
        row.update({
            "scope": scope,
            "n_trades": int(len(values)),
            "n_items": int(group["good_id"].nunique()),
            "avg_return": float(values.mean()) if len(values) else np.nan,
            "median_return": float(values.median()) if len(values) else np.nan,
            "win_rate": float((values > 0).mean()) if len(values) else np.nan,
        })
        rows.append(row)
    return pd.DataFrame(rows)


def type_group(value: str) -> str:
    text = str(value)
    if "刺刀" in text:
        return "刺刀"
    if "折叠刀" in text:
        return "折叠刀"
    if "弯刀" in text:
        return "弯刀"
    if "穿肠刀" in text:
        return "穿肠刀"
    if "猎杀者" in text:
        return "猎杀者"
    if "鲍伊" in text:
        return "鲍伊"
    if "暗影双匕" in text:
        return "暗影双匕"
    return "其他刀型"


def main() -> None:
    annual = pd.read_csv(RESULTS / "expanded_knife_seasonality_annual.csv", encoding="utf-8-sig")
    candidates = pd.read_csv(DATA / "knife_candidates_expanded.csv", encoding="utf-8-sig")
    candidates["good_id"] = pd.to_numeric(candidates["good_id"], errors="coerce").astype(int)
    annual = annual[annual["scope"] == "per_item"].copy()
    annual["good_id"] = pd.to_numeric(annual["good_id"], errors="coerce").astype(int)
    annual["year"] = pd.to_numeric(annual["year"], errors="coerce").astype(int)
    d = annual[annual["strategy"].isin(TARGET_STRATEGIES)
               & annual["execution"].isin(TARGET_EXECUTIONS) & annual["year"].isin([2023, 2024])
               & annual["friction_total"].isin(FRICTIONS)].copy()

    yearly = summary(d, ["platform", "platform_name", "year", "strategy", "execution", "friction_total"], "year")
    yearly.to_csv(RESULTS / "knife_survivorship_year_stats.csv", index=False, encoding="utf-8-sig")

    labeled = d.merge(candidates[["good_id", "刀型"]], on="good_id", how="left")
    labeled["刀型分组"] = labeled["刀型"].map(type_group)
    type_rows = []
    for scope, subset in [("2023", labeled[labeled["year"] == 2023]), ("2024", labeled[labeled["year"] == 2024]), ("2023_2024", labeled)]:
        if subset.empty:
            continue
        type_rows.append(summary(subset, ["platform", "platform_name", "刀型分组", "strategy", "execution", "friction_total"], scope))
    type_stats = pd.concat(type_rows, ignore_index=True) if type_rows else pd.DataFrame()
    type_stats.to_csv(RESULTS / "knife_survivorship_type_stats.csv", index=False, encoding="utf-8-sig")

    lines = [
        "# 扩充75刀的当前筛选幸存者偏差检查", "",
        "## 研究口径", "",
        "A：本文件把扩充75刀解释为‘截至2026-09-05仍满足当前筛选条件的刀，在历史上是否呈现季节性’。这不是2023/2024当时可执行的全市场筛选回测。",
        "",
        "B：若没有2023/2024当时每个标的的价格、BUFF在售数量、悠悠在售数量和价格门槛，就不能宣称当时可以只买入今天这75刀。以下结果只能说明条件样本的历史描述，不能消除当前筛选造成的幸存者偏差。",
        "",
        "筛选条件来自2026-09-05 CSQAQ快照：主要价格≤1500元、BUFF在售数量≥60、标准磨损、非StatTrak并排除特殊涂装；原26个样本被保留，即使其中个别不满足新增硬条件。",
        "",
        "## 2023与2024逐年结果", "",
        "结果只使用真实存在的逐标的—年份记录；缺少历史的标的不填零。A为买卖月前5个有效日均价，B为全月均价。",
        "",
    ]
    for _, r in yearly.sort_values(["platform", "year", "strategy", "execution", "friction_total"]).iterrows():
        lines.append(f"- {r['platform_name']} {int(r['year'])} {r['strategy']} {r['execution']} 摩擦 {r['friction_total']:.0%}：观测 {int(r['n_trades'])} 笔/标的 {int(r['n_items'])} 个，平均 {r['avg_return']:.2%}，中位数 {r['median_return']:.2%}，胜率 {r['win_rate']:.2%}。")
    lines += ["", "## 刀型描述性统计", "", "刀型分组只用于描述，不作因果解释；小样本组应视为证据不足。完整结果见 `knife_survivorship_type_stats.csv`。", ""]
    for _, r in type_stats[(type_stats["scope"] == "2023_2024") & (type_stats["friction_total"] == 0)].sort_values(["platform", "strategy", "刀型分组"]).iterrows():
        lines.append(f"- {r['platform_name']} {r['刀型分组']} {r['strategy']} {r['execution']}：观测 {int(r['n_trades'])} 笔/标的 {int(r['n_items'])} 个，平均 {r['avg_return']:.2%}，中位数 {r['median_return']:.2%}，胜率 {r['win_rate']:.2%}。")
    lines += ["", "## 结论", "", "1. 当前75刀池的7→9、8→9历史结果可以作为‘今天仍存活的低价高流动样本’的条件性描述。", "2. 只有当2023/2024当时也能获得同样的在售数量和价格筛选信息，才能把它解释成当时可执行的历史策略；本地现有数据不满足这个条件。", "3. 因此两年统计可以检验条件样本中是否重复出现季节方向，但不能证明全市场季节规律，也不能证明当时按当前筛选规则可以买到这些标的。", "4. 刀型分组为描述性统计，不能据此推断刀型本身造成收益差异。", "", "本报告不构成买入推荐。"]
    (RESULTS / "knife_survivorship_report.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"完成：逐年统计 {len(yearly)} 行，刀型统计 {len(type_stats)} 行。")


if __name__ == "__main__":
    main()
