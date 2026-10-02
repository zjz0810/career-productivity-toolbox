"""Explain where the original B (30/90/90) OOS returns came from.

Local-only analysis. It reconstructs the already-defined monthly B signals from
CSQAQ raw CSVs and never calls an API or changes the B parameters.
"""
from __future__ import annotations

import math
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

import numpy as np
import pandas as pd

from walk_forward import CUTOFF, EVENTS, PLATFORMS, decision_dates, features, load_histories, price_asof


ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "results"
OOS_START = pd.Timestamp("2025-01-01")
TRADEUP = pd.Timestamp("2025-10-22")


def b_ids(platform: int, date: pd.Timestamp, histories) -> List[str]:
    out = []
    for (p, good_id), df in histories.items():
        if p != platform:
            continue
        f = features(df, date)
        if f.get("B") and pd.notna(f.get("current_price")):
            out.append(good_id)
    return sorted(out)


def all_case_index_return(platform: int, start: pd.Timestamp, end: pd.Timestamp, histories) -> Tuple[float, int]:
    returns = []
    for (p, _), df in histories.items():
        if p != platform:
            continue
        p0, p1 = price_asof(df, start), price_asof(df, end)
        if pd.notna(p0) and pd.notna(p1) and p0 > 0:
            returns.append(p1 / p0 - 1)
    return (float(np.mean(returns)) if returns else np.nan, len(returns))


def reconstruct_trades(platform: int, decisions, histories) -> pd.DataFrame:
    """Reconstruct case-level B holding episodes from monthly target baskets."""
    rows = []
    previous: List[str] = []
    previous_date: Optional[pd.Timestamp] = None
    open_date: Dict[str, pd.Timestamp] = {}
    open_price: Dict[str, float] = {}
    for date in decisions:
        if date > CUTOFF:
            break
        current = b_ids(platform, date, histories)
        if previous_date is None:
            for good_id in current:
                p = price_asof(histories[(platform, good_id)], date)
                if pd.notna(p):
                    open_date[good_id], open_price[good_id] = date, p
        else:
            exited = sorted(set(previous) - set(current))
            entered = sorted(set(current) - set(previous))
            for good_id in exited:
                if good_id not in open_date:
                    continue
                sell_date = date
                sell_price = price_asof(histories[(platform, good_id)], sell_date)
                if pd.notna(sell_price) and open_price[good_id] > 0:
                    rows.append({
                        "platform": platform, "platform_name": PLATFORMS[platform], "good_id": good_id,
                        "buy_date": open_date[good_id], "buy_price": open_price[good_id],
                        "sell_date": sell_date, "sell_price": sell_price,
                    })
                open_date.pop(good_id, None)
                open_price.pop(good_id, None)
            for good_id in entered:
                p = price_asof(histories[(platform, good_id)], date)
                if pd.notna(p):
                    open_date[good_id], open_price[good_id] = date, p
        previous, previous_date = current, date
    # Mark open positions to the actual data cutoff, matching the portfolio liquidation.
    for good_id, buy_date in sorted(open_date.items()):
        sell_price = price_asof(histories[(platform, good_id)], CUTOFF)
        if pd.notna(sell_price) and open_price[good_id] > 0:
            rows.append({
                "platform": platform, "platform_name": PLATFORMS[platform], "good_id": good_id,
                "buy_date": buy_date, "buy_price": open_price[good_id],
                "sell_date": CUTOFF, "sell_price": sell_price, "sell_type": "asof_cutoff",
            })
    out = pd.DataFrame(rows)
    if out.empty:
        return out
    out["buy_date"] = pd.to_datetime(out["buy_date"])
    out["sell_date"] = pd.to_datetime(out["sell_date"])
    out["sell_type"] = out.get("sell_type", "signal_exit").fillna("signal_exit")
    out["holding_days"] = (out["sell_date"] - out["buy_date"]).dt.days
    out["gross_return"] = out["sell_price"] / out["buy_price"] - 1
    out["event_phase"] = np.select(
        [out["sell_date"] < TRADEUP, out["buy_date"] >= TRADEUP],
        ["五红前", "五红后"], default="跨越五红",
    )
    index_values = [all_case_index_return(platform, r.buy_date, r.sell_date, histories) for r in out.itertuples()]
    out["all_case_index_return"] = [x[0] for x in index_values]
    out["index_case_count"] = [x[1] for x in index_values]
    out["excess_return_vs_index"] = out["gross_return"] - out["all_case_index_return"]
    out["relative_excess_return_vs_index"] = (1 + out["gross_return"]) / (1 + out["all_case_index_return"]) - 1
    out["oos_scope"] = np.select(
        [out["buy_date"] >= OOS_START, out["sell_date"] >= OOS_START],
        ["oos_entry", "carry_in_to_oos"], default="pre_oos",
    )
    # Keep trades that affect OOS; a carry-in is explicitly labelled.
    out = out[(out["sell_date"] >= OOS_START) & (out["buy_date"] <= CUTOFF)].copy()
    return out.sort_values(["gross_return", "buy_date"], ascending=[False, True]).reset_index(drop=True)


def portfolio_context(platform: int, decisions, histories) -> pd.DataFrame:
    """All-case index and original B gross portfolio monthly returns."""
    rows = []
    prev = None
    for date in decisions:
        if date > CUTOFF:
            break
        if prev is not None:
            idx, n = all_case_index_return(platform, prev, date, histories)
            ids = b_ids(platform, date, histories)
            # Use the existing original-B 0% portfolio file for exact monthly B gross return.
            rows.append({"platform": platform, "platform_name": PLATFORMS[platform], "period_start": prev, "period_end": date, "all_case_index_return": idx, "index_case_count": n, "b_selected_count": len(ids), "b_selected_good_ids": ";".join(ids)})
        prev = date
    out = pd.DataFrame(rows)
    if out.empty:
        return out
    saved = pd.read_csv(RESULTS / "walk_forward_trades.csv", encoding="utf-8-sig")
    saved = saved[(saved["strategy"] == "B_trend") & (saved["platform"] == platform) & (saved["friction"] == 0)]
    saved["period_start"] = pd.to_datetime(saved["period_start"])
    saved["period_end"] = pd.to_datetime(saved["period_end"])
    saved = saved[["period_start", "period_end", "gross_return", "net_return", "active_count"]].rename(columns={"gross_return": "b_portfolio_gross_return", "net_return": "b_portfolio_0_return", "active_count": "b_active_count"})
    out = out.merge(saved, on=["period_start", "period_end"], how="left")
    # The monthly decision list ends at 2026-09-01; include the final as-of-cutoff
    # interval through 2026-09-04, matching the existing portfolio backtest.
    last_decision = pd.Timestamp(out["period_end"].max())
    if last_decision < CUTOFF:
        idx, n = all_case_index_return(platform, last_decision, CUTOFF, histories)
        ids = b_ids(platform, last_decision, histories)
        out = pd.concat([out, pd.DataFrame([{
            "platform": platform, "platform_name": PLATFORMS[platform],
            "period_start": last_decision, "period_end": CUTOFF,
            "all_case_index_return": idx, "index_case_count": n,
            "b_selected_count": len(ids), "b_selected_good_ids": ";".join(ids),
        }])], ignore_index=True)
        saved_final = saved[(saved["period_start"] == last_decision) & (saved["period_end"] == CUTOFF)]
        if not saved_final.empty:
            for col in ["b_portfolio_gross_return", "b_portfolio_0_return", "b_active_count"]:
                out.loc[out.index[-1], col] = saved_final.iloc[0][col]
    out["period_start"] = out["period_start"].dt.strftime("%Y-%m-%d")
    out["period_end"] = out["period_end"].dt.strftime("%Y-%m-%d")
    return out


def path_drawdown(returns: pd.Series) -> float:
    if returns.empty:
        return np.nan
    path = (1 + returns.astype(float)).cumprod()
    return float((path / path.cummax() - 1).min())


def phase_stats(trades: pd.DataFrame, context: Dict[int, pd.DataFrame]) -> pd.DataFrame:
    rows = []
    for platform in PLATFORMS:
        t = trades[trades.platform == platform]
        c = context[platform]
        for phase, mask in [("五红前", t.event_phase == "五红前"), ("五红后", t.event_phase == "五红后"), ("跨越五红", t.event_phase == "跨越五红")]:
            x = t[mask]
            if phase == "五红前":
                cp = c[(pd.to_datetime(c.period_start) >= OOS_START) & (pd.to_datetime(c.period_end) < TRADEUP)]
            elif phase == "五红后":
                cp = c[pd.to_datetime(c.period_start) >= TRADEUP]
            else:
                cp = c.iloc[0:0]
            rows.append({
                "platform": platform, "platform_name": PLATFORMS[platform], "phase": phase,
                "trade_count": len(x), "win_rate": float((x.gross_return > 0).mean()) if len(x) else np.nan,
                "mean_single_trade_return": float(x.gross_return.mean()) if len(x) else np.nan,
                "median_single_trade_return": float(x.gross_return.median()) if len(x) else np.nan,
                "portfolio_max_drawdown_0_friction": path_drawdown(cp["b_portfolio_0_return"].dropna()) if not cp.empty else np.nan,
                "portfolio_period_count": len(cp),
            })
    return pd.DataFrame(rows)


def strongest_market_phase(platform: int, context: pd.DataFrame) -> dict:
    x = context.copy()
    x["period_start"] = pd.to_datetime(x["period_start"])
    x["period_end"] = pd.to_datetime(x["period_end"])
    x = x[(x["period_start"] >= OOS_START) & (x["period_end"] <= CUTOFF)].copy()
    x["rolling_3m_index_return"] = (1 + x["all_case_index_return"]).rolling(3).apply(np.prod, raw=True) - 1
    valid = x.dropna(subset=["rolling_3m_index_return"])
    if valid.empty:
        return {"platform": platform}
    best = valid.loc[valid["rolling_3m_index_return"].idxmax()]
    start = valid.loc[max(valid.index[0], best.name - 2), "period_start"]
    end = best["period_end"]
    mask = (x["period_start"] >= start) & (x["period_end"] <= end)
    b0 = float((1 + x.loc[mask, "b_portfolio_0_return"].fillna(0)).prod() - 1)
    # Reuse the saved B 5% path for the same fixed market window.
    saved = pd.read_csv(RESULTS / "walk_forward_trades.csv", encoding="utf-8-sig")
    saved = saved[(saved.strategy == "B_trend") & (saved.platform == platform)]
    saved["period_start"] = pd.to_datetime(saved["period_start"])
    saved["period_end"] = pd.to_datetime(saved["period_end"])
    s5 = saved[(saved.friction == .05) & (saved.period_start >= OOS_START) & (saved.period_end <= CUTOFF)]
    b5 = float((1 + s5.loc[(s5.period_start >= start) & (s5.period_end <= end), "net_return"].fillna(0)).prod() - 1)
    outside0 = float((1 + x.loc[~mask, "b_portfolio_0_return"].fillna(0)).prod() - 1)
    outside5 = float((1 + s5.loc[~((s5.period_start >= start) & (s5.period_end <= end)), "net_return"].fillna(0)).prod() - 1)
    return {"platform": platform, "platform_name": PLATFORMS[platform], "phase_start": start.strftime("%Y-%m-%d"), "phase_end": end.strftime("%Y-%m-%d"), "phase_index_3m_return": float(best["rolling_3m_index_return"]), "phase_b_return_0": b0, "phase_b_return_5": b5, "outside_phase_b_return_0": outside0, "outside_phase_b_return_5": outside5, "phase_index_months": ";".join(x.loc[mask, "period_end"].dt.strftime("%Y-%m-%d"))}


def main():
    cases, histories = load_histories()
    decisions = decision_dates(histories)
    all_trades = pd.concat([reconstruct_trades(p, decisions, histories) for p in PLATFORMS], ignore_index=True)
    if not all_trades.empty:
        names = cases.set_index(cases["good_id"].astype(str))["case_name"].to_dict()
        all_trades["case_name"] = all_trades["good_id"].map(names).fillna("")
        all_trades = all_trades[["case_name", "good_id", "platform", "platform_name", "buy_date", "buy_price", "sell_date", "sell_price", "sell_type", "holding_days", "gross_return", "all_case_index_return", "index_case_count", "excess_return_vs_index", "relative_excess_return_vs_index", "event_phase", "oos_scope"]]
        all_trades["buy_date"] = pd.to_datetime(all_trades["buy_date"]).dt.strftime("%Y-%m-%d")
        all_trades["sell_date"] = pd.to_datetime(all_trades["sell_date"]).dt.strftime("%Y-%m-%d")
    all_trades.to_csv(RESULTS / "b_trend_original_oos_trades.csv", index=False, encoding="utf-8-sig")
    top10 = all_trades.sort_values("gross_return", ascending=False).head(10)
    top10.to_csv(RESULTS / "b_trend_original_oos_top10.csv", index=False, encoding="utf-8-sig")

    contexts = {p: portfolio_context(p, decisions, histories) for p in PLATFORMS}
    context = pd.concat(contexts.values(), ignore_index=True)
    context.to_csv(RESULTS / "b_trend_monthly_context.csv", index=False, encoding="utf-8-sig")
    phase = phase_stats(all_trades, contexts)
    phase.to_csv(RESULTS / "b_trend_before_after_stats.csv", index=False, encoding="utf-8-sig")
    market = pd.DataFrame([strongest_market_phase(p, contexts[p]) for p in PLATFORMS])
    market.to_csv(RESULTS / "b_trend_market_phase_diagnostic.csv", index=False, encoding="utf-8-sig")
    write_report(all_trades, top10, context, phase, market)
    print(f"all_trades={len(all_trades)} top10={len(top10)} phase_rows={len(phase)}")


def write_report(all_trades, top10, context, phase, market):
    path = RESULTS / "report.md"
    original = path.read_text(encoding="utf-8") if path.exists() else "# CS2 武器箱回测报告\n"
    marker = "## 原始 B 收益来源分析"
    if marker in original:
        original = original.split(marker, 1)[0].rstrip() + "\n"
    lines = ["", marker, "", "本节只解释固定的原始 B（30日/90日/过去两年90%分位）在 2025-01-01 至 2026-09-04 样本外的收益来源，不重新优化参数。交易由月度第一个有效交易日的信号变化重建；仍持有到截止日的仓位按 2026-09-04 价格平仓。", "", "全武器箱等权指数使用同一平台所有可用箱子，在该笔交易买卖日期的 as-of 价格等权计算。`excess_return_vs_index` 为箱子毛收益率减指数收益率，CSV 同时提供复合口径相对超额收益。", ""]
    lines += ["收益最高 10 笔（按两平台合并毛收益率排序）：", "", "|箱子|平台|买入日期/价格|卖出日期/价格|持有日|毛收益|全箱指数|超额收益|五红阶段|", "|---|---|---|---|---:|---:|---:|---:|---|"]
    for _, r in top10.iterrows():
        lines.append(f"|{r.case_name}|{r.platform_name}|{r.buy_date} / {r.buy_price:.4f}|{r.sell_date} / {r.sell_price:.4f}|{int(r.holding_days)}|{r.gross_return:.2%}|{r.all_case_index_return:.2%}|{r.excess_return_vs_index:.2%}|{r.event_phase}|")
    lines += ["", "### 交易概览"]
    for p in PLATFORMS:
        x = all_trades[all_trades.platform == p]
        lines.append(f"### {PLATFORMS[p]} 样本外交易概览")
        lines.append("")
        lines.append(f"共 {len(x)} 笔影响样本外的箱子级持有段，其中完整样本外入场 {int((x.oos_scope == 'oos_entry').sum())} 笔，2025 年前入场并延续到样本外的 carry-in {int((x.oos_scope == 'carry_in_to_oos').sum())} 笔。")
        lines.append("")
    lines += ["", "### 关键问题", ""]
    top3 = top10.head(3)
    dates = "; ".join(f"{r.buy_date}→{r.sell_date}" for _, r in top3.iterrows())
    lines.append(f"1. 最佳 3 笔时间段：{dates}。详细记录见 `b_trend_original_oos_top10.csv`；是否集中在同一阶段应结合这些买卖日期，而不是只看箱子名称。")
    lines.append("2. 市场同步性：每笔交易的全箱指数同期收益和箱子超额收益已逐笔列出；如果毛收益高但超额收益接近 0，说明主要是市场 beta，而不是 B 选中了特殊箱子。")
    for _, r in market.iterrows():
        lines.append(f"   - {r.platform_name} 最强三个月全箱指数阶段为 {r.phase_start} 至 {r.phase_end}，指数 {r.phase_index_3m_return:.2%}；B 在该阶段 0%/5% 摩擦收益为 {r.phase_b_return_0:.2%}/{r.phase_b_return_5:.2%}，去掉该阶段后为 {r.outside_phase_b_return_0:.2%}/{r.outside_phase_b_return_5:.2%}。")
    lines.append("3. 去掉最强市场阶段：采用样本外全箱等权指数三个月滚动收益最高的固定窗口，不根据 B 收益挑窗口；窗口外收益见上，作为市场阶段剔除诊断。")
    lines.append("4. 2025 年月度来源：详见 `b_trend_monthly_context.csv`；其中同时保留全箱指数收益和 B 组合毛收益，按 B 组合收益排序即可看到贡献月份。")
    for p in PLATFORMS:
        c = context[(context.platform == p) & (pd.to_datetime(context.period_start) >= OOS_START) & (pd.to_datetime(context.period_end).dt.year == 2025)].copy()
        c = c.sort_values("b_portfolio_gross_return", ascending=False).head(5)
        lines.append(f"   - {PLATFORMS[p]} 2025 B 收益最高月份：" + "；".join(f"{r.period_end} {r.b_portfolio_gross_return:.2%}（全箱指数 {r.all_case_index_return:.2%}）" for _, r in c.iterrows()) + "。")
    lines.append("5. 2026 失效诊断：使用 `b_trend_monthly_context.csv` 比较 B 与全箱指数；若两者同步为负是市场缺少大趋势，若 B 明显低于指数则是选箱偏差，不能凭印象二选一。")
    lines += ["", "### 五红前后 B 统计", "", "|平台|阶段|交易数|胜率|平均单笔毛收益|中位数单笔毛收益|B组合最大回撤（0%摩擦）|", "|---|---|---:|---:|---:|---:|---:|"]
    for _, r in phase[phase.phase != "跨越五红"].iterrows():
        lines.append(f"|{r.platform_name}|{r.phase}|{int(r.trade_count)}|{r.win_rate:.2%}|{r.mean_single_trade_return:.2%}|{r.median_single_trade_return:.2%}|{r.portfolio_max_drawdown_0_friction:.2%}|")
    lines += ["", "所有样本外箱子级交易见 `b_trend_original_oos_trades.csv`；收益最高 10 笔见 `b_trend_original_oos_top10.csv`；月度市场上下文见 `b_trend_monthly_context.csv`；最强市场阶段诊断见 `b_trend_market_phase_diagnostic.csv`；五红前后统计见 `b_trend_before_after_stats.csv`。", ""]
    path.write_text(original + "\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
