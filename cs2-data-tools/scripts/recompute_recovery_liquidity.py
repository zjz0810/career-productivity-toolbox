"""Recompute recovery-space rankings with verified two-platform liquidity.

Inputs are existing price-history-derived metrics plus the fresh current rank
snapshot. Raw history files are read only; no chart/API request is made here.
"""
from __future__ import annotations

import csv
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DETAIL_OLD = ROOT / "results" / "knife_recovery_space_detail.csv"
INVENTORY = ROOT / "data" / "knife_current_inventory_rechecked.csv"
DETAIL_NEW = ROOT / "results" / "knife_recovery_space_liquidity_rechecked.csv"
RANK_MEAN = ROOT / "results" / "knife_recovery_rank_c_aug_mean_liquidity.csv"
RANK_LAST5 = ROOT / "results" / "knife_recovery_rank_c_aug_last5_liquidity.csv"
FOCUS = ROOT / "results" / "knife_recovery_focus_candidates_liquidity.csv"
DUAL = ROOT / "results" / "knife_recovery_dual_platform_confirmed_liquidity.csv"
REPORT = ROOT / "results" / "knife_recovery_liquidity_recheck_report.md"
MAIN_DETAIL = ROOT / "results" / "knife_recovery_space_detail.csv"
MAIN_RANK_MEAN = ROOT / "results" / "knife_recovery_rank_c_aug_recovery.csv"
MAIN_FOCUS = ROOT / "results" / "knife_recovery_focus_candidates.csv"
MAIN_DUAL = ROOT / "results" / "knife_recovery_dual_platform_confirmed.csv"
MAIN_REPORT = ROOT / "results" / "knife_recovery_space_report.md"


def pct(value: object) -> str:
    return "NA" if pd.isna(value) else f"{float(value):.2%}"


def money(value: object) -> str:
    return "NA" if pd.isna(value) else f"{float(value):.2f}"


def write_csv(frame: pd.DataFrame, path: Path) -> None:
    frame.to_csv(path, index=False, encoding="utf-8-sig")


def main() -> None:
    old = pd.read_csv(DETAIL_OLD)
    inv = pd.read_csv(INVENTORY)
    if len(inv) != 75 or inv.good_id.nunique() != 75:
        raise RuntimeError(f"库存复核不是75个唯一标的: {len(inv)}")
    if inv.status.ne("success").any():
        raise RuntimeError("库存复核存在失败项，不使用不完整数据重算")

    inv = inv.set_index("good_id")
    rows = []
    for _, source in old.iterrows():
        good_id = int(source["good_id"])
        if good_id not in inv.index:
            raise RuntimeError(f"缺少good_id={good_id}的库存复核")
        current = inv.loc[good_id]
        platform_num = int(source["platform"])
        if platform_num == 1:
            current_price = float(current["BUFF当前最低售价"])
        elif platform_num == 2:
            current_price = float(current["悠悠当前最低售价"])
        else:
            raise RuntimeError(f"未知平台: {source['platform']}")

        # Current-dependent metrics are recalculated against the new rank quote;
        # all distribution values still come from the existing raw history.
        low = float(source["historical_low"])
        aug_mean = float(source["aug_mean"])
        aug_median = float(source["aug_median"])
        aug_last5 = float(source["aug_last5"])
        rec_mean = aug_mean / current_price - 1
        rec_median = aug_median / current_price - 1
        rec_last5 = aug_last5 / current_price - 1
        record = source.to_dict()
        record.update(
            {
                "current_date": str(current["snapshot_time"])[:10],
                "current_price": current_price,
                "historical_low": low,
                "distance_to_historical_low": current_price / low - 1,
                "recover_to_aug_mean": rec_mean,
                "recover_to_aug_median": rec_median,
                "recover_to_aug_last5": rec_last5,
                "recover_to_aug_mean_after_3pct": (1 + rec_mean) * 0.97 - 1,
                "recover_to_aug_mean_after_5pct": (1 + rec_mean) * 0.95 - 1,
                "BUFF当前最低售价": float(current["BUFF当前最低售价"]),
                "BUFF当前在售数量": int(current["BUFF当前在售数量"]),
                "悠悠当前最低售价": float(current["悠悠当前最低售价"]),
                "悠悠当前在售数量": int(current["悠悠当前在售数量"]),
                "inventory_source": "/api/v1/info/get_rank_list",
            }
        )
        rows.append(record)

    detail = pd.DataFrame(rows)
    detail["both_platform_inventory_ge_60"] = (
        (detail["BUFF当前在售数量"] >= 60) & (detail["悠悠当前在售数量"] >= 60)
    )
    # Any known platform below 60 removes the underlying knife from every
    # recovery recommendation ranking, including the other platform's row.
    liquid = detail[detail["both_platform_inventory_ge_60"]].copy()
    write_csv(detail, DETAIL_NEW)
    write_csv(detail, MAIN_DETAIL)

    rank_mean = liquid.sort_values(["平台", "recover_to_aug_mean"], ascending=[True, False]).reset_index(drop=True)
    rank_last5 = liquid.sort_values(["平台", "recover_to_aug_last5"], ascending=[True, False]).reset_index(drop=True)
    write_csv(rank_mean, RANK_MEAN)
    write_csv(rank_last5, RANK_LAST5)
    write_csv(rank_mean, MAIN_RANK_MEAN)

    focus = liquid[
        (liquid["current_price"] <= 1500)
        & (liquid["post_tradeup_percentile"] <= 0.20)
        & (liquid["recover_to_aug_mean"] > 0.05)
    ].copy()
    focus = focus.sort_values(["平台", "recover_to_aug_mean"], ascending=[True, False]).reset_index(drop=True)
    write_csv(focus, FOCUS)
    write_csv(focus, MAIN_FOCUS)

    by_id = liquid.pivot(index="good_id", columns="平台", values=[
        "中文名", "英文名", "BUFF当前在售数量", "悠悠当前在售数量", "current_price",
        "post_tradeup_percentile", "recover_to_aug_mean", "aug_mean", "aug_last5",
        "historical_percentile", "distance_to_historical_low",
    ])
    # Pivot columns are multi-indexed with metric first, platform second.
    confirmed = by_id.copy()
    buff = "BUFF"
    yyyp = "悠悠有品"
    required_cols = [("post_tradeup_percentile", buff), ("post_tradeup_percentile", yyyp),
                     ("recover_to_aug_mean", buff), ("recover_to_aug_mean", yyyp)]
    confirmed = confirmed.dropna(subset=required_cols)
    confirmed = confirmed[
        (confirmed[("post_tradeup_percentile", buff)] <= 0.20)
        & (confirmed[("post_tradeup_percentile", yyyp)] <= 0.20)
        & (confirmed[("recover_to_aug_mean", buff)] > 0)
        & (confirmed[("recover_to_aug_mean", yyyp)] > 0)
    ].copy()
    confirmed["dual_recover_to_aug_mean"] = (
        confirmed[("recover_to_aug_mean", buff)] + confirmed[("recover_to_aug_mean", yyyp)]
    ) / 2
    confirmed["dual_post_tradeup_percentile_max"] = confirmed[
        [("post_tradeup_percentile", buff), ("post_tradeup_percentile", yyyp)]
    ].max(axis=1)
    confirmed = confirmed.sort_values("dual_recover_to_aug_mean", ascending=False)
    flat = pd.DataFrame(index=confirmed.index)
    flat["good_id"] = confirmed.index
    flat["中文名"] = confirmed[("中文名", buff)]
    flat["英文名"] = confirmed[("英文名", buff)]
    for metric in ["BUFF当前在售数量", "悠悠当前在售数量", "current_price", "post_tradeup_percentile",
                   "recover_to_aug_mean", "aug_mean", "aug_last5", "historical_percentile",
                   "distance_to_historical_low"]:
        flat[f"{metric}_BUFF"] = confirmed[(metric, buff)]
        flat[f"{metric}_悠悠有品"] = confirmed[(metric, yyyp)]
    flat["dual_recover_to_aug_mean"] = confirmed["dual_recover_to_aug_mean"]
    flat["dual_post_tradeup_percentile_max"] = confirmed["dual_post_tradeup_percentile_max"]
    write_csv(flat.reset_index(drop=True), DUAL)
    write_csv(flat.reset_index(drop=True), MAIN_DUAL)

    buff_liquid_count = detail.loc[detail["BUFF当前在售数量"] >= 60, "good_id"].nunique()
    yyyp_liquid_count = detail.loc[detail["悠悠当前在售数量"] >= 60, "good_id"].nunique()

    report = []
    report += [
        "# 75把刀流动性复核与修复空间榜单",
        "",
        "本次只重新读取 CSQAQ 当前排行榜接口，不请求历史价格图表；原始历史 CSV 未修改。",
        "当前字段来源为 `/api/v1/info/get_rank_list`：`buff_sell_num`/`yyyp_sell_num` 是对应平台在售价列表数量；`buff_buy_num`/`yyyp_buy_num` 是求购量，`statistic` 与 Steam 数量也不作为平台在售量。",
        "当前最低售价和在售数量快照时间：" + str(inv["snapshot_time"].iloc[0]),
        "",
        "## 样本数量",
        "",
        f"- 75把全部完成当前复核；BUFF在售≥60：{buff_liquid_count}把。",
        f"- 悠悠在售≥60：{yyyp_liquid_count}把。",
        f"- 双平台同时在售≥60：{len(liquid) // 2}把（用于所有恢复空间推荐排序）。",
        f"- 双平台低位且恢复空间均为正：{len(flat)}把。",
        f"- 重点候选（双平台≥60、价格≤1500、五红后≤20百分位、8月均价空间>5%）：{len(focus)}条平台记录。",
        "",
        "## 重要剔除",
        "",
        "任一已知平台在售量低于60的刀，均从重点候选、双平台确认和恢复空间推荐排序剔除。暗影双匕｜都市伪装（略有磨损）复核为 BUFF 5、悠悠 19，因此不再进入这些榜单。",
        "",
    ]
    for platform in ["BUFF", "悠悠有品"]:
        report += [f"## {platform}：8月均价空间前20", ""]
        top = rank_mean[rank_mean["平台"] == platform].head(20)
        for _, r in top.iterrows():
            report.append(
                f"- {r['中文名']}：当前{money(r['current_price'])}，8月均价{money(r['aug_mean'])}，"
                f"空间{pct(r['recover_to_aug_mean'])}，5%摩擦后{pct(r['recover_to_aug_mean_after_5pct'])}；"
                f"BUFF在售{int(r['BUFF当前在售数量'])}，悠悠在售{int(r['悠悠当前在售数量'])}。"
            )
        report += ["", f"## {platform}：8月底最后5日均价空间前20", ""]
        top = rank_last5[rank_last5["平台"] == platform].head(20)
        for _, r in top.iterrows():
            report.append(
                f"- {r['中文名']}：当前{money(r['current_price'])}，8月底最后5日均价{money(r['aug_last5'])}，"
                f"空间{pct(r['recover_to_aug_last5'])}；BUFF在售{int(r['BUFF当前在售数量'])}，悠悠在售{int(r['悠悠当前在售数量'])}。"
            )
        positive = rank_mean[(rank_mean["平台"] == platform) & (rank_mean["recover_to_aug_mean_after_5pct"] > 0)]
        report += ["", f"### {platform}：扣5%摩擦后仍为正", ""]
        for _, r in positive.iterrows():
            report.append(f"- {r['中文名']}：{pct(r['recover_to_aug_mean_after_5pct'])}；BUFF在售{int(r['BUFF当前在售数量'])}，悠悠在售{int(r['悠悠当前在售数量'])}。")
        report += [""]
    report += ["## 双平台确认榜前20", ""]
    for _, r in flat.head(20).iterrows():
        report.append(
            f"- {r['中文名']}：平均空间{pct(r['dual_recover_to_aug_mean'])}；"
            f"BUFF当前{money(r['current_price_BUFF'])}、在售{int(r['BUFF当前在售数量_BUFF'])}、五红后百分位{pct(r['post_tradeup_percentile_BUFF'])}；"
            f"悠悠当前{money(r['current_price_悠悠有品'])}、在售{int(r['悠悠当前在售数量_悠悠有品'])}、五红后百分位{pct(r['post_tradeup_percentile_悠悠有品'])}。"
        )
    report += ["", "以上‘恢复空间’均为恢复至2026年8月价格的情景计算，不是预测，也不构成买入推荐。", ""]
    report_text = "\n".join(report)
    REPORT.write_text(report_text, encoding="utf-8")
    MAIN_REPORT.write_text(report_text, encoding="utf-8")
    print(f"DONE detail={len(detail)} liquid_platform_rows={len(liquid)} focus={len(focus)} dual={len(flat)}")


if __name__ == "__main__":
    main()
