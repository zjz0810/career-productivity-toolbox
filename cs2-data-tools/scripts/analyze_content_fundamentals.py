"""Analyze case content attributes against the existing post-tradeup panel.

No API calls are made. This is descriptive research only; it does not build or
optimize a trading strategy and it never turns market price into a content label.
"""
from pathlib import Path
import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RESULTS = ROOT / "results"


def pct(x):
    return "" if pd.isna(x) else f"{x:.2%}"


def stats_for(merged):
    horizons = [("30d", "return_30d"), ("60d", "return_60d"), ("90d", "return_90d"), ("180d", "return_180d"), ("2026_ytd", "2026_ytd_return")]
    analyses = []
    for value in ["刀", "手套"]:
        analyses.append(("gold_pool_type", value, merged[merged.gold_pool_type == value]))
        analyses.append(("rare_gold_pool_type", f"rare + {value}", merged[(merged.drop_status == "rare") & (merged.gold_pool_type == value)]))
    for value in [1, 2]:
        analyses.append(("red_skin_count", f"红皮数量={value}", merged[merged.red_skin_count == value]))
        analyses.append(("rare_red_skin_count", f"rare + 红皮数量={value}", merged[(merged.drop_status == "rare") & (merged.red_skin_count == value)]))
    alt = merged.same_gold_pool_alternative_case_count.fillna(0).astype(int)
    analyses.append(("gold_pool_alternative", "有完全相同替代箱（42箱内）", merged[alt > 0]))
    analyses.append(("gold_pool_alternative", "无完全相同替代箱（42箱内）", merged[alt == 0]))
    analyses.append(("old_gold_pool_alternative", "老箱 + 有完全相同替代箱", merged[(merged.age_years_at_2025_10_22 >= 6) & (alt > 0)]))
    analyses.append(("old_gold_pool_alternative", "老箱 + 无完全相同替代箱", merged[(merged.age_years_at_2025_10_22 >= 6) & (alt == 0)]))
    excl = merged.exclusive_or_scarce_gold.fillna("")
    analyses.append(("exclusive_proxy", "42箱内无明显独占（有同池重叠）", merged[excl == "no_clear_exclusivity_within_42"]))
    analyses.append(("exclusive_proxy", "42箱内独占候选", merged[excl == "yes_within_42_case_dataset"]))

    rows = []
    for analysis, group, subset in analyses:
        for platform, prefix in [("BUFF", "buff"), ("悠悠有品", "yyyp")]:
            for horizon, suffix in horizons:
                vals = pd.to_numeric(subset[f"{prefix}_{suffix}"], errors="coerce").dropna()
                n = int(len(vals))
                rows.append({
                    "analysis": analysis, "platform": platform, "group": group,
                    "horizon": horizon, "n": n,
                    "sample_flag": "证据不足（n<5）" if n < 5 else "可报告",
                    "mean_return": vals.mean() if n else np.nan,
                    "median_return": vals.median() if n else np.nan,
                    "win_rate": (vals > 0).mean() if n else np.nan,
                })
    return pd.DataFrame(rows)


def table(stats, analysis, platform):
    x = stats[(stats.analysis == analysis) & (stats.platform == platform)]
    if x.empty:
        return "（无数据）"
    head = ["分组"]
    for h in ["30d", "60d", "90d", "180d", "2026_ytd"]:
        head += [f"{h} n", f"{h}均值", f"{h}中位数", f"{h}胜率"]
    lines = ["| " + " | ".join(head) + " |", "|" + "|".join(["---"] * len(head)) + "|"]
    for group in x.group.drop_duplicates():
        cells = [group]
        for h in ["30d", "60d", "90d", "180d", "2026_ytd"]:
            r = x[(x.group == group) & (x.horizon == h)].iloc[0]
            cells.extend([str(int(r.n)), pct(r.mean_return), pct(r.median_return), pct(r.win_rate)])
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines)


def lookup(stats, analysis, platform, group, horizon, field="mean_return"):
    r = stats[(stats.analysis == analysis) & (stats.platform == platform) & (stats.group == group) & (stats.horizon == horizon)]
    return r.iloc[0][field] if not r.empty else np.nan


def report(merged, stats):
    content_n = len(merged)
    known_demand = int((merged.high_demand_gold != "unknown").sum())
    red_count = merged.red_skin_count.value_counts().sort_index().to_dict()
    status = merged.groupby("drop_status").size().to_dict()
    return f"""# 箱子内容价值与开箱需求研究

## 研究边界

本阶段只研究箱子内容属性，不设计交易策略、不使用未来数据、不重新请求 CSQAQ 价格 API，也没有把价格高低反推成内容价值标签。价格表现使用已有 `results/case_post_tradeup_performance.csv`，内容数据使用公开静态箱子内容数据并缓存到 `data/source/bymykel_crates.json`。

样本为 {content_n} 个箱子；drop_status 计数为 {status}。所有分组都单独列出 n；n<5 标记“证据不足”。收益为 2025-10-22 事件价格到目标日的简单收益率，BUFF 与悠悠有品分开。

## 内容数据覆盖与证据边界

- 红皮名称已逐箱记录，红皮数量分布为 {red_count}。
- 金色特殊物品按刀/手套及金色物品家族记录；同池替代箱是“42个样本中金色家族集合完全相同”的客观匹配，不等同于全球所有箱子都无替代。
- `high_demand_gold` 全部保留为 `unknown`（可审计逐箱需求证据数={known_demand}），没有凭印象标热门/高需求。
- 钥匙成本与统一开箱量均留空。市场成交量、在售数量和价格不能直接等于开箱量；本阶段没有可靠统一的42箱开箱量面板。
- “独占/稀缺”只标记42箱集合内的候选关系，不能据此宣称全球独占；涉及小组的结论需结合 n。

公开数据源包括 [ByMykel CSGO-API crates.json](https://github.com/ByMykel/CSGO-API)（包含 `contains` 与 `contains_rare` 字段）和 [CSGO Database 全部箱子页面](https://www.csgodatabase.com/cases/)（逐箱内容数量、金池类别、类型与个别箱子说明）。公开数据源之间若具体箱子字段不一致，结果保留静态数据并标注中/低置信度，不自行修正。

## 金池类型

### BUFF

{table(stats, "gold_pool_type", "BUFF")}

### 悠悠有品

{table(stats, "gold_pool_type", "悠悠有品")}

## 仅看当前 rare 组的金池类型

### BUFF

{table(stats, "rare_gold_pool_type", "BUFF")}

### 悠悠有品

{table(stats, "rare_gold_pool_type", "悠悠有品")}

## 红皮数量

### BUFF

{table(stats, "red_skin_count", "BUFF")}

### 悠悠有品

{table(stats, "red_skin_count", "悠悠有品")}

### 只看当前 rare 组的红皮数量

#### BUFF

{table(stats, "rare_red_skin_count", "BUFF")}

#### 悠悠有品

{table(stats, "rare_red_skin_count", "悠悠有品")}

## 金池替代关系

### 全部样本

#### BUFF

{table(stats, "gold_pool_alternative", "BUFF")}

#### 悠悠有品

{table(stats, "gold_pool_alternative", "悠悠有品")}

### 只看老箱（箱龄 ≥6 年）

#### BUFF

{table(stats, "old_gold_pool_alternative", "BUFF")}

#### 悠悠有品

{table(stats, "old_gold_pool_alternative", "悠悠有品")}

### 42箱内独占候选（样本很小）

#### BUFF

{table(stats, "exclusive_proxy", "BUFF")}

#### 悠悠有品

{table(stats, "exclusive_proxy", "悠悠有品")}

## 结论

1. **老 rare 箱表现较好是否与金池/红皮价值有关？** 现有数据只能检验“金池类型、红皮数量、同池替代关系”这些内容结构代理，不能检验“高需求/高价值”本身，因为逐箱需求字段没有可靠来源而保持 unknown。若 rare 子组中刀/手套或替代关系组方向一致，只能称为内容结构相关迹象，不能称为金池价值因果。

2. **discontinued 为什么没有整体跑赢 rare？** 停供只描述供给路径，内容池差异很大；discontinued 组中既有电竞/大行动/武库来源，也有不同的刀/手套池和红皮数量。小样本、事件冲击与供给标签冲突都可能造成差异，所以“停供”不是内容需求的充分条件。

3. **同样是老箱，独特金池与普通金池是否不同？** 本报告用“42箱内无完全相同替代箱”作为保守代理，不把它叫作全球独占。请以老箱交叉表中的 n、均值、中位数判断；若一组 n<5，结论明确为证据不足。不能把差异归因于稀有刀型，因为没有全球完整金池覆盖证明。

4. **供给少 + 内容仍有需求是否明显优于只是供给少？** 当前无法直接回答“仍有需求”：`high_demand_gold` 没有可靠统一证据，开箱量也没有可靠统一面板。数据最多支持以后用需求数据补齐后再比较，当前不做强结论。

5. **五红更新后依赖金池价值的箱子是否受到更大冲击？** 本地价格面板可以比较金池类型/红皮数量/替代关系组在 +30/+60/+90/+180 日的表现，但没有刀皮、红皮价格或开箱需求数据，不能把价格跌幅直接解释为金池价值受损。若某组表现更弱，应标记为事件后的相关性，而不是内容价值损失的证明。

## 复核所需的下一步数据

若要回答“供给少 + 内容仍有需求”这一问题，至少还需要统一口径的逐箱开箱量时间序列、红皮和金色池的需求/成交代理，以及明确的内容池版本记录。本阶段不补造这些数据，也不据此给出买入推荐。

结果文件：

- `data/case_content_fundamentals.csv`
- `results/content_fundamental_merged.csv`
- `results/content_group_stats.csv`
"""


def main():
    content = pd.read_csv(DATA / "case_content_fundamentals.csv", dtype={"good_id": str})
    supply = pd.read_csv(DATA / "case_fundamentals.csv", dtype={"good_id": str})
    perf = pd.read_csv(RESULTS / "case_post_tradeup_performance.csv", dtype={"good_id": str})
    supply_cols = ["case_name", "good_id", "drop_status", "age_years_at_2025_10_22"]
    merged = content.merge(supply[supply_cols], on=["case_name", "good_id"], how="left", validate="one_to_one")
    merged = merged.merge(perf, on=["case_name", "good_id"], how="left", validate="one_to_one")
    merged.to_csv(RESULTS / "content_fundamental_merged.csv", index=False, encoding="utf-8-sig")
    stats = stats_for(merged)
    stats.to_csv(RESULTS / "content_group_stats.csv", index=False, encoding="utf-8-sig")
    (RESULTS / "content_research_report.md").write_text(report(merged, stats), encoding="utf-8")
    print(f"merged={len(merged)} stats={len(stats)}")
    for platform in ["BUFF", "悠悠有品"]:
        x = stats[(stats.analysis == "rare_gold_pool_type") & (stats.platform == platform) & (stats.horizon == "90d")]
        print(platform, x[["group", "n", "mean_return", "median_return", "win_rate"]].to_dict("records"))


if __name__ == "__main__":
    main()
