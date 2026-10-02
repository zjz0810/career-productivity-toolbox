from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RAW = DATA / "raw" / "knives"
RESULTS = ROOT / "results"
EVENT = pd.Timestamp("2025-10-22")
PLATFORMS = {1: "BUFF", 2: "悠悠有品"}
BUY_MODES = ["7月前5个有效交易日", "7月全月均价", "8月前5个有效交易日", "8月全月均价"]
FRICTIONS = [0.0, 0.03, 0.05]


def load_history(good_id: int, platform: int) -> pd.DataFrame:
    folder = RAW / ("buff" if platform == 1 else "yyyp")
    files = sorted(folder.glob(f"{good_id}_*.csv"))
    if not files:
        return pd.DataFrame(columns=["date", "price"])
    df = pd.read_csv(files[0])
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    return df.dropna(subset=["date", "price"]).query("price > 0").sort_values("date").drop_duplicates("date").reset_index(drop=True)


def five_first(rows: pd.DataFrame):
    return None if len(rows) < 5 else (float(rows.head(5).price.mean()), rows.head(5).date.iloc[-1])


def five_last(rows: pd.DataFrame):
    return None if len(rows) < 5 else (float(rows.tail(5).price.mean()), rows.tail(5).date.iloc[0], rows.tail(5).date.iloc[-1])


def five_mid(rows: pd.DataFrame, target_day: int = 15):
    if len(rows) < 5:
        return None
    distances = (rows.date.dt.day - target_day).abs()
    center = int(distances.idxmin())
    pos = rows.index.get_loc(center)
    start = max(0, min(pos - 2, len(rows) - 5))
    chosen = rows.iloc[start:start + 5]
    return float(chosen.price.mean()), chosen.date.iloc[0], chosen.date.iloc[-1]


def month_rows(df: pd.DataFrame, year: int, month: int, before_event: bool = False):
    rows = df[(df.date.dt.year == year) & (df.date.dt.month == month)].sort_values("date")
    if before_event:
        rows = rows[rows.date < EVENT]
    return rows


def buy_price(df: pd.DataFrame, year: int, month: int, mode: str):
    rows = month_rows(df, year, month)
    if "前5" in mode:
        result = five_first(rows)
    else:
        # July/August are complete historical months for all target years.
        result = (float(rows.price.mean()), rows.date.iloc[0], rows.date.iloc[-1]) if not rows.empty else None
    if result is None:
        return None
    return {"price": result[0], "start": result[1], "end": result[1] if len(result) == 2 else result[2]}


def sell_price(df: pd.DataFrame, year: int, month: int, node: str):
    if node == "pre_tradeup_last5":
        rows = month_rows(df, year, 10, before_event=True)
        result = five_last(rows)
    else:
        rows = month_rows(df, year, month)
        if node.endswith("前5个有效交易日"):
            result = five_first(rows)
        elif node.endswith("中旬"):
            result = five_mid(rows)
        elif node.endswith("最后5个有效交易日"):
            result = five_last(rows)
        else:
            raise ValueError(node)
    if result is None:
        return None
    if len(result) == 2:
        return {"price": result[0], "start": result[1], "end": result[1]}
    return {"price": result[0], "start": result[1], "end": result[2]}


SELL_NODES = [
    (9, "9月前5个有效交易日"), (9, "9月中旬"), (9, "9月最后5个有效交易日"),
    (10, "10月前5个有效交易日"), (10, "10月中旬"), (10, "10月最后5个有效交易日"),
    (11, "11月前5个有效交易日"), (11, "11月中旬"), (11, "11月最后5个有效交易日"),
]


def main():
    candidates = pd.read_csv(DATA / "knife_candidates_expanded.csv", encoding="utf-8-sig")
    candidates["good_id"] = pd.to_numeric(candidates["good_id"], errors="coerce").astype(int)
    rows = []
    for platform, platform_name in PLATFORMS.items():
        for _, item in candidates.iterrows():
            df = load_history(int(item.good_id), platform)
            for year in [2023, 2024, 2025]:
                buy_month = 7
                for buy_mode in BUY_MODES:
                    if buy_mode.startswith("8月"):
                        buy_month = 8
                    buy = buy_price(df, year, buy_month, buy_mode)
                    if buy is None:
                        continue
                    node_specs = SELL_NODES.copy()
                    if year == 2025:
                        node_specs = [(month, node) for month, node in node_specs if month <= 10 and node in {"9月前5个有效交易日", "9月中旬", "9月最后5个有效交易日", "10月前5个有效交易日", "10月中旬"}]
                        node_specs.append((10, "pre_tradeup_last5"))
                    for month, node in node_specs:
                        sell = sell_price(df, year, month, node)
                        if sell is None or sell["price"] <= 0:
                            continue
                        rows.append({
                            "good_id": int(item.good_id), "中文名": item["中文名"], "英文名": item["英文名"],
                            "platform": platform, "platform_name": platform_name, "year": year,
                            "buy_mode": buy_mode, "buy_month": buy_month, "sell_month": month,
                            "sell_node": node, "buy_price": buy["price"], "sell_price": sell["price"],
                            "gross_return": sell["price"] / buy["price"] - 1,
                            "buy_start": buy["start"].date().isoformat(), "buy_end": buy["end"].date().isoformat(),
                            "sell_start": sell["start"].date().isoformat(), "sell_end": sell["end"].date().isoformat(),
                            "event_scope": "pre_tradeup_only" if year == 2025 else "normal_season",
                        })
    trades = pd.DataFrame(rows)

    # Add the price movement from the immediately preceding exit node for the same item/year/buy mode.
    trades["incremental_gross_return"] = np.nan
    order = {name: i for i, (_, name) in enumerate(SELL_NODES)}
    order["pre_tradeup_last5"] = 4.5
    for keys, group in trades.groupby(["good_id", "platform", "year", "buy_mode"], dropna=False):
        group = group.copy()
        group["node_order"] = group.sell_node.map(order)
        group = group.sort_values("node_order")
        prior = None
        for idx, r in group.iterrows():
            if prior is not None:
                trades.loc[idx, "incremental_gross_return"] = r.sell_price / prior - 1
            prior = r.sell_price

    trades.to_csv(RESULTS / "knife_autumn_exit_node_trades.csv", index=False, encoding="utf-8-sig")

    # Summary keeps each year visible and does not rank different year counts together.
    summary_rows = []
    group_keys = ["platform", "platform_name", "buy_mode", "sell_month", "sell_node"]
    for key, group in trades.groupby(group_keys, dropna=False):
        row = dict(zip(group_keys, key))
        row["window_scope"] = "three_year_common" if row["sell_node"] in {"9月前5个有效交易日", "9月中旬", "9月最后5个有效交易日", "10月前5个有效交易日", "10月中旬", "pre_tradeup_last5"} else "full_2023_2024"
        scope_years = [2023, 2024, 2025] if row["window_scope"] == "three_year_common" else [2023, 2024]
        scope_values = group.loc[group.year.isin(scope_years), "gross_return"].dropna()
        row["n_scope"] = len(scope_values)
        row["avg_scope"] = scope_values.mean() if len(scope_values) else np.nan
        row["median_scope"] = scope_values.median() if len(scope_values) else np.nan
        row["win_rate_scope"] = (scope_values > 0).mean() if len(scope_values) else np.nan
        row["n_observations"] = len(group)
        for year in [2023, 2024, 2025]:
            values = group.loc[group.year == year, "gross_return"]
            row[f"n_{year}"] = len(values)
            row[f"avg_{year}"] = values.mean() if len(values) else np.nan
            row[f"median_{year}"] = values.median() if len(values) else np.nan
            row[f"win_rate_{year}"] = (values > 0).mean() if len(values) else np.nan
        values = group.gross_return.dropna()
        row["avg_return"] = values.mean() if len(values) else np.nan
        row["median_return"] = values.median() if len(values) else np.nan
        row["win_rate"] = (values > 0).mean() if len(values) else np.nan
        inc = group.incremental_gross_return.dropna()
        row["incremental_avg"] = inc.mean() if len(inc) else np.nan
        row["incremental_median"] = inc.median() if len(inc) else np.nan
        row["incremental_win_rate"] = (inc > 0).mean() if len(inc) else np.nan
        for friction in FRICTIONS:
            net = (1 + values) * (1 - friction) - 1
            row[f"avg_after_{int(friction * 100)}pct"] = net.mean() if len(net) else np.nan
            row[f"median_after_{int(friction * 100)}pct"] = np.median(net) if len(net) else np.nan
            row[f"win_rate_after_{int(friction * 100)}pct"] = (net > 0).mean() if len(net) else np.nan
            scoped_net = (1 + scope_values) * (1 - friction) - 1
            row[f"avg_scope_after_{int(friction * 100)}pct"] = scoped_net.mean() if len(scoped_net) else np.nan
            row[f"median_scope_after_{int(friction * 100)}pct"] = np.median(scoped_net) if len(scoped_net) else np.nan
            row[f"win_rate_scope_after_{int(friction * 100)}pct"] = (scoped_net > 0).mean() if len(scoped_net) else np.nan
        summary_rows.append(row)
    summary = pd.DataFrame(summary_rows)
    summary.to_csv(RESULTS / "knife_autumn_exit_node_summary.csv", index=False, encoding="utf-8-sig")
    summary[summary["window_scope"] == "three_year_common"].to_csv(RESULTS / "knife_autumn_exit_node_common3_summary.csv", index=False, encoding="utf-8-sig")
    summary[summary["window_scope"] == "full_2023_2024"].to_csv(RESULTS / "knife_autumn_exit_node_full2_summary.csv", index=False, encoding="utf-8-sig")

    lines = [
        "# 7/8月买入后的秋季退出节点比较", "",
        "本报告只读取扩充75刀的本地 CSQAQ 历史 CSV，未请求 API、未修改原始数据。2023/2024使用9—11月全部节点；2025只使用2025-10-22之前的节点，`pre_tradeup_last5` 仅作事件前位置参考，不代表事先可知策略。",
        "", "## 固定执行定义", "",
        "买入：7月或8月前5个有效交易日均价，或对应月份全月均价。卖出：月初前5个有效日、月中以15日附近连续5个有效日、月末后5个有效日。增量收益为同一标的/年份/买入方式从前一退出节点卖价到当前节点卖价的价格变化。",
        "", "## 8月买入重点观察", "",
    ]
    focus = summary[summary.buy_mode.isin(["8月前5个有效交易日", "8月全月均价"]) & summary.sell_node.isin(["9月前5个有效交易日", "9月中旬", "9月最后5个有效交易日", "10月前5个有效交易日", "10月中旬", "pre_tradeup_last5"])].copy()
    for platform, platform_name in PLATFORMS.items():
        lines.append(f"### {platform_name}")
        q = focus[focus.platform == platform].sort_values(["buy_mode", "sell_month", "sell_node"])
        for _, r in q.iterrows():
            lines.append(f"- {r.buy_mode} → {r.sell_node}：2023 {r.avg_2023:.2%}（n={int(r.n_2023)}），2024 {r.avg_2024:.2%}（n={int(r.n_2024)}），2025 {r.avg_2025:.2%}（n={int(r.n_2025)}）；合并平均 {r.avg_return:.2%}；3%后 {r.avg_after_3pct:.2%}；5%后 {r.avg_after_5pct:.2%}；前节点增量平均 {r.incremental_avg:.2%}。")
    lines += ["", "## 2023/2024完整秋季窗口", ""]
    full_focus = summary[(summary["window_scope"] == "full_2023_2024") & summary.buy_mode.isin(["7月前5个有效交易日", "7月全月均价", "8月前5个有效交易日", "8月全月均价"])].copy()
    for platform, platform_name in PLATFORMS.items():
        lines.append(f"### {platform_name}")
        q = full_focus[full_focus.platform == platform].sort_values(["buy_mode", "sell_month", "sell_node"])
        for _, r in q.iterrows():
            lines.append(f"- {r.buy_mode} → {r.sell_node}：2023 {r.avg_2023:.2%}，2024 {r.avg_2024:.2%}；两年平均 {r.avg_scope:.2%}；3%后 {r.avg_scope_after_3pct:.2%}；5%后 {r.avg_scope_after_5pct:.2%}；前节点增量平均 {r.incremental_avg:.2%}。")
    lines += ["", "## 解释边界", "", "三年共同窗口和2023/2024完整秋季窗口已分开保存和阅读；不能把2025事件前节点与11月节点直接做三年排名。所有缺失日期均留空。", "", "本报告不构成买入推荐。"]
    (RESULTS / "knife_autumn_exit_node_report.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"完成：交易明细 {len(trades)} 行，节点汇总 {len(summary)} 行。")


if __name__ == "__main__":
    main()
