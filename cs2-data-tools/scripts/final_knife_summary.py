from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RAW = DATA / "raw" / "knives"
RESULTS = ROOT / "results"
PAIRS = [(6, 9), (6, 10), (6, 11), (7, 9), (7, 10), (7, 11), (8, 9), (8, 10), (8, 11)]
PLATFORMS = {1: "BUFF", 2: "悠悠有品"}
FRICTIONS = [0.0, 0.03, 0.05]
FOCUS_ID = 13856


def history(good_id: int, platform: int) -> pd.DataFrame:
    folder = RAW / ("buff" if platform == 1 else "yyyp")
    file = sorted(folder.glob(f"{good_id}_*.csv"))[0]
    df = pd.read_csv(file)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    return df.dropna(subset=["date", "price"]).query("price > 0").sort_values("date").drop_duplicates("date").reset_index(drop=True)


def month_stat(df: pd.DataFrame, year: int, month: int, mode: str):
    rows = df[(df.date.dt.year == year) & (df.date.dt.month == month)].sort_values("date")
    if rows.empty:
        return None
    if mode == "A_first5_valid_days":
        if len(rows) < 5:
            return None
        chosen = rows.head(5)
    else:
        chosen = rows
    return float(chosen.price.mean()), chosen.date.iloc[-1].date().isoformat(), len(chosen)


def trade(df: pd.DataFrame, year: int, buy_month: int, sell_month: int, execution: str):
    mode = "A_first5_valid_days" if execution == "A_first5_valid_days" else "B_full_month_mean"
    buy = month_stat(df, year, buy_month, mode)
    sell = month_stat(df, year, sell_month, mode)
    if buy is None or sell is None:
        return None
    raw = sell[0] / buy[0] - 1
    return {"buy_price": buy[0], "sell_price": sell[0], "raw_return": raw, "buy_date": buy[1], "sell_date": sell[1]}


def stats(values: list[float], denominator: int = 26):
    arr = np.asarray(values, dtype=float)
    return {"n_items": int(len(arr)), "avg_return": float(arr.mean()) if len(arr) else np.nan, "median_return": float(np.median(arr)) if len(arr) else np.nan,
            "profitable_n": int((arr > 0).sum()) if len(arr) else 0, "win_rate_of_26": float((arr > 0).sum() / denominator) if len(arr) else np.nan}


def build_core(candidates: pd.DataFrame, histories: dict[tuple[int, int], pd.DataFrame]):
    rows = []
    raw_map: dict[tuple[int, int, int, int, int, str], float] = {}
    # Populate both platforms before calculating any cross-platform direction
    # statistics; otherwise the BUFF row would be emitted before YYYP exists.
    for year in [2023, 2024]:
        for buy_month, sell_month in PAIRS:
            for execution in ["A_first5_valid_days", "B_full_month_mean"]:
                for platform in PLATFORMS:
                    for _, item in candidates.iterrows():
                        key = (platform, int(item.good_id), year, buy_month, sell_month, execution)
                        t = trade(histories[(platform, int(item.good_id))], year, buy_month, sell_month, execution)
                        if t is not None:
                            raw_map[key] = t["raw_return"]
    for year in [2023, 2024]:
        for buy_month, sell_month in PAIRS:
            for execution in ["A_first5_valid_days", "B_full_month_mean"]:
                for platform, platform_name in PLATFORMS.items():
                    values = [raw_map[(platform, int(item.good_id), year, buy_month, sell_month, execution)] for _, item in candidates.iterrows() if (platform, int(item.good_id), year, buy_month, sell_month, execution) in raw_map]
                    record = {"sample": "core", "year": year, "platform": platform, "platform_name": platform_name, "buy_month": buy_month, "sell_month": sell_month,
                              "strategy": f"{buy_month}月买-{sell_month}月卖", "execution": execution, **stats(values)}
                    for friction in [0.03, 0.05]:
                        net = [(1 + x) * (1 - friction) - 1 for x in values]
                        s = stats(net)
                        tag = f"net_{int(friction*100)}pct"
                        record.update({f"{tag}_avg": s["avg_return"], f"{tag}_median": s["median_return"], f"{tag}_profitable_n": s["profitable_n"], f"{tag}_win_rate_of_26": s["win_rate_of_26"]})
                    other = 2 if platform == 1 else 1
                    paired = []
                    for _, item in candidates.iterrows():
                        a = raw_map.get((platform, int(item.good_id), year, buy_month, sell_month, execution))
                        b = raw_map.get((other, int(item.good_id), year, buy_month, sell_month, execution))
                        if a is not None and b is not None:
                            paired.append((a, b))
                    record["paired_items"] = len(paired)
                    record["direction_agreement_n"] = int(sum(np.sign(a) == np.sign(b) for a, b in paired))
                    record["direction_agreement_rate"] = record["direction_agreement_n"] / len(paired) if paired else np.nan
                    record["other_platform_avg_return"] = float(np.mean([b for a, b in paired])) if paired else np.nan
                    record["platform_average_direction_same"] = bool(np.sign(record["avg_return"]) == np.sign(record["other_platform_avg_return"])) if paired else np.nan
                    rows.append(record)
    core = pd.DataFrame(rows)
    pooled = []
    for platform, platform_name in PLATFORMS.items():
        for buy_month, sell_month in PAIRS:
            for execution in ["A_first5_valid_days", "B_full_month_mean"]:
                for _, item in candidates.iterrows():
                    for year in [2023, 2024]:
                        raw = raw_map.get((platform, int(item.good_id), year, buy_month, sell_month, execution))
                        if raw is not None:
                            pooled.append({"platform": platform, "platform_name": platform_name, "buy_month": buy_month, "sell_month": sell_month, "execution": execution, "raw_return": raw, "year": year, "good_id": int(item.good_id)})
    pooled_df = pd.DataFrame(pooled)
    pooled_rows = []
    for (platform, platform_name, buy_month, sell_month, execution), g in pooled_df.groupby(["platform", "platform_name", "buy_month", "sell_month", "execution"]):
        values = g.raw_return.tolist()
        s = stats(values)
        r = {"sample": "pooled_2023_2024", "year": "2023_2024", "platform": platform, "platform_name": platform_name, "buy_month": buy_month, "sell_month": sell_month, "strategy": f"{buy_month}月买-{sell_month}月卖", "execution": execution, **s}
        for friction in [0.03, 0.05]:
            net = [(1 + x) * (1 - friction) - 1 for x in values]
            ns = stats(net)
            tag = f"net_{int(friction*100)}pct"
            r.update({f"{tag}_avg": ns["avg_return"], f"{tag}_median": ns["median_return"], f"{tag}_profitable_n": ns["profitable_n"], f"{tag}_win_rate_of_26": ns["win_rate_of_26"]})
        other = 2 if platform == 1 else 1
        other_g = pooled_df[(pooled_df.platform == other) & (pooled_df.buy_month == buy_month) & (pooled_df.sell_month == sell_month) & (pooled_df.execution == execution)]
        merged = g.merge(other_g, on=["good_id", "year"], suffixes=("_platform", "_other"))
        r["paired_items"] = len(merged)
        r["direction_agreement_n"] = int(sum(np.sign(a) == np.sign(b) for a, b in zip(merged.raw_return_platform, merged.raw_return_other)))
        r["direction_agreement_rate"] = r["direction_agreement_n"] / len(merged) if len(merged) else np.nan
        r["other_platform_avg_return"] = float(merged.raw_return_other.mean()) if len(merged) else np.nan
        r["platform_average_direction_same"] = bool(np.sign(r["avg_return"]) == np.sign(r["other_platform_avg_return"])) if len(merged) else np.nan
        pooled_rows.append(r)
    return pd.concat([core, pd.DataFrame(pooled_rows)], ignore_index=True), pooled_df


def build_reference_2025(candidates, histories):
    rows = []
    for buy_month, sell_month in PAIRS:
        for execution in ["A_first5_valid_days", "B_full_month_mean"]:
            if sell_month == 11:
                continue
            if sell_month == 10 and execution != "A_first5_valid_days":
                continue
            for platform, platform_name in PLATFORMS.items():
                values = []
                for _, item in candidates.iterrows():
                    t = trade(histories[(platform, int(item.good_id))], 2025, buy_month, sell_month, execution)
                    if t is not None: values.append(t["raw_return"])
                if values:
                    s = stats(values)
                    rows.append({"year": 2025, "buy_month": buy_month, "sell_month": sell_month, "strategy": f"{buy_month}月买-{sell_month}月卖", "execution": execution,
                                 "platform": platform, "platform_name": platform_name, **s, "net_3pct_avg": float(np.mean([(1+x)*.97-1 for x in values])), "net_5pct_avg": float(np.mean([(1+x)*.95-1 for x in values]))})
    return pd.DataFrame(rows)


def build_focus(candidates, histories):
    item = candidates[candidates.good_id == FOCUS_ID].iloc[0]
    monthly, seasonal, position = [], [], []
    for platform, platform_name in PLATFORMS.items():
        df = histories[(platform, FOCUS_ID)]
        latest = df.date.max()
        for year in [2023, 2024, 2025, 2026]:
            for month in range(1, 13):
                rows = df[(df.date.dt.year == year) & (df.date.dt.month == month)].sort_values("date")
                if rows.empty:
                    monthly.append({"year": year, "month": month, "platform": platform, "platform_name": platform_name, "data_points": 0, "full_month_mean": np.nan, "month_status": "no_data"})
                    continue
                partial = year == latest.year and month == latest.month
                monthly.append({"year": year, "month": month, "platform": platform, "platform_name": platform_name, "data_points": len(rows), "full_month_mean": float(rows.price.mean()), "month_status": "partial_current_month" if partial else "complete"})
        for year in [2023, 2024]:
            for buy_month, sell_month in PAIRS:
                t = trade(df, year, buy_month, sell_month, "A_first5_valid_days")
                b = trade(df, year, buy_month, sell_month, "B_full_month_mean")
                for execution, x in [("A_first5_valid_days", t), ("B_full_month_mean", b)]:
                    if x:
                        seasonal.append({"year": year, "buy_month": buy_month, "sell_month": sell_month, "strategy": f"{buy_month}月买-{sell_month}月卖", "execution": execution, "platform": platform, "platform_name": platform_name, **x, "net_3pct": (1+x["raw_return"])*.97-1, "net_5pct": (1+x["raw_return"])*.95-1})
        pre = df[(df.date >= pd.Timestamp("2025-10-01")) & (df.date <= pd.Timestamp("2025-10-21"))]
        post = df[df.date >= pd.Timestamp("2025-10-22")]
        low = post.loc[post.price.idxmin()]
        pre_last = df[df.date <= pd.Timestamp("2025-10-21")].iloc[-1]
        position.append({"good_id": FOCUS_ID, "platform": platform, "platform_name": platform_name, "latest_date": latest.date().isoformat(), "current_price": float(df.iloc[-1].price),
                         "percentile_1y": float((df[df.date >= latest-pd.Timedelta(days=365)].price <= df.iloc[-1].price).mean()),
                         "percentile_2y": float((df[df.date >= latest-pd.Timedelta(days=730)].price <= df.iloc[-1].price).mean()),
                         "percentile_all_history": float((df.price <= df.iloc[-1].price).mean()),
                         "pre_event_mean_2025_10_01_21": float(pre.price.mean()), "pre_event_first_price": float(pre.iloc[0].price), "pre_event_last_price": float(pre_last.price),
                         "pre_event_last_date": pre_last.date.date().isoformat(), "post_event_low_price": float(low.price), "post_event_low_date": low.date.date().isoformat(),
                         "current_rebound_from_low": float(df.iloc[-1].price/low.price-1), "current_vs_pre_event": float(df.iloc[-1].price/pre_last.price-1),
                         "current_gap_to_pre_event_yuan": float(df.iloc[-1].price-pre_last.price), "post_event_points": len(post)})
    return pd.DataFrame(monthly), pd.DataFrame(seasonal), pd.DataFrame(position)


def report(core, reference, focus_monthly, focus_seasonal, focus_position):
    lines = ["# 刀皮季节性最终归纳（2023–2024 核心样本）", "", "本报告只读取已抓取的 26 个刀皮 BUFF/悠悠历史 CSV；未请求 API、未修改原始历史、未设计新策略。2025 年五红结构事件单独处理，2026 年 10/11 月不计算。逐年统计的分母是 26 把刀；跨年汇总是 2023 和 2024 的 52 个刀-年观察。", "", "## 核心口径", "", "A 为前 5 个有效交易日均价，B 为完整月份均价；收益为卖价/买价-1。3%/5% 为总买卖摩擦，按 `(1+毛收益)×(1-摩擦)-1` 计算。", "", "## 2023–2024 全样本结论", ""]
    pooled = core[core["sample"] == "pooled_2023_2024"]
    for platform, name in PLATFORMS.items():
        p = pooled[pooled.platform == platform]
        lines.append(f"### {name}")
        for execution in ["A_first5_valid_days", "B_full_month_mean"]:
            q = p[p.execution == execution]
            best_buy = q.groupby("buy_month").avg_return.mean().idxmax()
            best_sell = q.groupby("sell_month").avg_return.mean().idxmax()
            lines.append(f"- {execution}：跨 9 个组合的平均收益最高买入月为 {int(best_buy)} 月，平均收益最高卖出月为 {int(best_sell)} 月。")
            lines.append("  " + "；".join(f"{int(r.buy_month)}→{int(r.sell_month)} 平均 {r.avg_return:.2%}，中位数 {r.median_return:.2%}，盈利 {int(r.profitable_n)}/{int(r.n_items)}，3%后 {r.net_3pct_avg:.2%}，5%后 {r.net_5pct_avg:.2%}" for _, r in q.sort_values(["buy_month", "sell_month"]).iterrows()))
        lines.append("")
    lines += ["### 2023 与 2024 是否都存在", ""]
    for execution in ["A_first5_valid_days", "B_full_month_mean"]:
        q = core[(core["sample"] == "core") & (core["execution"] == execution)]
        both = []
        for buy, sell in PAIRS:
            for platform, name in PLATFORMS.items():
                x = q[(q.platform == platform) & (q.buy_month == buy) & (q.sell_month == sell)]
                if len(x) == 2 and (x.avg_return > 0).all(): both.append(f"{name} {buy}→{sell}")
        lines.append(f"- {execution}：2023、2024 两年平均收益均为正的组合：" + ("、".join(both) if both else "没有组合同时满足；不能称为跨年稳定规律。"))
    lines += ["", "## 2025 参考（非正常季节平均）", "", "仅保留 6/7/8 月买入到 9 月卖出，以及卖出于 10 月前 5 个有效交易日的参考结果；10 月全月均价和 11 月结果未纳入正常季节平均。", ""]
    for _, r in reference.sort_values(["platform", "buy_month", "sell_month", "execution"]).iterrows():
        lines.append(f"- {r.platform_name} {int(r.buy_month)}→{int(r.sell_month)} {r.execution}：平均 {r.avg_return:.2%}，中位数 {r.median_return:.2%}，盈利 {int(r.profitable_n)}/{int(r.n_items)}，3%后 {r.net_3pct_avg:.2%}，5%后 {r.net_5pct_avg:.2%}。")
    lines += ["", "## 13856 弯刀｜澄澈之水（久经沙场）", ""]
    for _, r in focus_position.iterrows():
        lines.append(f"- {r.platform_name}：当前 {r.current_price:.2f} 元（{r.latest_date}）；1 年百分位 {r.percentile_1y:.2%}，2 年百分位 {r.percentile_2y:.2%}，全部历史百分位 {r.percentile_all_history:.2%}；五红前事件价 {r.pre_event_last_date} {r.pre_event_last_price:.2f} 元；五红后最低 {r.post_event_low_date} {r.post_event_low_price:.2f} 元；当前较低点反弹 {r.current_rebound_from_low:.2%}，较事件前仍为 {r.current_vs_pre_event:.2%}（{r.current_gap_to_pre_event_yuan:.2f} 元）。")
        pre = focus_monthly[(focus_monthly.platform == r.platform) & (focus_monthly.year.isin([2023, 2024, 2025, 2026])) & (focus_monthly.month.isin([6,7,8,9,10,11]))]
        lines.append("  月均价：" + "；".join(f"{int(x.year)}-{int(x.month):02d} {x.full_month_mean:.2f}" if pd.notna(x.full_month_mean) else f"{int(x.year)}-{int(x.month):02d} 无/未完成" for _, x in pre.iterrows()))
        sp = focus_seasonal[focus_seasonal.platform == r.platform]
        lines.append("  2023/2024 A 版本：" + "；".join(f"{int(x.year)} {int(x.buy_month)}→{int(x.sell_month)} {x.raw_return:.2%}/3% {x.net_3pct:.2%}/5% {x.net_5pct:.2%}" for _, x in sp[sp.execution == "A_first5_valid_days"].sort_values(["year","buy_month","sell_month"]).iterrows()))
        lines.append("  2023/2024 B 版本：" + "；".join(f"{int(x.year)} {int(x.buy_month)}→{int(x.sell_month)} {x.raw_return:.2%}/3% {x.net_3pct:.2%}/5% {x.net_5pct:.2%}" for _, x in sp[sp.execution == "B_full_month_mean"].sort_values(["year","buy_month","sell_month"]).iterrows()))
    lines += ["", "## 四个问题的纯数据结论", "", "1. 2023–2024 的 26 把普通刀在部分组合上存在共同方向，但不是所有买卖月份都一致；是否称为稳定规律，要以具体组合和摩擦后结果为准。", "2. 最有优势的买入月、卖出月按平台和执行方式分别见上表，不能把单个最好组合推广成普遍规则。", "3. 13856 的 2023/2024 各组合收益已逐笔列出；它只有在对应组合实际为正时才符合该组合规律，不能仅凭当前低百分位判定季节性成立。", "4. 13856 当前 BUFF/悠悠均处于过去 1 年、2 年和全部历史的低百分位区域；但相对五红后最低点已有不同程度反弹，且仍显著低于五红前价格，因此同时属于‘低位区域’和‘尚未恢复至事件前’。", "", "不构成买入建议；2025 五红后的变化仅作为事件参考，不与正常季节样本混合。", ""]
    return "\n".join(lines)


def main():
    candidates = pd.read_csv(DATA / "knife_candidates.csv", encoding="utf-8-sig")
    candidates.good_id = candidates.good_id.astype(int)
    histories = {(platform, int(good_id)): history(int(good_id), platform) for good_id in candidates.good_id for platform in PLATFORMS}
    core, _ = build_core(candidates, histories)
    reference = build_reference_2025(candidates, histories)
    focus_monthly, focus_seasonal, focus_position = build_focus(candidates, histories)
    core.to_csv(RESULTS / "knife_final_core_2023_2024.csv", index=False, encoding="utf-8-sig")
    reference.to_csv(RESULTS / "knife_final_reference_2025.csv", index=False, encoding="utf-8-sig")
    focus_monthly.to_csv(RESULTS / "knife_final_13856_monthly.csv", index=False, encoding="utf-8-sig")
    focus_seasonal.to_csv(RESULTS / "knife_final_13856_seasonal.csv", index=False, encoding="utf-8-sig")
    focus_position.to_csv(RESULTS / "knife_final_13856_position.csv", index=False, encoding="utf-8-sig")
    (RESULTS / "knife_final_summary.md").write_text(report(core, reference, focus_monthly, focus_seasonal, focus_position), encoding="utf-8")
    print(f"完成：核心 {len(core)} 行，2025参考 {len(reference)} 行，13856月度 {len(focus_monthly)} 行，专项季节 {len(focus_seasonal)} 行。")


if __name__ == "__main__":
    main()
