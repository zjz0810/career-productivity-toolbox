from __future__ import annotations

import json
import math
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RAW = DATA / "raw"
RESULTS = ROOT / "results"
FOCUS_START = pd.Timestamp("2024-09-05")
EVENTS = {
    "2025-07-15": "Trade Protection / 可撤回交易",
    "2025-10-22": "五红合刀/手套",
}
EVENT_WINDOWS = [-1, 1, 3, 7, 14, 30, 60, 90]
SEASONAL_STRATEGIES = [(6, 9), (6, 10), (6, 11), (7, 9), (7, 10), (7, 11), (8, 10), (8, 11)]


def fnum(value):
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return np.nan
    try:
        return float(value)
    except (TypeError, ValueError):
        return np.nan


def fmt_pct(value):
    return "—" if pd.isna(value) else f"{value:.1%}"


def fmt_num(value):
    return "—" if pd.isna(value) else f"{value:,.2f}"


def first_on_or_after(df, date):
    rows = df[df["date"] >= pd.Timestamp(date)]
    return rows.iloc[0] if not rows.empty else None


def last_on_or_before(df, date):
    rows = df[df["date"] <= pd.Timestamp(date)]
    return rows.iloc[-1] if not rows.empty else None


def exact_row(df, date):
    rows = df[df["date"] == pd.Timestamp(date)]
    return rows.iloc[0] if not rows.empty else None


def drawdown(prices):
    values = pd.to_numeric(prices, errors="coerce").dropna()
    if values.empty:
        return np.nan
    return float((values / values.cummax() - 1).min())


def load_history(good_id, platform):
    folder = RAW / ("buff" if platform == 1 else "yyyp")
    files = sorted(folder.glob(f"{int(good_id)}_*.csv"))
    if not files:
        return pd.DataFrame(columns=["date", "price", "platform", "good_id", "case_name"])
    df = pd.read_csv(files[0])
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["date", "price"])
    df = df[df["price"] > 0].sort_values("date").drop_duplicates("date", keep="last")
    return df.reset_index(drop=True)


def write_csv(rows, filename):
    out = pd.DataFrame(rows)
    if not out.empty:
        out.to_csv(filename, index=False, encoding="utf-8-sig")
    else:
        pd.DataFrame().to_csv(filename, index=False, encoding="utf-8-sig")
    return out


def classify_drop(case_type):
    text = str(case_type or "")
    if "常规掉落" in text or ("优先掉落" in text and "绝版" not in text and "下架" not in text):
        return "仍在掉落（CSQAQ标注）"
    if "绝版" in text or "下架" in text:
        return "老箱/绝版（CSQAQ标注）"
    return "待补充"


def build_summary(cases, histories):
    rows = []
    for case in cases.to_dict("records"):
        for platform, platform_name in [(1, "BUFF"), (2, "悠悠有品")]:
            key = (platform, int(case["good_id"]))
            df = histories.get(key, pd.DataFrame())
            if df.empty:
                rows.append({"case_name": case["case_name"], "good_id": int(case["good_id"]), "platform": platform, "platform_name": platform_name, "data_points": 0})
                continue
            latest = df.iloc[-1]
            latest_date, current_price = latest["date"], float(latest["price"])
            record = {
                "case_name": case["case_name"], "good_id": int(case["good_id"]), "platform": platform, "platform_name": platform_name,
                "data_points": len(df), "earliest_date": df.iloc[0]["date"].date().isoformat(), "latest_date": latest_date.date().isoformat(),
                "current_price": current_price, "case_type": case.get("case_type", ""), "release_date": case.get("release_date", ""),
                "drop_group": classify_drop(case.get("case_type", "")), "current_sell_num": fnum(case.get("buff_sell_num_current" if platform == 1 else "yyyp_sell_num_current")),
                "historical_high": float(df["price"].max()), "historical_low": float(df["price"].min()), "max_drawdown": drawdown(df["price"]),
            }
            for label, days in [("1m", 30), ("3m", 90), ("6m", 180), ("1y", 365), ("2y", 730)]:
                base = last_on_or_before(df, latest_date - pd.Timedelta(days=days))
                record[f"{label}_base_date"] = base["date"].date().isoformat() if base is not None else ""
                record[f"{label}_return"] = current_price / float(base["price"]) - 1 if base is not None and base["price"] > 0 else np.nan
            three_year = df[df["date"] >= latest_date - pd.Timedelta(days=1095)]
            record["current_percentile_3y"] = float((three_year["price"] <= current_price).mean()) if not three_year.empty else np.nan
            focus_base = first_on_or_after(df, FOCUS_START)
            record["focus_start_date"] = focus_base["date"].date().isoformat() if focus_base is not None else ""
            record["focus_return"] = current_price / float(focus_base["price"]) - 1 if focus_base is not None and focus_base["price"] > 0 else np.nan
            rows.append(record)
    return pd.DataFrame(rows)


def monthly_price(df, year, month, version):
    rows = df[(df["date"].dt.year == year) & (df["date"].dt.month == month)]
    if rows.empty:
        return np.nan
    if version == "first5_valid_days":
        rows = rows.sort_values("date").head(5)
    return float(rows["price"].mean())


def build_seasonality(cases, histories):
    summary_rows, annual_rows = [], []
    for case in cases.to_dict("records"):
        for platform, platform_name in [(1, "BUFF"), (2, "悠悠有品")]:
            df = histories.get((platform, int(case["good_id"])), pd.DataFrame())
            if df.empty:
                continue
            for buy_month, sell_month in SEASONAL_STRATEGIES:
                strategy = f"{buy_month}月买-{sell_month}月卖"
                for version in ["first5_valid_days", "full_month_mean"]:
                    returns = []
                    for year in sorted(df["date"].dt.year.unique()):
                        buy = monthly_price(df, int(year), buy_month, version)
                        sell = monthly_price(df, int(year), sell_month, version)
                        if pd.isna(buy) or pd.isna(sell) or buy <= 0:
                            continue
                        raw = float(sell / buy - 1)
                        net = float((sell / buy) * 0.95 - 1)
                        annual_rows.append({"case_name": case["case_name"], "good_id": int(case["good_id"]), "platform": platform, "platform_name": platform_name, "strategy": strategy, "version": version, "year": int(year), "buy_price": buy, "sell_price": sell, "return": raw, "return_after_5pct": net})
                        returns.append(raw)
                    if returns:
                        arr = np.array(returns, dtype=float)
                        summary_rows.append({
                            "case_name": case["case_name"], "good_id": int(case["good_id"]), "platform": platform, "platform_name": platform_name,
                            "strategy": strategy, "version": version, "n_years": len(arr), "avg_return": float(arr.mean()), "median_return": float(np.median(arr)),
                            "win_rate": float((arr > 0).mean()), "worst_year_return": float(arr.min()), "best_year_return": float(arr.max()),
                            "avg_return_after_5pct": float(np.mean([((1 + x) * 0.95 - 1) for x in arr])),
                            "median_return_after_5pct": float(np.median([(1 + x) * 0.95 - 1 for x in arr])),
                            "annual_returns": json.dumps({str(int(y)): float(r) for y, r in zip([r["year"] for r in annual_rows[-len(arr):]], arr)}, ensure_ascii=False),
                        })
    return pd.DataFrame(summary_rows), pd.DataFrame(annual_rows)


def event_rows_for_case(df, case, platform, event_date, event_label):
    event = pd.Timestamp(event_date)
    base = exact_row(df, event - pd.Timedelta(days=1))
    rows = []
    for relative in EVENT_WINDOWS:
        target_date = event if relative == -1 else event + pd.Timedelta(days=relative)
        target = exact_row(df, target_date)
        status = "ok"
        if base is None:
            status = "missing_base"
        elif target is None:
            status = "missing_target"
        pct = float(target["price"] / base["price"] - 1) if status == "ok" and base["price"] > 0 else np.nan
        rows.append({
            "row_type": "case", "event_date": event_date, "event_label": event_label, "case_name": case["case_name"], "good_id": int(case["good_id"]),
            "platform": platform, "platform_name": "BUFF" if platform == 1 else "悠悠有品", "drop_group": classify_drop(case.get("case_type", "")),
            "relative_day": relative, "base_date": base["date"].date().isoformat() if base is not None else "", "target_date": target["date"].date().isoformat() if target is not None else "",
            "base_price": float(base["price"]) if base is not None else np.nan, "target_price": float(target["price"]) if target is not None else np.nan,
            "pct_change": pct, "n_cases": 1, "status": status,
        })
    return rows


def build_events(cases, histories, event_date, event_label):
    rows = []
    case_prices = {}
    for case in cases.to_dict("records"):
        for platform in [1, 2]:
            df = histories.get((platform, int(case["good_id"])), pd.DataFrame())
            if df.empty:
                continue
            rows.extend(event_rows_for_case(df, case, platform, event_date, event_label))
            event_row = exact_row(df, pd.Timestamp(event_date))
            if event_row is not None:
                case_prices[(platform, int(case["good_id"]))] = float(event_row["price"])
    for platform in [1, 2]:
        values = [price for (p, _), price in case_prices.items() if p == platform]
        median_price = float(np.median(values)) if values else np.nan
        segments = {"全部箱子": lambda c: True}
        available_cases = [c for c in cases.to_dict("records") if (platform, int(c["good_id"])) in case_prices]
        segments["老箱/绝版"] = lambda c: classify_drop(c.get("case_type", "")) == "老箱/绝版（CSQAQ标注）"
        segments["仍在掉落"] = lambda c: classify_drop(c.get("case_type", "")) == "仍在掉落（CSQAQ标注）"
        segments["低价（事件日中位数以下）"] = lambda c: case_prices[(platform, int(c["good_id"]))] < median_price
        segments["贵价（事件日中位数及以上）"] = lambda c: case_prices[(platform, int(c["good_id"]))] >= median_price
        for segment, predicate in segments.items():
            selected = [c for c in available_cases if predicate(c)]
            if not selected:
                continue
            for relative in EVENT_WINDOWS:
                changes = []
                target_date = pd.Timestamp(event_date) if relative == -1 else pd.Timestamp(event_date) + pd.Timedelta(days=relative)
                for case in selected:
                    df = histories[(platform, int(case["good_id"]))]
                    event_row = exact_row(df, pd.Timestamp(event_date))
                    target = exact_row(df, target_date)
                    if event_row is not None and target is not None and event_row["price"] > 0:
                        changes.append(float(target["price"] / event_row["price"] - 1))
                rows.append({"row_type": "index", "event_date": event_date, "event_label": event_label, "case_name": "箱子等权指数", "good_id": "", "platform": platform, "platform_name": "BUFF" if platform == 1 else "悠悠有品", "drop_group": segment, "relative_day": relative, "base_date": event_date, "target_date": target_date.date().isoformat(), "base_price": np.nan, "target_price": np.nan, "pct_change": float(np.mean(changes)) if changes else np.nan, "n_cases": len(changes), "status": "ok" if changes else "missing_target"})
    return pd.DataFrame(rows)


def portfolio_path(selected, platform, histories, start_date):
    entries = []
    for good_id in selected:
        df = histories.get((platform, int(good_id)), pd.DataFrame())
        row = first_on_or_after(df, start_date)
        if row is None:
            return None
        entries.append((int(good_id), row["date"], float(row["price"]), df))
    common_start = max(item[1] for item in entries)
    usable = []
    for good_id, _, _, df in entries:
        row = first_on_or_after(df, common_start)
        if row is None:
            return None
        usable.append((good_id, row["date"], float(row["price"]), df))
    common_end = min(df.iloc[-1]["date"] for _, _, _, df in usable)
    dates = pd.date_range(common_start, common_end, freq="D")
    paths = []
    for good_id, entry_date, entry_price, df in usable:
        series = df.set_index("date")["price"].reindex(dates).ffill()
        series = series[series.index >= entry_date]
        if series.empty:
            return None
        paths.append(series / entry_price)
    path = pd.concat(paths, axis=1).ffill().dropna()
    wealth = path.mean(axis=1)
    return {"path": wealth, "start_date": common_start, "end_date": common_end, "entry_prices": {g: p for g, _, p, _ in usable}, "exit_price": {g: float(s.iloc[-1]) for (g, _, _, _), s in zip(usable, [df.set_index("date")["price"].reindex(dates).ffill() for _, _, _, df in usable])}}


def simulate(cases, summary, histories):
    rows = []
    valid = summary[(summary["data_points"] > 0) & summary["focus_return"].notna()].copy()
    for platform, platform_name in [(1, "BUFF"), (2, "悠悠有品")]:
        plat = valid[valid["platform"] == platform].copy()
        if plat.empty:
            continue
        current_price_col = "buff_price_current" if platform == 1 else "yyyp_price_current"
        num_col = "buff_sell_num_current" if platform == 1 else "yyyp_sell_num_current"
        top5 = plat.sort_values("focus_return", ascending=False).head(5)
        candidates = plat[pd.to_numeric(plat["current_price"], errors="coerce").notna()].copy()
        price_median = candidates["current_price"].median()
        num_median = candidates["current_sell_num"].median()
        low_liquid = candidates[(candidates["current_price"] <= price_median) & (candidates["current_sell_num"] >= num_median)].sort_values(["current_price", "current_sell_num"], ascending=[True, False]).head(5)
        if len(low_liquid) < 5:
            low_liquid = candidates.sort_values(["current_price", "current_sell_num"], ascending=[True, False]).head(5)
        portfolios = [("top5_focus_return", top5), ("low_price_high_sell_num_current", low_liquid)]
        for capital in [3000, 13000]:
            for strategy, selected_df in portfolios:
                selected = selected_df["good_id"].astype(int).tolist()
                result = portfolio_path(selected, platform, histories, FOCUS_START)
                if result is None:
                    continue
                raw_return = float(result["path"].iloc[-1] - 1)
                days = max(1, (result["end_date"] - result["start_date"]).days)
                benchmark_asset = capital * (1.013 ** (days / 365.0))
                for friction in [0.0, 0.05]:
                    net_return = (1 + raw_return) * (1 - friction) - 1
                    asset = capital * (1 + net_return)
                    rows.append({"strategy": strategy, "platform": platform, "platform_name": platform_name, "starting_capital": capital, "friction_total": friction, "start_date": result["start_date"].date().isoformat(), "end_date": result["end_date"].date().isoformat(), "selected_cases": " | ".join(selected_df["case_name"].tolist()), "selected_good_ids": " | ".join(map(str, selected)), "n_cases": len(selected), "raw_return": raw_return, "return": net_return, "final_asset": asset, "net_profit": asset - capital, "max_drawdown": drawdown(result["path"]), "benchmark_asset_1_3pct": benchmark_asset, "beat_1_3pct": asset > benchmark_asset})
            for _, item in plat.iterrows():
                good_id = int(item["good_id"])
                df = histories[(platform, good_id)]
                entry = first_on_or_after(df, FOCUS_START)
                if entry is None:
                    continue
                exit_row = df.iloc[-1]
                raw_return = float(exit_row["price"] / entry["price"] - 1)
                days = max(1, (exit_row["date"] - entry["date"]).days)
                benchmark_asset = 1.013 ** (days / 365.0)
                for capital in [3000, 13000]:
                    for friction in [0.0, 0.05]:
                        net_return = (1 + raw_return) * (1 - friction) - 1
                        asset = capital * (1 + net_return)
                        rows.append({"strategy": "single_case_buy_and_hold", "platform": platform, "platform_name": platform_name, "starting_capital": capital, "friction_total": friction, "start_date": entry["date"].date().isoformat(), "end_date": exit_row["date"].date().isoformat(), "selected_cases": item["case_name"], "selected_good_ids": str(good_id), "n_cases": 1, "raw_return": raw_return, "return": net_return, "final_asset": asset, "net_profit": asset - capital, "max_drawdown": drawdown(df[df["date"] >= entry["date"]]["price"]), "benchmark_asset_1_3pct": capital * benchmark_asset, "beat_1_3pct": asset > capital * benchmark_asset})
    return pd.DataFrame(rows)


def report_text(cases, summary, seasonality, events, simulation, failures):
    valid = summary[summary["data_points"] > 0]
    lines = [
        "# CS2 武器箱历史价格回测报告", "", "## 数据范围与口径", "",
        f"数据源：CSQAQ 官方 API；抓取日期：2026-09-05；武器箱数量：{len(cases)} 个。原始历史仅使用 `get_item_chart(key=sell_price, period=1095, style=all_style)`，BUFF 与悠悠有品完全分开。日期按 Asia/Shanghai 转换。",
        "", "| 平台 | 有历史数据箱数 | 总价格点 | 最早日期 | 最晚日期 |", "|---|---:|---:|---|---|",
    ]
    for platform, name in [(1, "BUFF"), (2, "悠悠有品")]:
        s = valid[valid["platform"] == platform]
        lines.append(f"| {name} | {s['good_id'].nunique()} | {int(s['data_points'].sum()) if not s.empty else 0} | {s['earliest_date'].min() if not s.empty else '—'} | {s['latest_date'].max() if not s.empty else '—'} |")
    lines += ["", f"失败记录：{len(failures)} 条。空数据、缺少事件日期或缺少季节性买卖月份的结果均留空，不以 0 代替。", "", "## 关键结论", ""]
    for platform, name in [(1, "BUFF"), (2, "悠悠有品")]:
        top = valid[(valid["platform"] == platform) & valid["2y_return"].notna()].sort_values("2y_return", ascending=False).head(5)
        lines.append(f"### 近两年回报最高的箱子（{name}）")
        lines.append("")
        if top.empty:
            lines.append("数据不足，无法计算。")
        else:
            lines.append("；".join(f"{r.case_name}（2年 {fmt_pct(r['2y_return'])}，当前 {fmt_num(r['current_price'])} 元，近3年百分位 {fmt_pct(r['current_percentile_3y'])}）" for _, r in top.iterrows()))
        chase = valid[(valid["platform"] == platform) & (valid["current_percentile_3y"] >= 0.9) & (valid["3m_return"].notna()) & (valid["3m_return"] <= 0)].sort_values("2y_return", ascending=False).head(8)
        lines.append("")
        lines.append(f"历史涨幅较大但当前不宜追高候选（规则：当前处于近3年90%分位以上且近3个月不涨，{name}）：" + ("；".join(f"{r.case_name}（百分位 {fmt_pct(r['current_percentile_3y'])}，近3个月 {fmt_pct(r['3m_return'])}）" for _, r in chase.iterrows()) if not chase.empty else "无符合该规则的箱子。"))
        lines.append("")
    five = events[(events["event_date"] == "2025-10-22") & (events["row_type"] == "index") & (events["drop_group"] == "全部箱子") & events["relative_day"].isin([30, 60, 90])]
    lines += ["### 五红更新后的箱子整体表现", ""]
    for platform, name in [(1, "BUFF"), (2, "悠悠有品")]:
        s = five[five["platform"] == platform].set_index("relative_day")["pct_change"]
        vals = [s.get(x, np.nan) for x in [30, 60, 90]]
        label = "增强" if all(pd.notna(v) and v > 0 for v in vals) else "削弱" if all(pd.notna(v) and v < 0 for v in vals) else "混合/不明显"
        lines.append(f"{name}：+30天 {fmt_pct(vals[0])}，+60天 {fmt_pct(vals[1])}，+90天 {fmt_pct(vals[2])}，结论：{label}。")
        grouped = events[(events["platform"] == platform) & (events["row_type"] == "index") & (events["drop_group"] != "全部箱子") & events["relative_day"].isin([30, 60, 90])]
        for segment in ["老箱/绝版", "仍在掉落", "低价（事件日中位数以下）", "贵价（事件日中位数及以上）"]:
            g = grouped[grouped["drop_group"] == segment].set_index("relative_day")
            if not g.empty:
                lines.append(f"{name} {segment}：+30 {fmt_pct(g['pct_change'].get(30, np.nan))}、+60 {fmt_pct(g['pct_change'].get(60, np.nan))}、+90 {fmt_pct(g['pct_change'].get(90, np.nan))}（+90样本 {int(g['n_cases'].get(90, 0))}）。")
    lines.append("该结论是全体可计算箱子的等权指数，不代表单个箱子；老箱/仍在掉落箱与低价/贵价分组见对应事件 CSV。掉落分组只使用 CSQAQ 的 `case_type`，无法识别的条目标为“待补充”。")
    lines += ["", "### 月份规律", ""]
    for platform, name in [(1, "BUFF"), (2, "悠悠有品")]:
        s = seasonality[(seasonality["platform"] == platform) & (seasonality["version"] == "first5_valid_days") & (seasonality["n_years"] >= 2)].sort_values(["median_return", "win_rate"], ascending=False).head(3)
        lines.append(f"{name} 前5个有效交易日版本：" + ("；".join(f"{r.strategy}（中位数 {fmt_pct(r['median_return'])}，胜率 {fmt_pct(r['win_rate'])}，样本 {int(r['n_years'])} 年）" for _, r in s.iterrows()) if not s.empty else "数据不足。"))
    lines.append("整月均价稳健性结果见 `results/seasonality.csv` 的 `full_month_mean` 行；未使用当月最低价/最高价。")
    lines += ["", "### 3000 元模拟", ""]
    for platform, name in [(1, "BUFF"), (2, "悠悠有品")]:
        s = simulation[(simulation["platform"] == platform) & (simulation["starting_capital"] == 3000) & (simulation["friction_total"] == 0.05) & simulation["strategy"].isin(["top5_focus_return", "low_price_high_sell_num_current"])]
        lines.append(f"{name}（总买卖摩擦 5%）：" + ("；".join(f"{r.strategy} 最终 {r.final_asset:,.0f} 元，收益 {fmt_pct(r['return'])}，最大回撤 {fmt_pct(r['max_drawdown'])}，{'跑赢' if r.beat_1_3pct else '未跑赢'} 1.3%理财" for _, r in s.iterrows()) if not s.empty else "数据不足。"))
    lines.append("单个箱子买入持有的全部结果见 `results/simulation.csv`。多箱组合使用共同可用起始日；低价高流动组合中的“流动性”仅以当前在售数量作代理，不等同于成交量。`top5_focus_return` 使用完整区间的最终表现事后筛选，不能直接视为当时可执行的前瞻策略；低价高在售数量组合也使用当前元数据筛选。")
    lines.append("")
    lines.append("基于本项目实际抓取的箱子数据，可以判断箱子策略相对 1.3% 理财是否有历史优势；本项目没有抓取刀皮历史数据，因此不能据此证明刀皮波段更好或更差，也没有混入其他网站数据。")
    lines += ["", "## 输出文件", "", "- `data/raw/buff/`、`data/raw/yyyp/`：每个箱子一个原始历史 CSV。", "- `data/cases.csv`：CSQAQ 武器箱、平台当前价、类型和上线时间元数据。", "- `results/backtest_summary.csv`：持有期、回撤、历史高低点、近3年百分位。", "- `results/seasonality.csv`：季节性策略汇总；`results/seasonality_annual.csv` 为逐年明细。", "- `results/event_2025_07_15.csv`、`results/event_2025_10_22.csv`：事件窗口与分组指数。", "- `results/simulation.csv`：3000/13000 元、0%/5%摩擦的单箱和组合模拟。"]
    return "\n".join(lines) + "\n"


def main():
    RESULTS.mkdir(parents=True, exist_ok=True)
    cases = pd.read_csv(DATA / "cases.csv", encoding="utf-8-sig")
    cases["good_id"] = pd.to_numeric(cases["good_id"], errors="coerce").astype("Int64")
    histories = {(platform, int(good_id)): load_history(good_id, platform) for good_id in cases["good_id"].dropna().astype(int) for platform in [1, 2]}
    summary = build_summary(cases, histories)
    seasonality, seasonality_annual = build_seasonality(cases, histories)
    event_outputs = {date: build_events(cases, histories, date, label) for date, label in EVENTS.items()}
    simulation = simulate(cases, summary, histories)
    failures = pd.read_csv(DATA / "failures.csv", encoding="utf-8-sig") if (DATA / "failures.csv").exists() else pd.DataFrame()
    summary.to_csv(RESULTS / "backtest_summary.csv", index=False, encoding="utf-8-sig")
    seasonality.to_csv(RESULTS / "seasonality.csv", index=False, encoding="utf-8-sig")
    seasonality_annual.to_csv(RESULTS / "seasonality_annual.csv", index=False, encoding="utf-8-sig")
    event_outputs["2025-07-15"].to_csv(RESULTS / "event_2025_07_15.csv", index=False, encoding="utf-8-sig")
    event_outputs["2025-10-22"].to_csv(RESULTS / "event_2025_10_22.csv", index=False, encoding="utf-8-sig")
    simulation.to_csv(RESULTS / "simulation.csv", index=False, encoding="utf-8-sig")
    (RESULTS / "report.md").write_text(report_text(cases, summary, seasonality, event_outputs["2025-10-22"], simulation, failures), encoding="utf-8")
    print(json.dumps({
        "cases": int(len(cases)), "buff_files": int(sum(not histories[(1, int(g))].empty for g in cases["good_id"].dropna().astype(int))),
        "yyyp_files": int(sum(not histories[(2, int(g))].empty for g in cases["good_id"].dropna().astype(int))),
        "summary_rows": int(len(summary)), "seasonality_rows": int(len(seasonality)), "event_rows": {k: int(len(v)) for k, v in event_outputs.items()},
        "simulation_rows": int(len(simulation)), "failures": int(len(failures)), "report": str(RESULTS / "report.md"),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
