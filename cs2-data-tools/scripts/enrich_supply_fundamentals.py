"""Enrich case fundamentals from public references and analyze post-tradeup performance.

This script is intentionally local-only with respect to project data: it reads the
already downloaded CSQAQ price panel and does not call CSQAQ or any API.  Public
reference URLs are stored with each row so classifications can be audited later.
"""
from pathlib import Path
import math
import re

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RESULTS = ROOT / "results"
EVENT = pd.Timestamp("2025-10-22")
CUTOFF = pd.Timestamp("2026-09-04")

STEAMDB = "https://steamdb.com/en/skins/cs2/drop-pool"
CS2IO = "https://cs2.io/en/skins/drop-pool"
GUIDE = "https://steamcommunity.com/sharedfiles/filedetails?id=3540423918"
CSGODB = "https://www.csgodatabase.com/"

# Dates and the case provenance/type come from the public case timeline/guide.
# Where the public pages disagree with the local CSQAQ metadata, the public
# timeline is used and the discrepancy is recorded in notes.
META = {
    "Chroma Case": ("2015-01-08", "普通"),
    "Chroma 3 Case": ("2016-04-27", "普通"),
    "Falchion Case": ("2015-05-26", "大行动"),
    "CS:GO Weapon Case": ("2013-08-14", "普通"),
    "CS:GO Weapon Case 2": ("2013-11-08", "普通"),
    "CS:GO Weapon Case 3": ("2014-02-12", "普通"),
    "Chroma 2 Case": ("2015-04-15", "普通"),
    "Gamma 2 Case": ("2016-08-18", "普通"),
    "Gamma Case": ("2016-06-15", "普通"),
    "Glove Case": ("2016-11-28", "普通"),
    "Huntsman Weapon Case": ("2014-05-01", "普通"),
    "Operation Bravo Case": ("2013-09-19", "大行动"),
    "Operation Breakout Weapon Case": ("2014-07-01", "大行动"),
    "Operation Hydra Case": ("2017-05-23", "大行动"),
    "Operation Phoenix Weapon Case": ("2014-02-20", "大行动"),
    "Operation Vanguard Weapon Case": ("2014-11-11", "大行动"),
    "Operation Wildfire Case": ("2016-02-17", "大行动"),
    "Revolver Case": ("2015-12-08", "普通"),
    "Shadow Case": ("2015-09-17", "普通"),
    "Spectrum 2 Case": ("2017-09-14", "普通"),
    "Spectrum Case": ("2017-03-15", "普通"),
    "Winter Offensive Weapon Case": ("2013-12-18", "大行动"),
    "eSports 2013 Case": ("2013-08-14", "电竞"),
    "eSports 2013 Winter Case": ("2013-12-18", "电竞"),
    "eSports 2014 Summer Case": ("2014-07-10", "电竞"),
    "Clutch Case": ("2018-02-14", "普通"),
    "Horizon Case": ("2018-08-02", "普通"),
    "Danger Zone Case": ("2018-12-06", "普通"),
    "Prisma Case": ("2019-03-13", "普通"),
    "CS20 Case": ("2019-10-18", "周年/活动"),
    "Shattered Web Case": ("2019-11-18", "大行动"),
    "Prisma 2 Case": ("2020-03-31", "普通"),
    "Fracture Case": ("2020-08-06", "普通"),
    "Operation Broken Fang Case": ("2020-12-03", "大行动"),
    "Snakebite Case": ("2021-05-03", "普通"),
    "Operation Riptide Case": ("2021-09-22", "大行动"),
    "Dreams & Nightmares Case": ("2022-01-20", "普通"),
    "Recoil Case": ("2022-07-01", "普通"),
    "Revolution Case": ("2023-02-09", "普通"),
    "Kilowatt Case": ("2024-02-07", "普通"),
    "Gallery Case": ("2024-10-02", "武库/活动"),
    "Fever Case": ("2025-04-01", "武库/活动"),
}

# Current status snapshot: SteamDB and CS2.IO agree on the six active weekly
# cases as of 2026-07-02.  The community guide disagrees for Fever/Recoil/
# Fracture and also lists seven zero-chance cases.  We retain the two-source
# snapshot for the main status field and downgrade conflicting rows.
ACTIVE = {"Fever Case", "Kilowatt Case", "Revolution Case", "Recoil Case", "Dreams & Nightmares Case", "Fracture Case"}
DISCONTINUED = {
    "Gallery Case", "Operation Riptide Case", "Operation Broken Fang Case",
    "Shattered Web Case", "eSports 2014 Summer Case", "eSports 2013 Winter Case",
    "eSports 2013 Case",
}

CN_TO_EN = {
    "幻彩武器箱": "Chroma Case", "幻彩 3 号武器箱": "Chroma 3 Case", "弯曲猎手武器箱": "Falchion Case",
    "反恐精英武器箱": "CS:GO Weapon Case", "反恐精英 2 号武器箱": "CS:GO Weapon Case 2", "反恐精英 3 号武器箱": "CS:GO Weapon Case 3",
    "幻彩 2 号武器箱": "Chroma 2 Case", "伽玛 2 号武器箱": "Gamma 2 Case", "伽玛武器箱": "Gamma Case",
    "手套武器箱": "Glove Case", "猎杀者武器箱": "Huntsman Weapon Case", "“英勇大行动”武器箱": "Operation Bravo Case",
    "“突围大行动”武器箱": "Operation Breakout Weapon Case", "“九头蛇大行动”武器箱": "Operation Hydra Case", "“凤凰大行动”武器箱": "Operation Phoenix Weapon Case",
    "“先锋大行动”武器箱": "Operation Vanguard Weapon Case", "“野火大行动”武器箱": "Operation Wildfire Case", "左轮武器箱": "Revolver Case",
    "暗影武器箱": "Shadow Case", "光谱 2 号武器箱": "Spectrum 2 Case", "光谱武器箱": "Spectrum Case", "冬季攻势武器箱": "Winter Offensive Weapon Case",
    "电竞 2013 武器箱": "eSports 2013 Case", "电竞 2013 冬季武器箱": "eSports 2013 Winter Case", "电竞 2014 夏季武器箱": "eSports 2014 Summer Case",
    "命悬一线武器箱": "Clutch Case", "地平线武器箱": "Horizon Case", "“头号特训”武器箱": "Danger Zone Case", "棱彩武器箱": "Prisma Case",
    "反恐精英20周年武器箱": "CS20 Case", "“裂网大行动”武器箱": "Shattered Web Case", "棱彩2号武器箱": "Prisma 2 Case", "裂空武器箱": "Fracture Case",
    "“狂牙大行动”武器箱": "Operation Broken Fang Case", "蛇噬武器箱": "Snakebite Case", "“激流大行动”武器箱": "Operation Riptide Case",
    "梦魇武器箱": "Dreams & Nightmares Case", "反冲武器箱": "Recoil Case", "变革武器箱": "Revolution Case", "千瓦武器箱": "Kilowatt Case",
    "画廊武器箱": "Gallery Case", "热潮武器箱": "Fever Case",
}


def age_years(date_text: str) -> float:
    return round((EVENT - pd.Timestamp(date_text)).days / 365.25, 4)


def confidence(name: str, status: str) -> tuple[str, str]:
    if name in {"Fever Case", "Recoil Case", "Fracture Case", "Gallery Case"}:
        return "low", "SteamDB/CS2.IO 与社区指南对该箱当前池位或武库机制存在冲突，未强行消除冲突。"
    if status == "discontinued":
        return "low", "社区指南列为 0% discontinued；CS2.IO 的公开页面又概括旧箱会进入 rare pool，未给出逐箱停供日期，故不消除冲突。"
    if status == "rare":
        return "medium", "SteamDB/CS2.IO 的稀有池叙述与社区指南稀有表一致；Valve未公开完整概率/轮换日志。"
    return "high", "SteamDB 与 CS2.IO 对当前活跃周掉落一致；社区指南给出的部分列表存在版本差异，见报告。"


def build_fundamentals(cases: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for _, c in cases.iterrows():
        name = str(c["case_name"])
        en = CN_TO_EN.get(name)
        if en is None or en not in META:
            raise ValueError(f"未覆盖箱子: {name}")
        intro, case_type = META[en]
        if en in ACTIVE:
            status = "active"
        elif en in DISCONTINUED:
            status = "discontinued"
        else:
            status = "rare"
        conf, note = confidence(en, status)
        local_date = str(c.get("release_date", ""))
        if local_date and local_date != intro:
            note += f" 本地 CSQAQ release_date={local_date} 与公开资料={intro} 不同。"
            conf = "low"
        if en == "Fever Case":
            note += " 当前两独立掉落池页列为 active weekly，但社区指南将其放在 Armory；本项目保留 active 并标记低置信度。"
        if en == "Gallery Case":
            note += " 社区指南列为 discontinued 0%，同时又列为 Armory；本项目按 0%/已不再常规掉落的保守状态记录，不能解释为普通周掉落。"
        if en in {"Recoil Case", "Fracture Case"}:
            note += " 当前两独立掉落池页列为 active weekly，社区指南的稀有表仍保留旧状态。"
        rows.append({
            "case_name": name,
            "good_id": str(c["good_id"]),
            "introduced_date": intro,
            "introduced_year": int(intro[:4]),
            "drop_status": status,
            "active_pool_exit_date": "",
            "case_type": case_type,
            "age_years_at_2025_10_22": age_years(intro),
            "source_1": STEAMDB,
            "source_2": CS2IO,
            "confidence": conf,
            "notes": note + f" 日期/分类交叉参考社区指南：{GUIDE}；个别案例说明参考：{CSGODB}。",
        })
    return pd.DataFrame(rows)


def pct(v):
    return "" if pd.isna(v) else f"{v:.2%}"


def num(v):
    return "" if pd.isna(v) else f"{v:.4f}"


def group_stats(merged: pd.DataFrame) -> pd.DataFrame:
    output = []
    horizons = [("30d", "return_30d"), ("60d", "return_60d"), ("90d", "return_90d"), ("180d", "return_180d"), ("2026_ytd", "2026_ytd_return")]
    statuses = ["active", "rare", "discontinued", "operation/event", "unknown"]

    # Current supply status.  operation/event is deliberately a provenance
    # analysis below, not silently substituted into current drop_status.
    analyses = []
    for s in statuses:
        analyses.append(("drop_status", s, merged[merged["drop_status"] == s]))
    age_bins = [(-math.inf, 3, "<3年"), (3, 6, "3～6年"), (6, 9, "6～9年"), (9, math.inf, ">9年")]
    for lo, hi, label in age_bins:
        mask = (merged["age_years_at_2025_10_22"] >= lo) & (merged["age_years_at_2025_10_22"] < hi)
        analyses.append(("age_group", label, merged[mask]))

    # Operation/event is case provenance, kept separate so a historical
    # operation case is not falsely described as currently receiving operation drops.
    event_mask = merged["case_type"].isin(["大行动", "电竞", "武库/活动", "周年/活动"])
    analyses.append(("supply_origin", "operation/event", merged[event_mask]))
    analyses.append(("supply_origin", "standard", merged[~event_mask]))
    new = merged["age_years_at_2025_10_22"] < 6
    old = ~new
    status_rd = merged["drop_status"].isin(["rare", "discontinued"])
    analyses.extend([
        ("age_status_cross", "新 + active", merged[new & (merged["drop_status"] == "active")]),
        ("age_status_cross", "老 + rare/discontinued", merged[old & status_rd]),
        ("age_status_cross", "新 + rare/discontinued", merged[new & status_rd]),
        ("age_status_cross", "老 + active", merged[old & (merged["drop_status"] == "active")]),
    ])

    for analysis, group, subset in analyses:
        for platform, prefix in [("BUFF", "buff"), ("悠悠有品", "yyyp")]:
            for horizon, col_suffix in horizons:
                col = f"{prefix}_{col_suffix}"
                values = pd.to_numeric(subset[col], errors="coerce").dropna()
                n = int(values.size)
                output.append({
                    "analysis": analysis,
                    "platform": platform,
                    "group": group,
                    "horizon": horizon,
                    "n": n,
                    "sample_flag": "证据不足（n<5）" if n < 5 else "可报告",
                    "mean_return": values.mean() if n else np.nan,
                    "median_return": values.median() if n else np.nan,
                    "win_rate": (values > 0).mean() if n else np.nan,
                })
    return pd.DataFrame(output)


def group_table(stats: pd.DataFrame, analysis: str, platform: str) -> str:
    x = stats[(stats.analysis == analysis) & (stats.platform == platform)].copy()
    if x.empty:
        return "（无可用分组）"
    rows = []
    for group in x.group.drop_duplicates():
        parts = [group]
        for h in ["30d", "60d", "90d", "180d", "2026_ytd"]:
            r = x[(x.group == group) & (x.horizon == h)].iloc[0]
            parts += [str(int(r.n)), pct(r.mean_return), pct(r.median_return), pct(r.win_rate)]
        rows.append("| " + " | ".join(parts) + " |")
    head = ["分组"]
    for h in ["30d", "60d", "90d", "180d", "2026_ytd"]:
        head += [f"{h} n", f"{h}均值", f"{h}中位数", f"{h}胜率"]
    return "| " + " | ".join(head) + " |\n|" + "|".join(["---"] * len(head)) + "|\n" + "\n".join(rows)


def make_report(fund: pd.DataFrame, merged: pd.DataFrame, stats: pd.DataFrame) -> str:
    counts = fund.groupby(["drop_status", "case_type"]).size().reset_index(name="n")
    count_lines = "\n".join(f"- {r.drop_status} / {r.case_type}: {int(r.n)} 个" for r in counts.itertuples())
    status_notes = fund.groupby("drop_status").size().to_dict()
    def metric(plat, group, h, field):
        r = stats[(stats.analysis == "drop_status") & (stats.platform == plat) & (stats.group == group) & (stats.horizon == h)]
        return r.iloc[0][field] if not r.empty else np.nan
    active_n = status_notes.get("active", 0)
    rare_n = status_notes.get("rare", 0)
    disc_n = status_notes.get("discontinued", 0)
    buff_90_active = pct(metric("BUFF", "active", "90d", "mean_return"))
    buff_90_rd = pct(np.nanmean([metric("BUFF", "rare", "90d", "mean_return"), metric("BUFF", "discontinued", "90d", "mean_return")]))
    yyyp_90_active = pct(metric("悠悠有品", "active", "90d", "mean_return"))
    yyyp_90_rd = pct(np.nanmean([metric("悠悠有品", "rare", "90d", "mean_return"), metric("悠悠有品", "discontinued", "90d", "mean_return")]))
    conf_counts = fund["confidence"].value_counts().to_dict()

    def level_summary(platform: str) -> str:
        prefix = "buff" if platform == "BUFF" else "yyyp"
        q1 = merged[f"{prefix}_event_price"].quantile(.25)
        q3 = merged[f"{prefix}_event_price"].quantile(.75)
        rows = []
        for label, mask in [("低价（≤25%）", merged[f"{prefix}_event_price"] <= q1), ("高价（>75%）", merged[f"{prefix}_event_price"] > q3)]:
            x = merged[mask]
            row = {"分层": label, "n": int(x.shape[0])}
            for h in [30, 60, 90, 180]:
                vals = pd.to_numeric(x[f"{prefix}_return_{h}d"], errors="coerce").dropna()
                row[f"+{h}d均值"] = pct(vals.mean()) if len(vals) else ""
            rows.append(row)
        return "| 分层 | n | +30d均值 | +60d均值 | +90d均值 | +180d均值 |\n|---|---:|---:|---:|---:|---:|\n" + "\n".join(
            f"| {r['分层']} | {r['n']} | {r['+30d均值']} | {r['+60d均值']} | {r['+90d均值']} | {r['+180d均值']} |" for r in rows
        )

    highlight_names = ["电竞 2014 夏季武器箱", "“九头蛇大行动”武器箱", "“英勇大行动”武器箱", "电竞 2013 冬季武器箱"]
    h = fund[fund.case_name.isin(highlight_names)].merge(merged[["case_name", "buff_return_90d", "yyyp_return_90d"]], on="case_name", how="left")
    highlight_table = "| 箱子 | drop_status | case_type | 箱龄 | BUFF +90d | 悠悠 +90d | confidence |\n|---|---|---|---:|---:|---:|---|\n" + "\n".join(
        f"| {r.case_name} | {r.drop_status} | {r.case_type} | {r.age_years_at_2025_10_22:.2f} | {pct(r.buff_return_90d)} | {pct(r.yyyp_return_90d)} | {r.confidence} |" for r in h.itertuples()
    )
    return f"""# 五红后箱子供给属性与表现研究

## 范围与限制

本报告只做供给属性与价格表现的描述性比较，不设计交易策略、不做买入推荐，也没有重新请求 CSQAQ。价格部分来自既有 `results/case_post_tradeup_performance.csv`；供给字段来自公开资料交叉核对。五红事件基准为 2025-10-22，数据截止 2026-09-04。

本地样本为 42 个箱子，平台分开统计。收益是每个箱子的事件日价格到目标日价格的简单收益率；`n` 为该分组该期限有有效收益的箱子数。n<5 标记为“证据不足”，不把小样本差异当成稳定规律。

## 基本面标签覆盖

{count_lines}

`drop_status` 描述当前供给路径；历史大行动/电竞/武库来源另由 `case_type` 表示，并在 `supply_origin` 分析中单独比较。这样不会把“历史上来自大行动”误写成“现在仍有大行动掉落”。

当前状态存在公开资料冲突：SteamDB 与 CS2.IO 的 2026-07-02 页面都列出 Fever、Kilowatt、Revolution、Recoil、Dreams & Nightmares、Fracture 六个 active weekly；社区指南仍将 Recoil/Fracture列入 rare，并将 Gallery 同时列为 discontinued 与 Armory。Fever 也存在 active weekly 与 Armory 分类差异。社区指南还出现“2025 年 12 月后 rare 全部 discontinued”的评论，但其正文仍保留 rare 表；这类冲突行已标 `confidence=low`，本报告不把它当作确定事实。置信度计数：{conf_counts}。

## 掉落状态比较

### BUFF

{group_table(stats, "drop_status", "BUFF")}

### 悠悠有品

{group_table(stats, "drop_status", "悠悠有品")}

active 样本数为 {active_n}，rare 为 {rare_n}，discontinued 为 {disc_n}。以 90 日均值作方向性观察，BUFF active={buff_90_active}，rare 与 discontinued 合并均值={buff_90_rd}；悠悠 active={yyyp_90_active}，rare 与 discontinued 合并均值={yyyp_90_rd}。这不是统计显著性检验，且状态冲突会改变分组边界；只能说明本样本中的相关性，不能证明供给状态是唯一因果。

## 箱龄分组

### BUFF

{group_table(stats, "age_group", "BUFF")}

### 悠悠有品

{group_table(stats, "age_group", "悠悠有品")}

年龄按 2025-10-22 的实际天数折算为年，分组边界为 <3、3～6、6～9、>9 年。年龄与供给状态高度相关，所以年龄组不能单独解释“抗跌”。

## 供给来源与交叉分析

### 历史 operation/event 来源 vs standard

#### BUFF

{group_table(stats, "supply_origin", "BUFF")}

#### 悠悠有品

{group_table(stats, "supply_origin", "悠悠有品")}

### 年龄 × 供给状态

“新”定义为事件日箱龄 <6 年，“老”定义为 ≥6 年；operation/event 来源不被强行塞入 rare/discontinued 交叉组。

#### BUFF

{group_table(stats, "age_status_cross", "BUFF")}

#### 悠悠有品

{group_table(stats, "age_status_cross", "悠悠有品")}

## 对问题的回答

1. **active 是否显著弱于稀有/停供？** 当前数据只能做描述性判断，不能把“显著”理解为统计显著。若均值方向在两个平台一致，可称为一致迹象；若平台方向不一致或 n<5，则结论为证据不足。特别是 Recoil、Fracture、Fever、Gallery 的公开标签冲突，相关比较应以低置信度看待。

2. **低价箱跌得更深能否由供给状态解释？** 既有价格面板按事件日价格四分位的低/高分层如下；价格层级不是供给标签。

BUFF：

{level_summary("BUFF")}

悠悠有品：

{level_summary("悠悠有品")}

如果低价组更集中于 active/新箱，供给状态可以解释一部分；但不能从该相关性推出单独因果，仍应以交叉表和样本量为准。

3. **电竞2014夏季、九头蛇、英勇、电竞2013冬季的共同基本面？** 它们都属于老箱且来自电竞/大行动等历史特殊来源，当前状态及五红后 +90d 实际值如下：

{highlight_table}

共同点是历史事件/特殊来源和较高箱龄，而不是同一个“当前常规掉落”标签；当前停供/稀有状态存在资料口径差异，逐箱应看 `confidence` 与 `notes`。

4. **贵所以抗跌，还是稀缺所以贵且抗跌？** 本数据不能识别因果。价格贵与箱龄、历史来源、当前供给状态共线；应优先把“稀缺供给与高价格同时出现”视为相关现象，不能倒推出价格本身造成抗跌。

5. **五红后是否从普涨变为供给属性分化？** 若状态、年龄和来源组在 +30/+60/+90/+180 日的均值/胜率出现稳定方向差异，数据支持“分化增强”的描述；但 42 个样本、事件冲击和标签冲突不支持把它表述为普适定律。报告保留各组 n，未做复杂机器学习或参数优化。

## 资料与复核

- [SteamDB CS2 Drop Pool]({STEAMDB})：活跃周掉落、稀有池、Armory、停供列表与更新时间。
- [CS2.IO Drop Pool]({CS2IO})：独立的掉落池快照、状态解释和轮换说明。
- [Steam Community Guide: CS2 Case Drop Pool 2025]({GUIDE})：逐箱发布时间、旧版池位与 0% 列表；其正文/评论与上述页面存在冲突，已在数据中降置信度。
- [CSGO Database]({CSGODB})：公开箱子时间线与个别大行动箱说明，作为日期/来源交叉参考。

完整标签在 `data/case_fundamentals.csv`；合并面板在 `results/supply_fundamental_merged.csv`；分组统计在 `results/supply_group_stats.csv`。
"""


def main():
    cases = pd.read_csv(DATA / "cases.csv", dtype={"good_id": str})
    fund = build_fundamentals(cases)
    fund.to_csv(DATA / "case_fundamentals.csv", index=False, encoding="utf-8-sig")
    perf = pd.read_csv(RESULTS / "case_post_tradeup_performance.csv", dtype={"good_id": str})
    merged = fund.merge(perf, on=["case_name", "good_id"], how="left", validate="one_to_one")
    merged.to_csv(RESULTS / "supply_fundamental_merged.csv", index=False, encoding="utf-8-sig")
    stats = group_stats(merged)
    stats.to_csv(RESULTS / "supply_group_stats.csv", index=False, encoding="utf-8-sig")
    (RESULTS / "supply_research_report.md").write_text(make_report(fund, merged, stats), encoding="utf-8")
    print(f"fundamentals={len(fund)} merged={len(merged)} stats={len(stats)}")
    print(f"status_counts={fund['drop_status'].value_counts().to_dict()}")
    for platform in ["BUFF", "悠悠有品"]:
        x = stats[(stats.analysis == "drop_status") & (stats.platform == platform) & (stats.horizon == "90d")]
        print(platform, x[["group", "n", "mean_return", "median_return", "win_rate"]].to_dict("records"))


if __name__ == "__main__":
    main()
