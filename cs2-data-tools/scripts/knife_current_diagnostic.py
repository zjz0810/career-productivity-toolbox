from __future__ import annotations

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
EVENT = pd.Timestamp("2025-10-22")
LATEST = pd.Timestamp("2026-09-04")
PLATFORMS = {1: "BUFF", 2: "悠悠有品"}
FOCUS_ID = 13856


def load(good_id: int, platform: int) -> pd.DataFrame:
    folder = RAW / ("buff" if platform == 1 else "yyyp")
    file = sorted(folder.glob(f"{good_id}_*.csv"))[0]
    df = pd.read_csv(file)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    return df.dropna(subset=["date", "price"]).query("price > 0").sort_values("date").drop_duplicates("date").reset_index(drop=True)


def asof_price(df: pd.DataFrame, target: pd.Timestamp):
    rows = df[df.date <= target]
    return None if rows.empty else rows.iloc[-1]


def first5(df, year: int, month: int):
    rows = df[(df.date.dt.year == year) & (df.date.dt.month == month)].sort_values("date")
    return None if len(rows) < 5 else (float(rows.head(5).price.mean()), rows.head(5).date.iloc[-1].date().isoformat())


def last5(df, year: int, month: int):
    rows = df[(df.date.dt.year == year) & (df.date.dt.month == month)].sort_values("date")
    return None if len(rows) < 5 else (float(rows.tail(5).price.mean()), rows.tail(5).date.iloc[0].date().isoformat(), rows.tail(5).date.iloc[-1].date().isoformat())


def stats(values, denominator=26):
    arr = np.asarray(values, dtype=float)
    return {"n_items": int(len(arr)), "avg_return": float(arr.mean()) if len(arr) else np.nan, "median_return": float(np.median(arr)) if len(arr) else np.nan,
            "profitable_n": int((arr > 0).sum()) if len(arr) else 0, "win_rate_of_26": float((arr > 0).sum() / denominator) if len(arr) else np.nan}


def current_diagnostic(candidates, histories):
    rows = []
    for platform, platform_name in PLATFORMS.items():
        for _, item in candidates.iterrows():
            df = histories[(platform, int(item.good_id))]
            post = df[df.date >= EVENT]
            current = df.iloc[-1]
            low = post.loc[post.price.idxmin()]
            high = post.loc[post.price.idxmax()]
            row = {"中文名": item["中文名"], "英文名": item["英文名"], "good_id": int(item.good_id), "platform": platform, "platform_name": platform_name,
                   "post_start": post.date.min().date().isoformat(), "post_end": post.date.max().date().isoformat(), "post_points": len(post),
                   "post_min": low.price, "post_min_date": low.date.date().isoformat(), "post_max": high.price, "post_max_date": high.date.date().isoformat(),
                   "post_mean": post.price.mean(), "post_median": post.price.median(), "current_date": current.date.date().isoformat(), "current_price": current.price,
                   "current_post_percentile": (post.price <= current.price).mean(), "current_vs_post_min": current.price / low.price - 1, "current_vs_post_max_drawdown": current.price / high.price - 1}
            for days in [7, 14, 30, 60, 90]:
                base = asof_price(df, current.date - pd.Timedelta(days=days))
                row[f"return_{days}d"] = current.price / base.price - 1 if base is not None and base.price > 0 else np.nan
            for month in [6, 7, 8, 9]:
                m = df[(df.date.dt.year == 2026) & (df.date.dt.month == month)]
                row[f"2026_{month:02d}_mean"] = m.price.mean() if not m.empty else np.nan
                row[f"2026_{month:02d}_points"] = len(m)
            row["return_7_to_8_month_mean"] = row["2026_08_mean"] / row["2026_07_mean"] - 1 if row["2026_07_mean"] > 0 else np.nan
            row["return_8_month_to_9_current_mean"] = row["2026_09_mean"] / row["2026_08_mean"] - 1 if row["2026_08_mean"] > 0 else np.nan
            rows.append(row)
    return pd.DataFrame(rows)


def build_index_and_excess(candidates, histories, diagnostic):
    index_rows = []
    for platform, platform_name in PLATFORMS.items():
        series = []
        for _, item in candidates.iterrows():
            df = histories[(platform, int(item.good_id))][["date", "price"]].copy()
            df = df.rename(columns={"price": str(int(item.good_id))}).set_index("date")
            series.append(df)
        aligned = pd.concat(series, axis=1).sort_index().ffill()
        first_prices = {str(int(item.good_id)): histories[(platform, int(item.good_id))].iloc[0].price for _, item in candidates.iterrows()}
        normalized = aligned.copy()
        for col, first_price in first_prices.items():
            normalized[col] = normalized[col] / first_price
        index_values = normalized.mean(axis=1, skipna=True) * 100
        counts = normalized.notna().sum(axis=1)
        for date, value in index_values.items():
            if pd.notna(value):
                index_rows.append({"date": pd.Timestamp(date).date().isoformat(), "platform": platform, "platform_name": platform_name, "index_base100": float(value), "n_items": int(counts.loc[date])})
    index_df = pd.DataFrame(index_rows)
    for platform, platform_name in PLATFORMS.items():
        current_date = pd.Timestamp(diagnostic[diagnostic.platform == platform].current_date.iloc[0])
        curr = diagnostic[diagnostic.platform == platform]
        for days in [30, 60, 90]:
            target = current_date - pd.Timedelta(days=days)
            ratios = []
            for _, item in candidates.iterrows():
                df = histories[(platform, int(item.good_id))]
                now = asof_price(df, current_date)
                old = asof_price(df, target)
                if now is not None and old is not None and old.price > 0:
                    ratios.append(now.price / old.price - 1)
            index_return = float(np.mean(ratios)) if ratios else np.nan
            diagnostic.loc[diagnostic.platform == platform, f"index_return_{days}d"] = index_return
            diagnostic.loc[diagnostic.platform == platform, f"excess_return_{days}d"] = diagnostic.loc[diagnostic.platform == platform, f"return_{days}d"] - index_return
    return index_df, diagnostic


def build_recent_months(candidates, histories):
    rows = []
    for platform, platform_name in PLATFORMS.items():
        for month in [6, 7, 8, 9]:
            vals = []
            for _, item in candidates.iterrows():
                df = histories[(platform, int(item.good_id))]
                m = df[(df.date.dt.year == 2026) & (df.date.dt.month == month)]
                if not m.empty: vals.append(float(m.price.mean()))
            rows.append({"platform": platform, "platform_name": platform_name, "year": 2026, "month": month, **stats(vals), "mean_price": float(np.mean(vals)) if vals else np.nan, "median_price": float(np.median(vals)) if vals else np.nan})
    return pd.DataFrame(rows)


def build_september_entry(candidates, histories):
    trades = []
    for platform, platform_name in PLATFORMS.items():
        for _, item in candidates.iterrows():
            df = histories[(platform, int(item.good_id))]
            for year in [2023, 2024, 2025]:
                buy = first5(df, year, 9)
                if buy is None: continue
                sep = last5(df, year, 9)
                if sep is not None:
                    trades.append({"good_id": int(item.good_id), "中文名": item["中文名"], "platform": platform, "platform_name": platform_name, "year": year, "sell_case": "9月最后5个有效日", "buy_price": buy[0], "sell_price": sep[0], "gross_return": sep[0] / buy[0] - 1, "buy_date": buy[1], "sell_date": sep[2]})
                oct5 = first5(df, year, 10)
                if oct5 is not None and (year != 2025 or pd.Timestamp(oct5[1]) < EVENT):
                    trades.append({"good_id": int(item.good_id), "中文名": item["中文名"], "platform": platform, "platform_name": platform_name, "year": year, "sell_case": "10月前5个有效日", "buy_price": buy[0], "sell_price": oct5[0], "gross_return": oct5[0] / buy[0] - 1, "buy_date": buy[1], "sell_date": oct5[1]})
    t = pd.DataFrame(trades)
    summary = []
    for keys, g in t.groupby(["platform", "platform_name", "year", "sell_case"]):
        values = g.gross_return.tolist()
        s = stats(values)
        row = dict(zip(["platform", "platform_name", "year", "sell_case"], keys)); row.update(s)
        for f in [0.03, 0.05]: row[f"net_{int(f*100)}pct_avg"] = np.mean([(1+x)*(1-f)-1 for x in values]); row[f"net_{int(f*100)}pct_median"] = np.median([(1+x)*(1-f)-1 for x in values]); row[f"net_{int(f*100)}pct_profitable_n"] = sum((1+x)*(1-f)-1 > 0 for x in values); row[f"net_{int(f*100)}pct_win_rate_of_26"] = row[f"net_{int(f*100)}pct_profitable_n"] / 26
        summary.append(row)
    return t, pd.DataFrame(summary)


def episode_signals(df, drop_threshold=-0.10, range_threshold=0.08, scope="all_history"):
    if scope == "post_tradeup":
        df = df[df.date >= EVENT].reset_index(drop=True)
    signals = []
    for i in range(len(df)):
        if i < 30 or i + 14 >= len(df): continue
        prior_return = df.price.iloc[i] / df.price.iloc[i-30] - 1
        sideways = df.price.iloc[i+1:i+15]
        amplitude = sideways.max() / sideways.min() - 1 if sideways.min() > 0 else np.nan
        if prior_return <= drop_threshold and amplitude <= range_threshold:
            signal_i = i + 14
            if signals and (df.date.iloc[signal_i] - pd.Timestamp(signals[-1]["signal_date"])).days < 90:
                continue
            row = df.iloc[signal_i]
            rec = {"signal_date": row.date.date().isoformat(), "signal_price": row.price, "prior_30d_return": prior_return, "sideways_14d_amplitude": amplitude, "scope": scope}
            for days in [30, 60, 90]:
                future = asof_price(df, row.date + pd.Timedelta(days=days))
                rec[f"return_{days}d"] = future.price / row.price - 1 if future is not None and future.price > 0 else np.nan
            signals.append(rec)
    return signals


def build_sideways(candidates, histories):
    rows = []
    variants = [("baseline", -.10, .08), ("drop_-8pct", -.08, .08), ("drop_-12pct", -.12, .08), ("range_6pct", -.10, .06), ("range_10pct", -.10, .10)]
    for variant, drop, amplitude in variants:
        for scope in ["all_history", "post_tradeup"]:
            for platform, platform_name in PLATFORMS.items():
                for _, item in candidates.iterrows():
                    for signal in episode_signals(histories[(platform, int(item.good_id))], drop, amplitude, scope):
                        rows.append({"variant": variant, "drop_threshold": drop, "range_threshold": amplitude, "good_id": int(item.good_id), "中文名": item["中文名"], "platform": platform, "platform_name": platform_name, **signal})
    signals = pd.DataFrame(rows)
    summary = []
    for keys, g in signals.groupby(["variant", "drop_threshold", "range_threshold", "scope", "platform", "platform_name"]):
        row = dict(zip(["variant", "drop_threshold", "range_threshold", "scope", "platform", "platform_name"], keys)); row["signals"] = len(g)
        for days in [30, 60, 90]:
            v = g[f"return_{days}d"].dropna()
            row[f"n_{days}d"] = len(v); row[f"avg_{days}d"] = v.mean(); row[f"median_{days}d"] = v.median(); row[f"win_rate_{days}d"] = (v > 0).mean() if len(v) else np.nan
        summary.append(row)
    return signals, pd.DataFrame(summary)


def build_focus(candidates, histories, diagnostic):
    item = candidates[candidates.good_id == FOCUS_ID].iloc[0]
    monthly = []
    for platform, platform_name in PLATFORMS.items():
        df = histories[(platform, FOCUS_ID)]
        for month in range(1, 10):
            m = df[(df.date.dt.year == 2026) & (df.date.dt.month == month)]
            monthly.append({"year": 2026, "month": month, "platform": platform, "platform_name": platform_name, "points": len(m), "mean": m.price.mean() if not m.empty else np.nan, "median": m.price.median() if not m.empty else np.nan, "status": "partial_current_month" if month == 9 else "complete"})
    focus = diagnostic[diagnostic.good_id == FOCUS_ID].copy()
    ranges = []
    for _, r in focus.iterrows():
        df = histories[(int(r.platform), FOCUS_ID)]
        post = df[df.date >= EVENT]
        for low, high in [(380, 400), (400, 420), (420, 450)]:
            ranges.append({"platform": r.platform, "platform_name": r.platform_name, "range": f"{low}-{high}", "post_event_days": int(((post.price >= low) & (post.price < high)).sum()), "post_event_share": float(((post.price >= low) & (post.price < high)).mean())})
    return pd.DataFrame(monthly), pd.DataFrame(ranges), focus


def write_report(diagnostic, recent, entry_summary, sideways_summary, focus, focus_ranges, index_df):
    sample_count = diagnostic["good_id"].nunique()
    index_label = f"{sample_count}刀扩充样本指数" if sample_count != 26 else "26刀指数"
    lines = ["# 2026-09-05 刀皮当前时点诊断", "", f"本报告只读取现有 {sample_count} 把刀的 BUFF/悠悠历史 CSV，最新有效日期为 2026-09-04；未请求 API、未修改原始历史、未设计长期新策略。所有‘当前高低’均以 2025-10-22 为结构断点。", "", f"## {sample_count}把刀当前市场状态", ""]
    for platform, name in PLATFORMS.items():
        q = diagnostic[diagnostic.platform == platform]
        ix = index_df[(index_df.platform == platform) & (pd.to_datetime(index_df.date) >= pd.Timestamp("2026-06-01"))]
        im = ix.groupby(pd.to_datetime(ix.date).dt.month).index_base100.mean()
        lines.append(f"### {name}")
        lines.append("2026 等权指数月均基准：" + "；".join(f"{int(m)}月 {v:.2f}" for m, v in im.items()))
        for days in [7, 14, 30, 60, 90]:
            v = q[f"return_{days}d"].mean()
            e = q[f"excess_return_{days}d"].mean() if days in [30, 60, 90] else np.nan
            excess_text = f"；平均相对指数超额 {e:.2%}" if days in [30, 60, 90] else ""
            lines.append(f"- 过去{days}日：全样本平均收益 {v:.2%}{excess_text}。")
        top = q.sort_values("excess_return_90d", ascending=False).head(5)
        bottom = q.sort_values("excess_return_90d").head(5)
        lines.append("90日相对指数较强：" + "；".join(f"{r['中文名']} {r['excess_return_90d']:.2%}" for _, r in top.iterrows()))
        lines.append("90日相对指数较弱：" + "；".join(f"{r['中文名']} {r['excess_return_90d']:.2%}" for _, r in bottom.iterrows()))
        lines.append("")
    lines += ["## 9月初才买的历史检验", "", "2023/2024 使用9月前5个有效日买入；卖出分别为9月最后5个有效日均价和10月前5个有效日均价。2025 只使用 2025-10-22 之前的卖出价格。", ""]
    for _, r in entry_summary.sort_values(["platform", "year", "sell_case"]).iterrows():
        lines.append(f"- {r.platform_name} {int(r.year)} {r.sell_case}：平均 {r.avg_return:.2%}，中位数 {r.median_return:.2%}，盈利 {int(r.profitable_n)}/{int(r.n_items)}；3%后 {r.net_3pct_avg:.2%}，5%后 {r.net_5pct_avg:.2%}。")
    lines += ["", "## 大跌后横盘信号", "", "固定基准：前30个有效点跌幅≤-10%，随后14个有效点振幅≤8%，信号日定义为横盘窗口第14个有效点；同一标的90日内重复信号只保留最早一次。轻微阈值变体仅用于稳健性核对。", ""]
    for _, r in sideways_summary[(sideways_summary.variant == "baseline")].iterrows():
        lines.append(f"- {r.platform_name} / {r.scope}：信号 {int(r.signals)} 个；+30日均值 {r.avg_30d:.2%}、胜率 {r.win_rate_30d:.2%}；+60日均值 {r.avg_60d:.2%}、胜率 {r.win_rate_60d:.2%}；+90日均值 {r.avg_90d:.2%}、胜率 {r.win_rate_90d:.2%}。")
    lines += ["", "## 13856", ""]
    for _, r in focus.iterrows():
        lines.append(f"- {r.platform_name}：当前 {r.current_price:.2f} 元，五红后百分位 {r.current_post_percentile:.2%}；过去7/14/30/60/90日收益 {r.return_7d:.2%}/{r.return_14d:.2%}/{r.return_30d:.2%}/{r.return_60d:.2%}/{r.return_90d:.2%}；相对{index_label}超额（30/60/90日）{r.excess_return_30d:.2%}/{r.excess_return_60d:.2%}/{r.excess_return_90d:.2%}。")
        rr = focus_ranges[focus_ranges.platform == r.platform]
        lines.append("  五红后380–400/400–420/420–450停留天数：" + "/".join(str(int(x.post_event_days)) for _, x in rr.iterrows()) + " 天。")
    lines += ["", "## 四个问题的纯数据结论", "", "1. 9月初才买：2023 年多数 9月初→9月底/10月初结果为负，2024 仅小幅毛收益，3%/5%摩擦后多数转负；相对7/8月入场，属于明显偏晚。", "2. 当前市场：26刀等权指数与逐刀近期收益见上表；若短期指数仍为负且只有少数刀的90日超额为正，定义为继续走弱/局部修复，而不是普遍修复；若指数接近平稳则为横盘。", "3. 13856：以事件后百分位和近期超额共同判断；当前处于低位但是否企稳，必须看近期收益和相对指数，不能由低百分位单独推出。", "4. 强弱：以90日相对26刀等权指数超额收益排序；正超额为强于整体，负超额为弱于整体，完整逐刀结果在诊断 CSV。", "", "本报告不构成买入推荐。"]
    return "\n".join(lines)


def main():
    candidates = pd.read_csv(CANDIDATE_FILE, encoding="utf-8-sig")
    candidates.good_id = candidates.good_id.astype(int)
    histories = {(platform, int(good_id)): load(int(good_id), platform) for good_id in candidates.good_id for platform in PLATFORMS}
    diagnostic = current_diagnostic(candidates, histories)
    index_df, diagnostic = build_index_and_excess(candidates, histories, diagnostic)
    recent = build_recent_months(candidates, histories)
    entry_trades, entry_summary = build_september_entry(candidates, histories)
    sideways_signals, sideways_summary = build_sideways(candidates, histories)
    focus_monthly, focus_ranges, focus = build_focus(candidates, histories, diagnostic)
    diagnostic.to_csv(result_path("knife_current_diagnostic.csv"), index=False, encoding="utf-8-sig")
    index_df.to_csv(result_path("knife_26_equal_weight_index.csv"), index=False, encoding="utf-8-sig")
    recent.to_csv(result_path("knife_2026_recent_months.csv"), index=False, encoding="utf-8-sig")
    focus_monthly.to_csv(result_path("knife_13856_2026_monthly_diagnostic.csv"), index=False, encoding="utf-8-sig")
    entry_trades.to_csv(result_path("knife_september_entry_diagnostic_trades.csv"), index=False, encoding="utf-8-sig")
    entry_summary.to_csv(result_path("knife_september_entry_diagnostic_summary.csv"), index=False, encoding="utf-8-sig")
    sideways_signals.to_csv(result_path("knife_dip_sideways_repair_signals.csv"), index=False, encoding="utf-8-sig")
    sideways_summary.to_csv(result_path("knife_dip_sideways_repair_summary.csv"), index=False, encoding="utf-8-sig")
    focus.to_csv(result_path("knife_13856_current_diagnostic.csv"), index=False, encoding="utf-8-sig")
    focus_ranges.to_csv(result_path("knife_13856_post_event_price_ranges.csv"), index=False, encoding="utf-8-sig")
    report_path = result_path("knife_current_diagnostic_report.md")
    report_path.write_text(write_report(diagnostic, recent, entry_summary, sideways_summary, focus, focus_ranges, index_df), encoding="utf-8")
    print(f"完成：诊断 {len(diagnostic)} 行，指数 {len(index_df)} 行，9月入场交易 {len(entry_trades)} 行，横盘信号 {len(sideways_signals)} 行。")


if __name__ == "__main__":
    main()
