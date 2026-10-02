from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RAW = DATA / "raw" / "knives"
RESULTS = ROOT / "results"
EVENT = pd.Timestamp("2025-10-22")
ASOF = pd.Timestamp("2026-09-04")
PLATFORMS = {1: "BUFF", 2: "悠悠有品"}


def load_history(good_id: int, platform: int) -> pd.DataFrame:
    folder = RAW / ("buff" if platform == 1 else "yyyp")
    files = sorted(folder.glob(f"{good_id}_*.csv"))
    if not files:
        return pd.DataFrame(columns=["date", "price"])
    df = pd.read_csv(files[0])
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    return df.dropna(subset=["date", "price"]).query("price > 0").sort_values("date").drop_duplicates("date").reset_index(drop=True)


def last5(rows: pd.DataFrame):
    return float(rows.tail(5)["price"].mean()) if len(rows) >= 5 else np.nan


def pctile(values: pd.Series, current: float):
    return float((values <= current).mean()) if len(values) else np.nan


def main():
    candidates = pd.read_csv(DATA / "knife_candidates_expanded.csv", encoding="utf-8-sig")
    candidates["good_id"] = pd.to_numeric(candidates["good_id"], errors="coerce").astype(int)
    candidates["BUFF在售数量"] = pd.to_numeric(candidates["BUFF在售数量"], errors="coerce")
    candidates["悠悠在售数量"] = pd.to_numeric(candidates["悠悠在售数量"], errors="coerce")
    rows = []
    for platform, platform_name in PLATFORMS.items():
        for _, item in candidates.iterrows():
            df = load_history(int(item.good_id), platform)
            df = df[df.date <= ASOF].copy()
            if df.empty:
                continue
            current = df.iloc[-1]
            post = df[df.date >= EVENT]
            aug = df[(df.date.dt.year == 2026) & (df.date.dt.month == 8)]
            sep = df[(df.date.dt.year == 2026) & (df.date.dt.month == 9) & (df.date <= ASOF)]
            low_idx = df.price.idxmin()
            low = df.loc[low_idx]
            post_low = post.price.min() if not post.empty else np.nan
            row = {
                "good_id": int(item.good_id), "中文名": item["中文名"], "英文名": item["英文名"],
                "平台": platform_name, "platform": platform,
                "current_date": current.date.date().isoformat(), "current_price": float(current.price),
                "historical_low": float(low.price), "historical_low_date": low.date.date().isoformat(),
                "distance_to_historical_low": float(current.price / low.price - 1),
                "historical_percentile": pctile(df.price, current.price),
                "post_tradeup_percentile": pctile(post.price, current.price),
                "post_tradeup_low": float(post_low) if pd.notna(post_low) else np.nan,
                "post_tradeup_points": int(len(post)), "history_points": int(len(df)),
                "aug_mean": float(aug.price.mean()) if not aug.empty else np.nan,
                "aug_median": float(aug.price.median()) if not aug.empty else np.nan,
                "aug_last5": last5(aug),
                "sep_to_04_mean": float(sep.price.mean()) if not sep.empty else np.nan,
                "recover_to_aug_mean": float(aug.price.mean() / current.price - 1) if not aug.empty else np.nan,
                "recover_to_aug_median": float(aug.price.median() / current.price - 1) if not aug.empty else np.nan,
                "recover_to_aug_last5": float(last5(aug) / current.price - 1) if len(aug) >= 5 else np.nan,
                "recover_to_aug_mean_after_3pct": float((1 + aug.price.mean() / current.price - 1) * 0.97 - 1) if not aug.empty else np.nan,
                "recover_to_aug_mean_after_5pct": float((1 + aug.price.mean() / current.price - 1) * 0.95 - 1) if not aug.empty else np.nan,
                "BUFF当前在售数量": item["BUFF在售数量"], "悠悠当前在售数量": item["悠悠在售数量"],
                "刀型": item.get("刀型", ""), "磨损": item.get("磨损", ""),
            }
            rows.append(row)
    detail = pd.DataFrame(rows)
    detail.to_csv(RESULTS / "knife_recovery_space_detail.csv", index=False, encoding="utf-8-sig")

    rank_a = detail.sort_values(["平台", "distance_to_historical_low", "good_id"])
    rank_b = detail.sort_values(["平台", "post_tradeup_percentile", "good_id"])
    rank_c = detail.sort_values(["平台", "recover_to_aug_mean"], ascending=[True, False])
    rank_a.to_csv(RESULTS / "knife_recovery_rank_a_historical_low.csv", index=False, encoding="utf-8-sig")
    rank_b.to_csv(RESULTS / "knife_recovery_rank_b_post_tradeup_low.csv", index=False, encoding="utf-8-sig")
    rank_c.to_csv(RESULTS / "knife_recovery_rank_c_aug_recovery.csv", index=False, encoding="utf-8-sig")

    focus = detail[(detail["current_price"] <= 1500) & (detail["BUFF当前在售数量"] >= 60)
                   & (detail["post_tradeup_percentile"] <= 0.20) & (detail["recover_to_aug_mean"] > 0.05)].copy()
    focus = focus.sort_values(["平台", "recover_to_aug_mean"], ascending=[True, False])
    focus.groupby("平台", group_keys=False).head(20).to_csv(RESULTS / "knife_recovery_focus_candidates.csv", index=False, encoding="utf-8-sig")

    piv = detail.pivot(index=["good_id", "中文名", "英文名", "BUFF当前在售数量", "悠悠当前在售数量"], columns="平台", values=["current_price", "post_tradeup_percentile", "recover_to_aug_mean", "aug_mean", "aug_last5", "historical_percentile", "distance_to_historical_low"])
    piv.columns = [f"{a}_{b}" for a, b in piv.columns]
    piv = piv.reset_index()
    required = ["post_tradeup_percentile_BUFF", "post_tradeup_percentile_悠悠有品", "recover_to_aug_mean_BUFF", "recover_to_aug_mean_悠悠有品"]
    dual = piv.dropna(subset=required).copy()
    dual = dual[(dual["post_tradeup_percentile_BUFF"] <= 0.20) & (dual["post_tradeup_percentile_悠悠有品"] <= 0.20)
                & (dual["recover_to_aug_mean_BUFF"] > 0) & (dual["recover_to_aug_mean_悠悠有品"] > 0)]
    dual["dual_recover_to_aug_mean"] = dual[["recover_to_aug_mean_BUFF", "recover_to_aug_mean_悠悠有品"]].mean(axis=1)
    dual["dual_post_tradeup_percentile_max"] = dual[["post_tradeup_percentile_BUFF", "post_tradeup_percentile_悠悠有品"]].max(axis=1)
    dual = dual.sort_values("dual_recover_to_aug_mean", ascending=False)
    dual.to_csv(RESULTS / "knife_recovery_dual_platform_confirmed.csv", index=False, encoding="utf-8-sig")

    lines = [
        "# 75刀情景修复空间诊断", "",
        "本报告只读取扩充75刀的本地 BUFF/悠悠历史 CSV及当前候选元数据；最新有效日期为2026-09-04。‘恢复到2026年8月价格’只是情景修复空间，不代表预测或必然发生。全部历史百分位与五红后百分位均为经验分布百分位。", "",
        "## 榜单口径", "",
        "A按当前价距离全部历史最低价排序；B按当前价在2025-10-22（含）之后分布中的百分位排序；C按恢复至2026年8月全月均价的理论涨幅排序。双平台榜要求两个平台均位于五红后最低20%，且两个平台恢复空间均为正。", "",
    ]
    for platform, name in PLATFORMS.items():
        q = detail[detail.platform == platform]
        lines.append(f"## {name}")
        near = q[q.distance_to_historical_low <= 0.03].sort_values("distance_to_historical_low")
        lines.append("### 当前距离全部历史最低价不超过3%")
        lines.append("；".join(f"{r['中文名']} 当前{r.current_price:.2f}、距低点{r.distance_to_historical_low:.2%}" for _, r in near.iterrows()) or "无")
        lines.append("### 五红后最低百分位前10")
        q2 = q.sort_values("post_tradeup_percentile").head(10)
        lines.append("；".join(f"{r['中文名']} {r.post_tradeup_percentile:.2%}" for _, r in q2.iterrows()))
        lines.append("### 恢复至8月均价空间前10")
        q3 = q.sort_values("recover_to_aug_mean", ascending=False).head(10)
        lines.append("；".join(f"{r['中文名']} {r.current_price:.2f}→{r.aug_mean:.2f}，空间{r.recover_to_aug_mean:.2%}，5%后{r.recover_to_aug_mean_after_5pct:.2%}" for _, r in q3.iterrows()))
        positive5 = q[q.recover_to_aug_mean_after_5pct > 0].sort_values("recover_to_aug_mean_after_5pct", ascending=False)
        lines.append("### 扣5%后仍为正的8月均价情景空间")
        lines.append("；".join(f"{r['中文名']} {r.recover_to_aug_mean_after_5pct:.2%}" for _, r in positive5.iterrows()) or "无")
        lines.append("")
    lines += ["## 双平台确认", ""]
    if dual.empty:
        lines.append("没有同时满足两个平台低位且恢复到8月均价空间为正的标的。")
    else:
        for _, r in dual.iterrows():
            lines.append(f"- {r['中文名']}：BUFF空间 {r.recover_to_aug_mean_BUFF:.2%}，悠悠空间 {r.recover_to_aug_mean_悠悠有品:.2%}，平均 {r.dual_recover_to_aug_mean:.2%}；五红后百分位 {r.post_tradeup_percentile_BUFF:.2%}/{r.post_tradeup_percentile_悠悠有品:.2%}。")
    lines += ["", "## 重点候选筛选", "", "重点候选按当前价格≤1500、BUFF在售≥60、五红后百分位≤20%、恢复至8月均价空间>5%筛选；完整候选结果见 CSV。", "", "本报告不构成买入推荐。"]
    (RESULTS / "knife_recovery_space_report.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"完成：明细 {len(detail)} 行，双平台确认 {len(dual)} 行，重点候选 {len(focus)} 行。")


if __name__ == "__main__":
    main()
