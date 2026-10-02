from pathlib import Path
import glob
import pandas as pd

cases = pd.read_csv("data/cases.csv", encoding="utf-8-sig")
summary = pd.read_csv("results/backtest_summary.csv", encoding="utf-8-sig")
seasonality = pd.read_csv("results/seasonality.csv", encoding="utf-8-sig")
simulation = pd.read_csv("results/simulation.csv", encoding="utf-8-sig")
print("cases", len(cases), "unique_good", cases.good_id.nunique(), "summary", summary.shape, "seasonality", seasonality.shape, "simulation", simulation.shape)
print("raw_files", len(glob.glob("data/raw/buff/*.csv")), len(glob.glob("data/raw/yyyp/*.csv")))
print("missing_summary_points", int((summary["data_points"] == 0).sum()))
required = {"date", "price", "platform", "good_id", "case_name"}
bad = []
for folder, platform in [("buff", 1), ("yyyp", 2)]:
    for filename in glob.glob(f"data/raw/{folder}/*.csv"):
        df = pd.read_csv(filename, encoding="utf-8-sig")
        if not required.issubset(df.columns) or df.empty or set(df["platform"].astype(int)) != {platform} or (pd.to_numeric(df["price"], errors="coerce") <= 0).any():
            bad.append(filename)
print("bad_raw_files", len(bad))
for filename in ["results/event_2025_07_15.csv", "results/event_2025_10_22.csv"]:
    df = pd.read_csv(filename, encoding="utf-8-sig")
    print(filename, "rows", len(df), "case_rows", int((df["row_type"] == "case").sum()), "index_rows", int((df["row_type"] == "index").sum()), "non_null_pct", int(df["pct_change"].notna().sum()), "platforms", sorted(df["platform"].unique().tolist()))
five = pd.read_csv("results/event_2025_10_22.csv", encoding="utf-8-sig")
five = five[(five["row_type"] == "index") & (five["drop_group"] == "全部箱子") & five["relative_day"].isin([30, 60, 90])]
print("five_red_index", five[["platform_name", "relative_day", "pct_change", "n_cases"]].to_json(orient="records", force_ascii=False))
sim = simulation[(simulation["starting_capital"] == 3000) & (simulation["friction_total"] == 0.05) & simulation["strategy"].isin(["top5_focus_return", "low_price_high_sell_num_current"])]
print("sim_3000_5pct", sim[["platform_name", "strategy", "final_asset", "return", "max_drawdown", "benchmark_asset_1_3pct", "beat_1_3pct"]].to_json(orient="records", force_ascii=False))
