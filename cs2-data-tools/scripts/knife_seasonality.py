from __future__ import annotations

import json
import os
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RAW = DATA / "raw" / "knives"
RESULTS = ROOT / "results"
CANDIDATE_FILE = DATA / os.environ.get("KNIFE_CANDIDATE_FILE", "knife_candidates.csv")
RESULT_PREFIX = os.environ.get("KNIFE_RESULT_PREFIX", "")


def result_path(filename: str) -> Path:
    return RESULTS / (f"{RESULT_PREFIX}_{filename}" if RESULT_PREFIX else filename)
PLATFORMS = {1: "BUFF", 2: "悠悠有品"}
FRICTIONS = [0.0, 0.03, 0.05]
SEASONAL_PAIRS = [(6, 9), (6, 10), (6, 11), (7, 9), (7, 10), (7, 11), (8, 9), (8, 10), (8, 11)]
EXECUTIONS = ["A_first5_valid_days", "B_full_month_mean", "C_fixed_threshold_timing"]
FOCUS_ID = 13856


def pct(value):
    return "—" if pd.isna(value) else f"{float(value):.2%}"


def load_history(good_id: int, platform: int) -> pd.DataFrame:
    folder = RAW / ("buff" if platform == 1 else "yyyp")
    files = sorted(folder.glob(f"{int(good_id)}_*.csv"))
    if not files:
        return pd.DataFrame(columns=["date", "price"])
    df = pd.read_csv(files[0])
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["date", "price"])
    df = df[df["price"] > 0].sort_values("date").drop_duplicates("date", keep="last")
    return df.reset_index(drop=True)


def month_rows(df: pd.DataFrame, year: int, month: int) -> pd.DataFrame:
    return df[(df["date"].dt.year == year) & (df["date"].dt.month == month)].sort_values("date")


def monthly_stat(df: pd.DataFrame, year: int, month: int, mode: str):
    rows = month_rows(df, year, month)
    if rows.empty:
        return None
    if mode == "first5":
        if len(rows) < 5:
            return None
        selected = rows.head(5)
    else:
        # The current month is incomplete and must not be treated as a full-month mean.
        latest = df["date"].max()
        if year == latest.year and month == latest.month:
            return None
        selected = rows
    return {
        "price": float(selected["price"].mean()),
        "execution_date": selected["date"].iloc[-1],
        "n_points": int(len(selected)),
    }


def threshold_stat(df: pd.DataFrame, year: int, month: int, side: str):
    start = pd.Timestamp(year=year, month=month, day=1)
    prior = df[df["date"] < start].tail(180)
    current = month_rows(df, year, month)
    if len(prior) < 180 or len(current) < 15:
        return None
    quantile = 0.40 if side == "buy" else 0.60
    threshold = float(prior["price"].quantile(quantile))
    triggered = current[current["price"] <= threshold] if side == "buy" else current[current["price"] >= threshold]
    if triggered.empty:
        selected = current.iloc[[14]]
        trigger = "fixed_15th_valid_day_fallback"
    else:
        selected = triggered.iloc[[0]]
        trigger = f"prior_180d_{int(quantile * 100)}pct_threshold"
    return {
        "price": float(selected["price"].iloc[0]),
        "execution_date": selected["date"].iloc[0],
        "threshold": threshold,
        "trigger": trigger,
        "prior_points": len(prior),
    }


def make_trade(df: pd.DataFrame, year: int, buy_month: int, sell_month: int, execution: str):
    if execution == "A_first5_valid_days":
        buy = monthly_stat(df, year, buy_month, "first5")
        sell = monthly_stat(df, year, sell_month, "first5")
    elif execution == "B_full_month_mean":
        buy = monthly_stat(df, year, buy_month, "full")
        sell = monthly_stat(df, year, sell_month, "full")
    else:
        buy = threshold_stat(df, year, buy_month, "buy")
        sell = threshold_stat(df, year, sell_month, "sell")
    if buy is None or sell is None or buy["price"] <= 0 or sell["price"] <= 0:
        return None
    raw = float(sell["price"] / buy["price"] - 1)
    calendar_days = (pd.Timestamp(year=year, month=sell_month, day=1) - pd.Timestamp(year=year, month=buy_month, day=1)).days
    benchmark = float((1.013 ** (calendar_days / 365.0)) - 1)
    return {
        "buy_date": buy["execution_date"].date().isoformat(),
        "sell_date": sell["execution_date"].date().isoformat(),
        "buy_price": buy["price"],
        "sell_price": sell["price"],
        "raw_return": raw,
        "benchmark_1_3pct_return": benchmark,
        "buy_threshold": buy.get("threshold", np.nan),
        "sell_threshold": sell.get("threshold", np.nan),
        "buy_trigger": buy.get("trigger", ""),
        "sell_trigger": sell.get("trigger", ""),
        "buy_points_used": buy.get("n_points", buy.get("prior_points", np.nan)),
        "sell_points_used": sell.get("n_points", sell.get("prior_points", np.nan)),
    }


def summarize(values: pd.DataFrame, group_cols: list[str], scope: str) -> pd.DataFrame:
    rows = []
    if values.empty:
        return pd.DataFrame()
    for keys, group in values.groupby(group_cols, dropna=False):
        if not isinstance(keys, tuple):
            keys = (keys,)
        net = group["net_return"].astype(float)
        year_means = group.groupby("year", as_index=False)["net_return"].mean()
        best = year_means.loc[year_means["net_return"].idxmax()]
        worst = year_means.loc[year_means["net_return"].idxmin()]
        record = dict(zip(group_cols, keys))
        record.update({
            "scope": scope,
            "n_years": int(group["year"].nunique()),
            "n_trades": int(len(group)),
            "avg_return": float(net.mean()),
            "median_return": float(net.median()),
            "win_rate": float((net > 0).mean()),
            "max_loss": float(net.min()),
            "best_year": int(best["year"]),
            "best_year_return": float(best["net_return"]),
            "worst_year": int(worst["year"]),
            "worst_year_return": float(worst["net_return"]),
            "n_beats_1_3pct": int((net > group["benchmark_1_3pct_return"]).sum()),
            "beat_1_3pct_rate": float((net > group["benchmark_1_3pct_return"]).mean()),
        })
        rows.append(record)
    return pd.DataFrame(rows)


def build_annual(candidates: pd.DataFrame, histories: dict[tuple[int, int], pd.DataFrame]) -> pd.DataFrame:
    rows = []
    for item in candidates.to_dict("records"):
        good_id = int(item["good_id"])
        for platform, platform_name in PLATFORMS.items():
            df = histories[(platform, good_id)]
            if df.empty:
                continue
            years = sorted(df["date"].dt.year.unique())
            for year in years:
                for buy_month, sell_month in SEASONAL_PAIRS:
                    for execution in EXECUTIONS:
                        trade = make_trade(df, int(year), buy_month, sell_month, execution)
                        if trade is None:
                            continue
                        for friction in FRICTIONS:
                            net = float((1 + trade["raw_return"]) * (1 - friction) - 1)
                            rows.append({
                                "scope": "per_item", "中文名": item["中文名"], "英文名": item["英文名"], "good_id": good_id,
                                "platform": platform, "platform_name": platform_name, "year": int(year),
                                "buy_month": buy_month, "sell_month": sell_month, "strategy": f"{buy_month}月买-{sell_month}月卖",
                                "execution": execution, "friction_total": friction, "buy_date": trade["buy_date"],
                                "sell_date": trade["sell_date"], "buy_price": trade["buy_price"], "sell_price": trade["sell_price"],
                                "raw_return": trade["raw_return"], "net_return": net,
                                "benchmark_1_3pct_return": trade["benchmark_1_3pct_return"],
                                "beat_1_3pct": bool(net > trade["benchmark_1_3pct_return"]),
                                "buy_threshold": trade["buy_threshold"], "sell_threshold": trade["sell_threshold"],
                                "buy_trigger": trade["buy_trigger"], "sell_trigger": trade["sell_trigger"],
                            })
    annual = pd.DataFrame(rows)
    if annual.empty:
        return annual
    pooled = []
    for keys, group in annual.groupby(["platform", "platform_name", "year", "buy_month", "sell_month", "strategy", "execution", "friction_total"], dropna=False):
        platform, platform_name, year, buy_month, sell_month, strategy, execution, friction = keys
        pooled.append({
            "scope": "all_sample", "中文名": "全样本等权", "英文名": "", "good_id": "", "platform": platform,
            "platform_name": platform_name, "year": year, "buy_month": buy_month, "sell_month": sell_month,
            "strategy": strategy, "execution": execution, "friction_total": friction, "buy_date": "", "sell_date": "",
            "buy_price": np.nan, "sell_price": np.nan, "raw_return": float(group["raw_return"].mean()),
            "net_return": float(group["net_return"].mean()), "benchmark_1_3pct_return": float(group["benchmark_1_3pct_return"].mean()),
            "beat_1_3pct": bool(group["net_return"].mean() > group["benchmark_1_3pct_return"].mean()),
            "buy_threshold": np.nan, "sell_threshold": np.nan, "buy_trigger": "", "sell_trigger": "",
        })
    return pd.concat([annual, pd.DataFrame(pooled)], ignore_index=True)


def build_focus(candidates: pd.DataFrame, histories: dict[tuple[int, int], pd.DataFrame]):
    item = candidates[candidates["good_id"].astype(int) == FOCUS_ID].iloc[0].to_dict()
    monthly = []
    seasonal = []
    position = []
    for platform, platform_name in PLATFORMS.items():
        df = histories[(platform, FOCUS_ID)]
        for year in [2023, 2024, 2025, 2026]:
            for month in range(1, 13):
                first5 = monthly_stat(df, year, month, "first5")
                full = monthly_stat(df, year, month, "full")
                count = len(month_rows(df, year, month))
                monthly.append({"中文名": item["中文名"], "good_id": FOCUS_ID, "platform": platform, "platform_name": platform_name, "year": year, "month": month,
                                "data_points": count, "first5_mean": first5["price"] if first5 else np.nan, "full_month_mean": full["price"] if full else np.nan})
        for year in [2023, 2024, 2025, 2026]:
            for buy_month, sell_month in SEASONAL_PAIRS:
                for execution in EXECUTIONS[:2]:
                    trade = make_trade(df, year, buy_month, sell_month, execution)
                    if trade is None:
                        continue
                    seasonal.append({"中文名": item["中文名"], "good_id": FOCUS_ID, "platform": platform, "platform_name": platform_name, "year": year,
                                     "buy_month": buy_month, "sell_month": sell_month, "strategy": f"{buy_month}月买-{sell_month}月卖", "execution": execution,
                                     **trade, "net_0pct": trade["raw_return"], "net_3pct": (1 + trade["raw_return"]) * .97 - 1,
                                     "net_5pct": (1 + trade["raw_return"]) * .95 - 1})
        latest = df.iloc[-1]
        latest_date = latest["date"]
        current = float(latest["price"])
        records = []
        for label, days in [("1y", 365), ("2y", 730)]:
            window = df[df["date"] >= latest_date - pd.Timedelta(days=days)]
            records.append(float((window["price"] <= current).mean()) if not window.empty else np.nan)
        records.append(float((df["price"] <= current).mean()) if not df.empty else np.nan)
        event_date = pd.Timestamp("2025-10-22")
        pre = df[df["date"] <= event_date - pd.Timedelta(days=1)]
        post = df[df["date"] >= event_date]
        pre_row = pre.iloc[-1] if not pre.empty else None
        low_row = post.loc[post["price"].idxmin()] if not post.empty else None
        position.append({"中文名": item["中文名"], "good_id": FOCUS_ID, "platform": platform, "platform_name": platform_name,
                         "latest_date": latest_date.date().isoformat(), "current_price": current, "percentile_1y": records[0],
                         "percentile_2y": records[1], "percentile_all_history": records[2],
                         "pre_tradeup_date": pre_row["date"].date().isoformat() if pre_row is not None else "",
                         "pre_tradeup_price": float(pre_row["price"]) if pre_row is not None else np.nan,
                         "post_tradeup_low_date": low_row["date"].date().isoformat() if low_row is not None else "",
                         "post_tradeup_low_price": float(low_row["price"]) if low_row is not None else np.nan,
                         "current_vs_pre_tradeup": current / float(pre_row["price"]) - 1 if pre_row is not None else np.nan,
                         "recovery_from_post_tradeup_low": current / float(low_row["price"]) - 1 if low_row is not None else np.nan})
    return pd.DataFrame(monthly), pd.DataFrame(seasonal), pd.DataFrame(position)


def build_consistency(annual: pd.DataFrame) -> pd.DataFrame:
    base = annual[annual["scope"] == "per_item"].copy()
    key = ["good_id", "中文名", "strategy", "buy_month", "sell_month", "execution", "friction_total"]
    rows = []
    for keys, group in base.groupby(key, dropna=False):
        buff = group[group["platform"] == 1][["year", "net_return"]].rename(columns={"net_return": "buff_return"})
        yyyp = group[group["platform"] == 2][["year", "net_return"]].rename(columns={"net_return": "yyyp_return"})
        merged = buff.merge(yyyp, on="year", how="inner")
        if merged.empty:
            continue
        signs = np.sign(merged["buff_return"]) == np.sign(merged["yyyp_return"])
        corr = merged["buff_return"].corr(merged["yyyp_return"]) if len(merged) >= 2 else np.nan
        record = dict(zip(key, keys))
        record.update({"common_years": len(merged), "sign_agreement_rate": float(signs.mean()),
                       "both_positive_rate": float(((merged["buff_return"] > 0) & (merged["yyyp_return"] > 0)).mean()),
                       "buff_avg_return": float(merged["buff_return"].mean()), "yyyp_avg_return": float(merged["yyyp_return"].mean()),
                       "return_correlation": corr, "assessment": "较一致" if signs.mean() >= 2 / 3 else "不一致/证据有限"})
        rows.append(record)
    return pd.DataFrame(rows)


def build_case_comparison(annual: pd.DataFrame) -> pd.DataFrame:
    rows = []
    knife = annual[annual["scope"] == "all_sample"].copy()
    for _, r in knife.iterrows():
        rows.append({"asset": "刀皮", "platform": r["platform"], "platform_name": r["platform_name"], "strategy": r["strategy"], "execution": r["execution"],
                     "friction_total": r["friction_total"], "year": r["year"], "mean_return": r["net_return"], "note": "刀皮全样本等权"})
    case_file = RESULTS / "seasonality_annual.csv"
    if case_file.exists():
        cases = pd.read_csv(case_file, encoding="utf-8-sig")
        cases = cases[cases["strategy"].isin([f"{a}月买-{b}月卖" for a, b in SEASONAL_PAIRS if (a, b) != (8, 9)])]
        for _, r in cases.iterrows():
            execution = "A_first5_valid_days" if r["version"] == "first5_valid_days" else "B_full_month_mean"
            for friction, col in [(0.0, "return"), (0.05, "return_after_5pct")]:
                rows.append({"asset": "箱子", "platform": r["platform"], "platform_name": r["platform_name"], "strategy": r["strategy"], "execution": execution,
                             "friction_total": friction, "year": r["year"], "mean_return": r[col], "note": "既有箱子结果；仅作口径参考"})
    return pd.DataFrame(rows)


def write_report(candidates, annual, summary, consistency, focus_position, comparison):
    sample_count = candidates["good_id"].nunique()
    lines = ["# 刀皮暑假低位买入—秋季持有/出售基础季节性回测", "", f"数据来源：CSQAQ `get_item_chart` 的 `sell_price`，`period=1095`、`style=all_style`；BUFF 与悠悠有品分开计算。本次样本数：{sample_count}。", "", "## 数据覆盖", ""]
    for platform, name in PLATFORMS.items():
        files = [annual[(annual.platform == platform) & (annual.scope == "per_item")]["good_id"].nunique()]
        hist = [load_history(int(x), platform) for x in candidates["good_id"].astype(int)]
        nonempty = [x for x in hist if not x.empty]
        lines.append(f"- {name}：{files[0]} 个标的；{sum(len(x) for x in nonempty)} 个原始价格点；最早 {min(x.date.min() for x in nonempty).date()}；最晚 {max(x.date.max() for x in nonempty).date()}。")
    lines += ["", "## 执行规则", "", "- A：买入月前 5 个有效交易日平均价，卖出月前 5 个有效交易日平均价；不足 5 个有效点则不计算。", "- B：买入月和卖出月全月有效点平均价；当前未结束月份不作为完整月均价。", "- C：固定规则，不按年份修改：以买入/卖出月份开始前最近 180 个有效点为参考；买入使用其 40% 分位，卖出使用其 60% 分位；分别扫描目标月份前 15 个有效点，首次触发阈值时执行；15 点内未触发则固定在第 15 个有效点执行。历史不足 180 点或当月不足 15 点则不计算。", "- 摩擦率是总买卖摩擦，净收益按 `(卖价/买价) × (1-摩擦率)-1` 计算；没有加入租金或臆造手续费。", "", "## 结果概览", ""]
    for platform, name in PLATFORMS.items():
        lines.append(f"### {name}")
        s = summary[(summary["platform"] == platform) & (summary["scope"] == "all_sample")].sort_values(["friction_total", "avg_return"], ascending=[True, False])
        for friction in FRICTIONS:
            q = s[s["friction_total"] == friction].sort_values("avg_return", ascending=False).head(5)
            if q.empty:
                continue
            lines.append(f"- 总摩擦 {friction:.0%}：" + "；".join(f"{r.strategy}/{r.execution} 平均 {pct(r.avg_return)}，中位数 {pct(r.median_return)}，胜率 {pct(r.win_rate)}，交易 {int(r.n_trades)}" for _, r in q.iterrows()))
        lines.append("")
    lines += ["## BUFF / 悠悠一致性", "", "一致性文件按同一标的、月份组合、执行版本和摩擦率合并共同年份；‘较一致’仅表示收益正负号至少 2/3 相同，不代表收益幅度相同。", ""]
    if not consistency.empty:
        c = consistency.groupby(["execution", "friction_total"], as_index=False).agg(common_years=("common_years", "sum"), sign_agreement_rate=("sign_agreement_rate", "mean"), return_correlation=("return_correlation", "mean"))
        for _, r in c.iterrows():
            lines.append(f"- {r.execution} / 摩擦 {r.friction_total:.0%}：平均符号一致率 {pct(r.sign_agreement_rate)}，平均相关系数 {r.return_correlation:.2f}，共同年份计数 {int(r.common_years)}。")
    else:
        lines.append("没有足够的共同年份进行平台一致性比较。")
    lines += ["", "## 13856 弯刀｜澄澈之水（久经沙场）", ""]
    if not focus_position.empty:
        for _, r in focus_position.iterrows():
            lines.append(f"- {r.platform_name}：当前 {r.current_price:.2f} 元（截至 {r.latest_date}）；1 年百分位 {pct(r.percentile_1y)}，2 年百分位 {pct(r.percentile_2y)}，全部历史百分位 {pct(r.percentile_all_history)}；五红前 {r.pre_tradeup_date} {r.pre_tradeup_price:.2f} 元，事件后低点 {r.post_tradeup_low_date} {r.post_tradeup_low_price:.2f} 元，当前相对低点恢复 {pct(r.recovery_from_post_tradeup_low)}。")
    lines += ["", "逐月价格、每年 6/7/8 月买入到 9/10/11 月卖出的全部组合和阈值执行细节分别见对应前缀的 focus CSV。", "", "## 与箱子和 1.3% 理财的口径", "", "1.3% 理财基准按持有区间的日历月数折算；逐笔比较字段在年度明细中。箱子对照只读取既有 `results/seasonality_annual.csv`，不修改箱子结果，并且箱子没有既有 C 版本和 3% 摩擦，因此对照文件仅作 A/B 的 0%/5% 参考。", "", "## 限制", "", f"样本为本次候选文件中的 {sample_count} 个普通刀皮，不是全市场；历史长度完全使用 CSQAQ 实际返回值。2026 年当前月未完成，B 全月均价不强行计算；缺少必要日期时留空。当前阶段只验证价格季节性，不做买入推荐、不加入租赁收益、不优化刀皮或箱子策略。", ""]
    return "\n".join(lines)


def main():
    RESULTS.mkdir(parents=True, exist_ok=True)
    candidates = pd.read_csv(CANDIDATE_FILE, encoding="utf-8-sig")
    candidates["good_id"] = pd.to_numeric(candidates["good_id"], errors="coerce").astype(int)
    histories = {(platform, int(good_id)): load_history(int(good_id), platform) for good_id in candidates["good_id"] for platform in PLATFORMS}
    annual = build_annual(candidates, histories)
    per_item = annual[annual["scope"] == "per_item"]
    summary = pd.concat([
        summarize(per_item, ["中文名", "英文名", "good_id", "platform", "platform_name", "strategy", "execution", "friction_total"], "per_item"),
        # Aggregate from underlying item-year trades so n_trades remains the
        # actual number of item trades rather than the number of pooled years.
        summarize(per_item, ["platform", "platform_name", "strategy", "execution", "friction_total"], "all_sample"),
    ], ignore_index=True)
    consistency = build_consistency(annual)
    focus_monthly, focus_seasonal, focus_position = build_focus(candidates, histories)
    comparison = build_case_comparison(annual)
    annual.to_csv(result_path("knife_seasonality_annual.csv"), index=False, encoding="utf-8-sig")
    summary.to_csv(result_path("knife_seasonality_summary.csv"), index=False, encoding="utf-8-sig")
    consistency.to_csv(result_path("knife_buff_yyyp_consistency.csv"), index=False, encoding="utf-8-sig")
    focus_monthly.to_csv(result_path("knife_focus_13856_monthly.csv"), index=False, encoding="utf-8-sig")
    focus_seasonal.to_csv(result_path("knife_focus_13856_seasonal.csv"), index=False, encoding="utf-8-sig")
    focus_position.to_csv(result_path("knife_focus_13856_position.csv"), index=False, encoding="utf-8-sig")
    comparison.to_csv(result_path("knife_vs_cases_comparison.csv"), index=False, encoding="utf-8-sig")
    report_path = result_path("knife_seasonality_report.md")
    report_path.write_text(write_report(candidates, annual, summary, consistency, focus_position, comparison), encoding="utf-8")
    print(json.dumps({"candidates": len(candidates), "history_files": {name: sum(not histories[(platform, int(g))].empty for g in candidates["good_id"]) for platform, name in PLATFORMS.items()},
                      "annual_rows": len(annual), "summary_rows": len(summary), "consistency_rows": len(consistency), "focus_monthly_rows": len(focus_monthly),
                      "focus_seasonal_rows": len(focus_seasonal), "report": str(report_path)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
