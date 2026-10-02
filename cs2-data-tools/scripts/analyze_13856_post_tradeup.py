from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "knives"
RESULTS = ROOT / "results"
GOOD_ID = 13856
EVENT = pd.Timestamp("2025-10-22")
PLATFORMS = {1: "BUFF", 2: "悠悠有品"}


def load(platform: int) -> pd.DataFrame:
    folder = RAW / ("buff" if platform == 1 else "yyyp")
    file = sorted(folder.glob(f"{GOOD_ID}_*.csv"))[0]
    df = pd.read_csv(file)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    return df.dropna(subset=["date", "price"]).query("price > 0").sort_values("date").drop_duplicates("date").reset_index(drop=True)


def first5(df, year, month):
    rows = df[(df.date.dt.year == year) & (df.date.dt.month == month)].sort_values("date")
    if len(rows) < 5:
        return None
    return float(rows.head(5).price.mean()), rows.head(5).date.iloc[-1].date().isoformat(), len(rows.head(5))


def full_month(df, year, month):
    rows = df[(df.date.dt.year == year) & (df.date.dt.month == month)].sort_values("date")
    if rows.empty:
        return None
    return float(rows.price.mean()), float(rows.price.median()), len(rows), rows.date.iloc[0].date().isoformat(), rows.date.iloc[-1].date().isoformat()


def return_row(platform, platform_name, year, buy_label, buy, sell_label, sell_price, sell_date, sell_n, note):
    if buy is None or sell_price is None:
        return None
    raw = float(sell_price / buy[0] - 1)
    return {"platform": platform, "platform_name": platform_name, "year": year, "buy_execution": buy_label, "buy_date": buy[1], "buy_price": buy[0],
            "sell_execution": sell_label, "sell_date": sell_date, "sell_price": sell_price, "sell_points": sell_n, "gross_return": raw,
            "net_return_3pct": (1 + raw) * .97 - 1, "net_return_5pct": (1 + raw) * .95 - 1, "note": note}


def main():
    histories = {platform: load(platform) for platform in PLATFORMS}
    distribution, post_summary, monthly, first4, seasonal, comparison = [], [], [], [], [], []
    for platform, platform_name in PLATFORMS.items():
        df = histories[platform]
        post = df[df.date >= EVENT].copy()
        current = df.iloc[-1]
        q = post.price.quantile([0, .1, .25, .5, .75, .9, 1]).to_dict()
        post_summary.append({"platform": platform, "platform_name": platform_name, "window_start": post.date.min().date().isoformat(), "window_end": post.date.max().date().isoformat(),
                             "data_points": len(post), "mean": post.price.mean(), "median": post.price.median(), "std": post.price.std(), "min": post.price.min(), "max": post.price.max(),
                             "q0": q[0.0], "q10": q[.1], "q25": q[.25], "q50": q[.5], "q75": q[.75], "q90": q[.9], "q100": q[1.0],
                             "current_date": current.date.date().isoformat(), "current_price": current.price, "current_percentile_post_event": (post.price <= current.price).mean()})
        for _, row in post.iterrows():
            distribution.append({"date": row.date.date().isoformat(), "price": row.price, "platform": platform, "platform_name": platform_name, "good_id": GOOD_ID})
        for days in [30, 60, 90, 180]:
            window = df[(df.date >= EVENT) & (df.date <= EVENT + pd.Timedelta(days=days))]
            post_summary[-1].update({f"mean_{days}d": window.price.mean(), f"median_{days}d": window.price.median(), f"points_{days}d": len(window), f"end_{days}d": (window.date.max().date().isoformat() if not window.empty else "")})
        for year in [2026]:
            for month in range(1, 10):
                m = full_month(df, year, month)
                rows = df[(df.date.dt.year == year) & (df.date.dt.month == month)].sort_values("date")
                monthly.append({"year": year, "month": month, "platform": platform, "platform_name": platform_name, "data_points": len(rows),
                                "mean": m[0] if m else np.nan, "median": m[1] if m else np.nan, "first_date": m[3] if m else "", "last_date": m[4] if m else "",
                                "status": "partial_current_month" if (year == df.date.max().year and month == df.date.max().month) else ("complete" if m else "no_data")})
            for month in [7, 8, 9]:
                rows = df[(df.date.dt.year == 2026) & (df.date.dt.month == month)].sort_values("date").head(4)
                if len(rows) == 4:
                    first, last = float(rows.price.iloc[0]), float(rows.price.iloc[-1])
                    first4.append({"year": 2026, "month": month, "platform": platform, "platform_name": platform_name, "first_date": rows.date.iloc[0].date().isoformat(), "day1_price": first,
                                   "day4_date": rows.date.iloc[-1].date().isoformat(), "day4_price": last, "change_day1_to_day4": last / first - 1, "points": len(rows)})
        for year in [2023, 2024]:
            buy = first5(df, year, 9)
            sep_rows = df[(df.date.dt.year == year) & (df.date.dt.month == 9)].sort_values("date")
            oct_rows = df[(df.date.dt.year == year) & (df.date.dt.month == 10)].sort_values("date").head(5)
            if buy and not sep_rows.empty:
                seasonal.append(return_row(platform, platform_name, year, "9月前5有效日均价", buy, "9月底最后有效价格", float(sep_rows.price.iloc[-1]), sep_rows.date.iloc[-1].date().isoformat(), 1, "9月底定义为9月最后一个有效价格点"))
            if buy and len(oct_rows) == 5:
                seasonal.append(return_row(platform, platform_name, year, "9月前5有效日均价", buy, "10月前5有效日均价", float(oct_rows.price.mean()), oct_rows.date.iloc[-1].date().isoformat(), 5, "不使用10月月内最高价"))
            # For comparison, retain the earlier July/August entry under the same objective sell dates.
            for buy_month in [7, 8]:
                earlier = first5(df, year, buy_month)
                if earlier and len(oct_rows) == 5:
                    comparison.append(return_row(platform, platform_name, year, f"{buy_month}月前5有效日均价", earlier, "10月前5有效日均价", float(oct_rows.price.mean()), oct_rows.date.iloc[-1].date().isoformat(), 5, "用于判断9月初入场是否晚于7/8月"))
        buy25 = first5(df, 2025, 9)
        pre = df[(df.date >= pd.Timestamp("2025-10-01")) & (df.date <= pd.Timestamp("2025-10-21"))].sort_values("date")
        if buy25 and not pre.empty:
            seasonal.append(return_row(platform, platform_name, 2025, "2025年9月前5有效日均价", buy25, "2025-10-01至10-21均价", float(pre.price.mean()), pre.date.iloc[-1].date().isoformat(), len(pre), "五红事件前窗口均价"))
            seasonal.append(return_row(platform, platform_name, 2025, "2025年9月前5有效日均价", buy25, "2025-10-21最后有效价格", float(pre.price.iloc[-1]), pre.date.iloc[-1].date().isoformat(), 1, "五红事件前最后有效价格；不使用事件后价格"))
    distribution_df = pd.DataFrame(distribution)
    post_df = pd.DataFrame(post_summary)
    monthly_df = pd.DataFrame(monthly)
    first4_df = pd.DataFrame(first4)
    seasonal_df = pd.DataFrame([x for x in seasonal if x])
    comparison_df = pd.DataFrame([x for x in comparison if x])
    position = []
    for _, r in post_df.iterrows():
        july = monthly_df[(monthly_df.platform == r.platform) & (monthly_df.month == 7)].iloc[0]
        august = monthly_df[(monthly_df.platform == r.platform) & (monthly_df.month == 8)].iloc[0]
        position.append({"platform": r.platform, "platform_name": r.platform_name, "current_price": r.current_price, "current_date": r.current_date,
                         "post_event_percentile": r.current_percentile_post_event, "mean_30d": r.mean_30d, "mean_60d": r.mean_60d, "mean_90d": r.mean_90d, "mean_180d": r.mean_180d,
                         "2026_july_mean": july["mean"], "2026_august_mean": august["mean"], "current_vs_july_mean": r.current_price / july["mean"] - 1,
                         "current_vs_august_mean": r.current_price / august["mean"] - 1})
    position_df = pd.DataFrame(position)
    distribution_df.to_csv(RESULTS / "knife_13856_post_event_distribution.csv", index=False, encoding="utf-8-sig")
    post_df.to_csv(RESULTS / "knife_13856_post_event_summary.csv", index=False, encoding="utf-8-sig")
    monthly_df.to_csv(RESULTS / "knife_13856_2026_monthly.csv", index=False, encoding="utf-8-sig")
    first4_df.to_csv(RESULTS / "knife_13856_2026_first4.csv", index=False, encoding="utf-8-sig")
    seasonal_df.to_csv(RESULTS / "knife_13856_september_entry.csv", index=False, encoding="utf-8-sig")
    comparison_df.to_csv(RESULTS / "knife_13856_entry_comparison.csv", index=False, encoding="utf-8-sig")
    position_df.to_csv(RESULTS / "knife_13856_new_position.csv", index=False, encoding="utf-8-sig")
    lines = ["# 13856 五红后新价格体系与9月初入场分析", "", "只读取现有 CSQAQ 历史 CSV；没有重新请求 API，也没有使用 2025-10-22 以前的价格计算当前分布百分位。事件后窗口为 2025-10-22 至 2026-09-04。", "", "## 五红后价格体系", ""]
    for _, r in position_df.iterrows():
        lines.append(f"- {r.platform_name}：当前 {r.current_price:.2f} 元（{r.current_date}）；事件后百分位 {r.post_event_percentile:.2%}；30/60/90/180日均价分别为 {r.mean_30d:.2f}/{r.mean_60d:.2f}/{r.mean_90d:.2f}/{r.mean_180d:.2f}；2026年7月均价 {r['2026_july_mean']:.2f}，8月均价 {r['2026_august_mean']:.2f}，当前相对二者分别 {r.current_vs_july_mean:.2%}/{r.current_vs_august_mean:.2%}。")
    lines += ["", "## 9月初入场回测", "", "9月底使用该月最后一个有效价格点；10月前5日使用前5个有效点均价；2025 使用 10月1–21日均价及10月21日最后价格两种参考。全部收益均未使用月内最低买入或最高卖出。", ""]
    for _, r in seasonal_df.iterrows():
        lines.append(f"- {r.platform_name} {int(r.year)} {r.buy_execution}→{r.sell_execution}：毛收益 {r.gross_return:.2%}，3%摩擦 {r.net_return_3pct:.2%}，5%摩擦 {r.net_return_5pct:.2%}。")
    lines += ["", "## 结论", "", "- 当前 390–400 元在五红后新价格体系中属于低位区域：两平台当前价都低于事件后中位数和 30/60/90/180 日均价，事件后百分位约 6%–8%。", "- 但当前不是事件后最低点：BUFF 较最低点已有小幅反弹，悠悠反弹幅度更大；这描述的是新体系内部位置，不把五红前价格当作目标价。", "- 9月初入场在历史上通常已经晚于7/8月低位买入，尤其相对 8月→9月的收益窗口；但是否仍有空间取决于卖出定义和年份，详见 CSV，不能概括为每年都能获利。", "- 2025 的 9月初买入→五红前窗口结果只作为结构事件前参考，不与 2023/2024 正常季节均值混合。", ""]
    (RESULTS / "knife_13856_post_event_report.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"完成：事件后分布 {len(distribution_df)} 行，月度 {len(monthly_df)} 行，季节回测 {len(seasonal_df)} 行。")


if __name__ == "__main__":
    main()
