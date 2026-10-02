"""Analyze current sell-listing counts relative to each knife's own history."""
from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "data" / "knife_current_inventory_rechecked.csv"
PRICE_DETAIL = ROOT / "results" / "knife_recovery_space_detail.csv"
SELL_NUM_ROOT = ROOT / "data" / "raw" / "knives"
POSITION_OUT = ROOT / "results" / "knife_sell_num_position.csv"
CANDIDATE_OUT = ROOT / "results" / "knife_price_inventory_low_rank.csv"
REPORT_OUT = ROOT / "results" / "knife_price_inventory_low_report.md"
ASOF = pd.Timestamp("2026-09-05")
EVENT = pd.Timestamp("2025-10-22")


def find_history(good_id: int, platform: int) -> Path:
    folder = "buff_sell_num" if platform == 1 else "yyyp_sell_num"
    files = sorted((SELL_NUM_ROOT / folder).glob(f"{good_id}_*.csv"))
    if len(files) != 1:
        raise RuntimeError(f"good_id={good_id} platform={platform} sell_num文件数={len(files)}")
    return files[0]


def empirical_percentile(values: pd.Series, current: float) -> float:
    clean = pd.to_numeric(values, errors="coerce").dropna()
    return float((clean <= current).mean()) if len(clean) else np.nan


def pct(x: object) -> str:
    return "NA" if pd.isna(x) else f"{float(x):.2%}"


def money(x: object) -> str:
    return "NA" if pd.isna(x) else f"{float(x):.2f}"


def main() -> None:
    inventory = pd.read_csv(INVENTORY)
    inventory["good_id"] = inventory["good_id"].astype(int)
    inventory = inventory[
        (inventory["BUFF当前在售数量"] >= 60) & (inventory["悠悠当前在售数量"] >= 60)
    ].copy()
    if len(inventory) != 48:
        raise RuntimeError(f"双平台当前在售≥60的标的不是48把: {len(inventory)}")

    price = pd.read_csv(PRICE_DETAIL)
    price["good_id"] = price["good_id"].astype(int)
    price["platform"] = price["platform"].astype(int)
    price = price.set_index(["good_id", "platform"])

    rows = []
    for item in inventory.to_dict("records"):
        good_id = int(item["good_id"])
        for platform, platform_name in [(1, "BUFF"), (2, "悠悠有品")]:
            history_file = find_history(good_id, platform)
            hist = pd.read_csv(history_file, parse_dates=["date"])
            hist["sell_num"] = pd.to_numeric(hist["sell_num"], errors="coerce")
            hist = hist.dropna(subset=["date", "sell_num"]).sort_values("date")
            if hist.empty:
                raise RuntimeError(f"good_id={good_id} platform={platform}无有效sell_num历史")
            one_year = hist[(hist["date"] >= ASOF - pd.Timedelta(days=365)) & (hist["date"] <= ASOF)]
            post = hist[(hist["date"] >= EVENT) & (hist["date"] <= ASOF)]
            current_sell = float(item["BUFF当前在售数量"] if platform == 1 else item["悠悠当前在售数量"])
            p = price.loc[(good_id, platform)]
            median_1y = float(one_year["sell_num"].median()) if not one_year.empty else np.nan
            current_price = float(p["current_price"])
            rows.append({
                "good_id": good_id,
                "中文名": item["中文名"],
                "英文名": item["英文名"],
                "平台": platform_name,
                "platform": platform,
                "current_date": str(item["snapshot_time"])[:10],
                "current_price": current_price,
                "current_sell_num": current_sell,
                "current_price_post_tradeup_percentile": float(p["post_tradeup_percentile"]),
                "current_price_1y_percentile": float(p["historical_percentile"]),
                "sell_num_1y_percentile": empirical_percentile(one_year["sell_num"], current_sell),
                "sell_num_post_tradeup_percentile": empirical_percentile(post["sell_num"], current_sell),
                "sell_num_1y_median": median_1y,
                "sell_num_1y_min": float(one_year["sell_num"].min()) if not one_year.empty else np.nan,
                "sell_num_1y_max": float(one_year["sell_num"].max()) if not one_year.empty else np.nan,
                "sell_num_post_tradeup_median": float(post["sell_num"].median()) if not post.empty else np.nan,
                "sell_num_post_tradeup_min": float(post["sell_num"].min()) if not post.empty else np.nan,
                "sell_num_post_tradeup_max": float(post["sell_num"].max()) if not post.empty else np.nan,
                "current_sell_num_vs_1y_median": current_sell / median_1y - 1 if median_1y > 0 else np.nan,
                "current_sell_num_vs_post_median": current_sell / float(post["sell_num"].median()) - 1 if not post.empty and post["sell_num"].median() > 0 else np.nan,
                "aug_last5_recovery_space": float(p["recover_to_aug_last5"]),
                "aug_last5": float(p["aug_last5"]),
                "history_points_sell_num": len(hist),
                "one_year_points_sell_num": len(one_year),
                "post_tradeup_points_sell_num": len(post),
                "BUFF当前在售数量": int(item["BUFF当前在售数量"]),
                "悠悠当前在售数量": int(item["悠悠当前在售数量"]),
                "source": "/api/v1/info/chart key=sell_num",
            })

    position = pd.DataFrame(rows)
    position["current_price_low_post20"] = position["current_price_post_tradeup_percentile"] <= 0.20
    position["current_sell_num_low_post20"] = position["sell_num_post_tradeup_percentile"] <= 0.20
    position["liquidity_both_ge_60"] = True
    position["recovery_positive"] = position["aug_last5_recovery_space"] > 0
    position["row_candidate"] = (
        position["current_price_low_post20"]
        & position["current_sell_num_low_post20"]
        & position["recovery_positive"]
    )
    position = position.sort_values(["平台", "current_price_post_tradeup_percentile", "sell_num_post_tradeup_percentile"])
    position.to_csv(POSITION_OUT, index=False, encoding="utf-8-sig")

    # Wide table requires both platforms to pass independently, so a single
    # platform's anomalously low stock cannot enter the final list.
    rows_wide = []
    for good_id, group in position.groupby("good_id", sort=False):
        if set(group["平台"]) != {"BUFF", "悠悠有品"}:
            continue
        b = group[group["平台"] == "BUFF"].iloc[0]
        y = group[group["平台"] == "悠悠有品"].iloc[0]
        if not (bool(b["row_candidate"]) and bool(y["row_candidate"])):
            continue
        rows_wide.append({
            "good_id": int(good_id),
            "中文名": b["中文名"],
            "英文名": b["英文名"],
            "BUFF当前最低售价": b["current_price"],
            "BUFF当前在售数量": b["current_sell_num"],
            "BUFF价格五红后百分位": b["current_price_post_tradeup_percentile"],
            "BUFF价格1年百分位": b["current_price_1y_percentile"],
            "BUFF在售五红后百分位": b["sell_num_post_tradeup_percentile"],
            "BUFF在售1年百分位": b["sell_num_1y_percentile"],
            "BUFF在售1年中位数": b["sell_num_1y_median"],
            "BUFF在售相对1年中位数变化": b["current_sell_num_vs_1y_median"],
            "BUFF恢复至8月底最后5日空间": b["aug_last5_recovery_space"],
            "悠悠当前最低售价": y["current_price"],
            "悠悠当前在售数量": y["current_sell_num"],
            "悠悠价格五红后百分位": y["current_price_post_tradeup_percentile"],
            "悠悠价格1年百分位": y["current_price_1y_percentile"],
            "悠悠在售五红后百分位": y["sell_num_post_tradeup_percentile"],
            "悠悠在售1年百分位": y["sell_num_1y_percentile"],
            "悠悠在售1年中位数": y["sell_num_1y_median"],
            "悠悠在售相对1年中位数变化": y["current_sell_num_vs_1y_median"],
            "悠悠恢复至8月底最后5日空间": y["aug_last5_recovery_space"],
            "两平台恢复空间平均": (b["aug_last5_recovery_space"] + y["aug_last5_recovery_space"]) / 2,
            "两平台价格五红后百分位最大值": max(b["current_price_post_tradeup_percentile"], y["current_price_post_tradeup_percentile"]),
            "两平台在售五红后百分位最大值": max(b["sell_num_post_tradeup_percentile"], y["sell_num_post_tradeup_percentile"]),
        })
    candidate = pd.DataFrame(rows_wide).sort_values("两平台恢复空间平均", ascending=False) if rows_wide else pd.DataFrame()
    candidate.to_csv(CANDIDATE_OUT, index=False, encoding="utf-8-sig")

    report = [
        "# 价格低位 + 自身在售低位诊断",
        "",
        "本次不重新请求价格历史；仅使用 CSQAQ `get_item_chart(key=sell_num, period=1095)` 获取在售数量历史，并读取已保存价格历史派生结果。原始价格 CSV 未修改。",
        "在售量百分位均相对于该刀该平台自身的经验分布计算，五红后窗口为 2025-10-22（含）至 2026-09-04；当前在售量来自当前排行榜快照 2026-09-05。",
        "筛选要求：两平台当前在售均≥60；两平台价格五红后百分位均≤20%；两平台在售量五红后百分位均≤20%；两平台恢复至8月底最后5个有效日均价空间均为正。",
        "",
        "## 数据可获得性",
        "",
        f"- 双平台当前在售≥60：48把；成功获取在售量历史：{len(position)}条平台序列；失败：0。",
        "- 接口返回 `timestamp` + `main_data`，其中 `main_data` 为 `sell_num` 时间序列；未将成交量、求购量或当前快照数量混入历史序列。",
        "",
        "## 价格低 + 在售低榜单",
        "",
    ]
    if candidate.empty:
        report.append("没有标的同时满足全部双平台条件。")
    else:
        report.append(f"共 {len(candidate)} 把；排序仅按两平台恢复空间平均值展示，不构造综合评分。")
        report += ["", "|箱子|BUFF价格/在售|BUFF价格百分位|BUFF在售百分位|BUFF修复空间|悠悠价格/在售|悠悠价格百分位|悠悠在售百分位|悠悠修复空间|", "|---|---:|---:|---:|---:|---:|---:|---:|---:|"]
        for _, r in candidate.iterrows():
            report.append(
                f"|{r['中文名']}|{money(r['BUFF当前最低售价'])}/{int(r['BUFF当前在售数量'])}|{pct(r['BUFF价格五红后百分位'])}|{pct(r['BUFF在售五红后百分位'])}|{pct(r['BUFF恢复至8月底最后5日空间'])}|"
                f"{money(r['悠悠当前最低售价'])}/{int(r['悠悠当前在售数量'])}|{pct(r['悠悠价格五红后百分位'])}|{pct(r['悠悠在售五红后百分位'])}|{pct(r['悠悠恢复至8月底最后5日空间'])}|"
            )
    report += ["", "## 排除逻辑", "", "价格低但在售量处于自身历史高位的标的保留在完整明细中，但不进入榜单；只有一个平台满足低库存的标的也不进入榜单。", "", "结果是描述性筛选，不构成买入推荐。", ""]
    REPORT_OUT.write_text("\n".join(report), encoding="utf-8")
    print(f"DONE position_rows={len(position)} candidates={len(candidate)}")


if __name__ == "__main__":
    main()
