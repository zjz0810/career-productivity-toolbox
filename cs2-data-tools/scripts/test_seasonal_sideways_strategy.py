from __future__ import annotations

from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
META = ROOT / "data" / "knife_candidates_expanded.csv"
FRICTIONS = (0.0, 0.01, 0.02, 0.03, 0.05)
YEARS = (2023, 2024, 2025)


def load_history(platform: str) -> dict[int, pd.DataFrame]:
    histories: dict[int, pd.DataFrame] = {}
    for path in (ROOT / "data" / "raw" / "knives" / platform).glob("*.csv"):
        frame = pd.read_csv(path)
        frame["date"] = pd.to_datetime(frame["date"])
        frame["price"] = pd.to_numeric(frame["price"], errors="coerce")
        frame = frame.dropna(subset=["date", "price"]).sort_values("date")
        if frame.empty:
            continue
        histories[int(frame["good_id"].iloc[0])] = frame[["date", "price"]].drop_duplicates("date", keep="last")
    return histories


def signal_at_july_end(frame: pd.DataFrame, year: int) -> dict[str, float] | None:
    past = frame[frame["date"] <= pd.Timestamp(year=year, month=7, day=31)]
    if len(past) < 60:
        return None
    last60 = past.tail(60)
    last15 = past.tail(15)
    last8 = past.tail(8)
    price = float(past["price"].iloc[-1])
    mean60 = float(last60["price"].mean())
    amplitude15 = float((last15["price"].max() - last15["price"].min()) / last15["price"].mean())
    return7 = float(price / last8["price"].iloc[0] - 1)
    return {
        "price": price,
        "discount_to_mean60": price / mean60 - 1,
        "amplitude15": amplitude15,
        "return7": return7,
    }


def month_mean(frame: pd.DataFrame, year: int, month: int) -> float | None:
    values = frame[(frame["date"].dt.year == year) & (frame["date"].dt.month == month)]["price"]
    if values.empty:
        return None
    return float(values.mean())


def summarize(trades: pd.DataFrame, label: str) -> None:
    print(f"\n=== {label} ===")
    for (year, platform), group in trades.groupby(["year", "platform"], sort=True):
        for friction in FRICTIONS:
            net = (1 + group["gross_return"]) * (1 - friction) - 1
            print(
                f"year={year} platform={platform} friction={friction:.0%} "
                f"n={len(group)} avg={net.mean():.4%} median={net.median():.4%} "
                f"win={(net > 0).mean():.2%}"
            )
    for platform, group in trades.groupby("platform", sort=True):
        print(f"-- pooled platform={platform} --")
        for friction in FRICTIONS:
            net = (1 + group["gross_return"]) * (1 - friction) - 1
            print(
                f"friction={friction:.0%} n={len(group)} avg={net.mean():.4%} "
                f"median={net.median():.4%} win={(net > 0).mean():.2%}"
            )


def main() -> None:
    metadata = pd.read_csv(META, encoding="utf-8-sig")
    names = dict(zip(metadata["good_id"].astype(int), metadata["中文名"].astype(str)))
    histories = {"BUFF": load_history("buff"), "悠悠": load_history("yyyp")}
    common_ids = sorted(set(histories["BUFF"]) & set(histories["悠悠"]))
    filtered_records: list[dict[str, object]] = []
    baseline_records: list[dict[str, object]] = []

    for year in YEARS:
        selected: list[tuple[int, dict[str, float], dict[str, float]]] = []
        for good_id in common_ids:
            buff_signal = signal_at_july_end(histories["BUFF"][good_id], year)
            yyyp_signal = signal_at_july_end(histories["悠悠"][good_id], year)
            if buff_signal is None or yyyp_signal is None:
                continue
            qualifies = all(
                signal["discount_to_mean60"] <= -0.03
                and signal["amplitude15"] <= 0.08
                and signal["return7"] >= -0.05
                for signal in (buff_signal, yyyp_signal)
            )
            if qualifies:
                selected.append((good_id, buff_signal, yyyp_signal))

        print(f"year={year} selected={len(selected)}")
        for good_id, buff_signal, yyyp_signal in selected:
            print(
                f"  {good_id} {names.get(good_id, '')} "
                f"BUFF(discount={buff_signal['discount_to_mean60']:.2%},amp15={buff_signal['amplitude15']:.2%},r7={buff_signal['return7']:.2%}) "
                f"悠悠(discount={yyyp_signal['discount_to_mean60']:.2%},amp15={yyyp_signal['amplitude15']:.2%},r7={yyyp_signal['return7']:.2%})"
            )

        for platform, platform_histories in histories.items():
            for good_id in common_ids:
                buy = month_mean(platform_histories[good_id], year, 8)
                sell = month_mean(platform_histories[good_id], year, 9)
                if buy is None or sell is None:
                    continue
                record = {
                    "year": year,
                    "platform": platform,
                    "good_id": good_id,
                    "name": names.get(good_id, ""),
                    "gross_return": sell / buy - 1,
                }
                baseline_records.append(record)
                if any(selected_id == good_id for selected_id, _, _ in selected):
                    filtered_records.append(record)

    baseline = pd.DataFrame(baseline_records)
    filtered = pd.DataFrame(filtered_records)
    summarize(baseline, "基准：全部75刀，8月均价买、9月均价卖")
    if filtered.empty:
        print("\n筛选策略没有产生交易。")
    else:
        summarize(filtered, "新规则：双平台低位横盘后，8月分批买、9月分批卖")


if __name__ == "__main__":
    main()
