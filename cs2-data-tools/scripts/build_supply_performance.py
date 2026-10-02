"""Build the supply-fundamentals template and post-tradeup price panel.

Local-only. No API calls, no inferred supply labels, and no strategy design.
"""
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd

from walk_forward import CUTOFF, PLATFORMS, load_histories, last_row, first_row, price_asof


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
RAW = DATA / "raw"
RESULTS = ROOT / "results"
EVENT = pd.Timestamp("2025-10-22")
EVENT_HORIZONS = [30, 60, 90, 180]


def safe_return(df: pd.DataFrame, start: pd.Timestamp, end: pd.Timestamp):
    p0 = price_asof(df, start)
    p1 = price_asof(df, end)
    if pd.isna(p0) or pd.isna(p1) or p0 <= 0:
        return np.nan, "", ""
    r0 = last_row(df, start)
    r1 = last_row(df, end)
    return float(p1 / p0 - 1), r0["date"].strftime("%Y-%m-%d"), r1["date"].strftime("%Y-%m-%d")


def event_return(df: pd.DataFrame, horizon: int):
    base = last_row(df, EVENT)
    target = first_row(df, EVENT + pd.Timedelta(days=horizon))
    if base is None or target is None or float(base["price"]) <= 0:
        return np.nan, "", "", float(base["price"]) if base is not None else np.nan
    return float(target["price"] / base["price"] - 1), base["date"].strftime("%Y-%m-%d"), target["date"].strftime("%Y-%m-%d"), float(base["price"])


def price_level(value: float, q25: float, q50: float, q75: float) -> str:
    if pd.isna(value):
        return "无数据"
    if value <= q25:
        return "低价（≤25%分位）"
    if value <= q50:
        return "中低价（25–50%分位）"
    if value <= q75:
        return "中高价（50–75%分位）"
    return "高价（>75%分位）"


def main():
    cases, histories = load_histories()

    # Template: only identifiers are prefilled. Every requested fundamental field
    # remains blank for manual/authoritative completion later.
    template = cases[["case_name", "good_id"]].copy()
    template["first_release_date_or_year"] = ""
    template["current_drop_status"] = ""
    template["is_regular_drop"] = ""
    template["is_rare_drop"] = ""
    template["is_discontinued"] = ""
    template["case_type"] = ""
    template["notes"] = ""
    template = template[["case_name", "good_id", "first_release_date_or_year", "current_drop_status", "is_regular_drop", "is_rare_drop", "is_discontinued", "case_type", "notes"]]
    template.to_csv(DATA / "case_fundamentals.csv", index=False, encoding="utf-8-sig")

    rows = []
    current_prices = {p: [] for p in PLATFORMS}
    for _, case in cases.iterrows():
        good_id = str(case["good_id"])
        row = {"case_name": str(case["case_name"]), "good_id": good_id, "event_date": EVENT.strftime("%Y-%m-%d"), "asof_cutoff": CUTOFF.strftime("%Y-%m-%d")}
        for platform, platform_name in PLATFORMS.items():
            prefix = "buff" if platform == 1 else "yyyp"
            df = histories.get((platform, good_id))
            if df is None:
                row[f"{prefix}_event_price"] = np.nan
                row[f"{prefix}_event_price_date"] = ""
                for h in EVENT_HORIZONS:
                    row[f"{prefix}_return_{h}d"] = np.nan
                    row[f"{prefix}_return_{h}d_exit_date"] = ""
                row[f"{prefix}_2026_ytd_return"] = np.nan
                row[f"{prefix}_pre_tradeup_1y_return"] = np.nan
                row[f"{prefix}_current_price"] = np.nan
                continue
            event_base = last_row(df, EVENT)
            row[f"{prefix}_event_price"] = float(event_base["price"]) if event_base is not None else np.nan
            row[f"{prefix}_event_price_date"] = event_base["date"].strftime("%Y-%m-%d") if event_base is not None else ""
            for h in EVENT_HORIZONS:
                ret, base_date, exit_date, _ = event_return(df, h)
                row[f"{prefix}_return_{h}d"] = ret
                row[f"{prefix}_return_{h}d_exit_date"] = exit_date
            ytd, _, _ = safe_return(df, pd.Timestamp("2025-12-31"), CUTOFF)
            pre, _, _ = safe_return(df, EVENT - pd.Timedelta(days=365), EVENT)
            row[f"{prefix}_2026_ytd_return"] = ytd
            row[f"{prefix}_pre_tradeup_1y_return"] = pre
            current = price_asof(df, CUTOFF)
            row[f"{prefix}_current_price"] = current
            current_prices[platform].append(current)
        rows.append(row)

    result = pd.DataFrame(rows)
    levels = {}
    for platform, values in current_prices.items():
        arr = pd.Series(values, dtype=float).dropna()
        levels[platform] = (arr.quantile(.25), arr.quantile(.50), arr.quantile(.75))
    for platform in PLATFORMS:
        prefix = "buff" if platform == 1 else "yyyp"
        q25, q50, q75 = levels[platform]
        result[f"{prefix}_current_price_level"] = result[f"{prefix}_current_price"].map(lambda v: price_level(v, q25, q50, q75))
        result[f"{prefix}_price_level_q25"] = q25
        result[f"{prefix}_price_level_median"] = q50
        result[f"{prefix}_price_level_q75"] = q75
    result.to_csv(RESULTS / "case_post_tradeup_performance.csv", index=False, encoding="utf-8-sig")

    # A short methodological note, not a strategy report.
    note = """# 箱子供给属性研究数据准备

本阶段暂停价格技术指标策略研究。`data/case_fundamentals.csv` 只预填箱子名称和 good_id，其余供给属性全部留空，等待后续权威资料补充；本地价格历史不会被用于猜测掉落状态、常规/稀有或停供标签。

`results/case_post_tradeup_performance.csv` 使用已有 CSQAQ 历史 CSV：

- 事件基准为 2025-10-22 的最后一个不晚于事件日的有效价格；+30/+60/+90/+180 日使用事件后第一个不早于目标日的有效价格。
- 2026 年至今收益为 2025-12-31 as-of 价格至 2026-09-04 as-of 价格。
- 五红前一年收益为 2024-10-22 至 2025-10-22 的 as-of 价格收益。
- 当前价格层级仅是各平台当前价格横截面的四分位价格分层，不是供给属性标签。
- 所有日期、价格和收益缺失时保留为空，不补造数据。
"""
    (RESULTS / "supply_research_data_note.md").write_text(note, encoding="utf-8")
    print(f"fundamentals_rows={len(template)} performance_rows={len(result)}")


if __name__ == "__main__":
    main()
