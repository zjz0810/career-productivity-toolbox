from __future__ import annotations

import csv
import glob
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TODAY_FILE = ROOT / "data" / "yyyp_knives_under_1000_with_changes_20260907.csv"
TODAY_RANK_FILE = ROOT / "data" / "source" / "yyyp_knives_rank_20260907.json"
META_FILE = ROOT / "data" / "knife_candidates_expanded.csv"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    with TODAY_RANK_FILE.open(encoding="utf-8") as handle:
        rank_payload = json.load(handle)
    today = {int(row["id"]): row for row in rank_payload["rows"]}
    metadata = {int(row["good_id"]): row for row in read_csv(META_FILE)}
    records: list[dict[str, object]] = []

    for platform in ("yyyp", "buff"):
        price_field = "yyyp_sell_price" if platform == "yyyp" else "buff_sell_price"
        supply_field = "yyyp_sell_num" if platform == "yyyp" else "buff_sell_num"
        for filename in glob.glob(str(ROOT / "data" / "raw" / "knives" / platform / "*.csv")):
            rows = [row for row in read_csv(Path(filename)) if row.get("price")]
            rows.sort(key=lambda row: row["date"])
            if len(rows) < 15:
                continue
            window = rows[-15:]
            prices = [float(row["price"]) for row in window]
            good_id = int(rows[-1]["good_id"])
            current_row = today.get(good_id, {})
            current_price = float(current_row.get(price_field) or prices[-1])
            current_supply = int(float(current_row.get(supply_field) or 0))
            average = sum(prices) / len(prices)
            records.append(
                {
                    "platform": platform,
                    "good_id": good_id,
                    "name": metadata.get(good_id, {}).get("中文名", rows[-1].get("item_name", "")),
                    "window_start": window[0]["date"],
                    "window_end": window[-1]["date"],
                    "current_price": current_price,
                    "range_pct": (max(prices) - min(prices)) / average * 100,
                    "window_return_pct": (current_price / prices[0] - 1) * 100,
                    "window_min": min(prices),
                    "window_max": max(prices),
                    "current_supply": current_supply,
                }
            )

    for platform in ("yyyp", "buff"):
        print(f"--- {platform}: 波动区间<=8%，当前较15日前下跌<=-5% ---")
        candidates = [
            row
            for row in records
            if row["platform"] == platform
            and float(row["range_pct"]) <= 8
            and float(row["window_return_pct"]) <= -5
        ]
        candidates.sort(key=lambda row: float(row["window_return_pct"]))
        for row in candidates:
            print(
                f"{row['good_id']}\t{row['name']}\t当前¥{float(row['current_price']):.2f}\t"
                f"窗口{row['window_start']}~{row['window_end']}\t"
                f"区间¥{float(row['window_min']):.2f}-¥{float(row['window_max']):.2f} "
                f"({float(row['range_pct']):.2f}%)\t"
                f"较窗口起点{float(row['window_return_pct']):.2f}%\t在售{row['current_supply']}"
            )
        print(f"count={len(candidates)}")

        print(f"--- {platform}: 波动区间<=8%，当前较15日前下跌<=-3%（放宽观察） ---")
        candidates = [
            row
            for row in records
            if row["platform"] == platform
            and float(row["range_pct"]) <= 8
            and float(row["window_return_pct"]) <= -3
        ]
        candidates.sort(key=lambda row: float(row["window_return_pct"]))
        for row in candidates:
            print(
                f"{row['good_id']}\t{row['name']}\t当前¥{float(row['current_price']):.2f}\t"
                f"波动{float(row['range_pct']):.2f}%\t较窗口起点{float(row['window_return_pct']):.2f}%\t"
                f"在售{row['current_supply']}"
            )
        print(f"count={len(candidates)}")

    print("--- 各平台波动区间<=8%的下跌排序（便于放宽‘降价多’阈值） ---")
    for platform in ("yyyp", "buff"):
        candidates = [row for row in records if row["platform"] == platform and float(row["range_pct"]) <= 8]
        candidates.sort(key=lambda row: float(row["window_return_pct"]))
        print(platform)
        for row in candidates[:20]:
            print(
                f"{row['good_id']}\t{row['name']}\t波动{float(row['range_pct']):.2f}%\t"
                f"较窗口起点{float(row['window_return_pct']):.2f}%"
            )

    output = ROOT / "results" / "recent15_stable_declines_20260907.csv"
    fields = [
        "platform", "good_id", "name", "window_start", "window_end", "current_price",
        "range_pct", "window_return_pct", "window_min", "window_max", "current_supply",
    ]
    with output.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)
    print(f"saved={output} rows={len(records)}")


if __name__ == "__main__":
    main()
