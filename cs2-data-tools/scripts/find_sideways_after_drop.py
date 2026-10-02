from __future__ import annotations

import csv
import glob
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RANK_FILE = ROOT / "data" / "source" / "yyyp_knives_rank_20260907.json"
META_FILE = ROOT / "data" / "knife_candidates_expanded.csv"
OUTPUT = ROOT / "results" / "sideways_after_drop_20260907.csv"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    with RANK_FILE.open(encoding="utf-8") as handle:
        rank_rows = {int(row["id"]): row for row in json.load(handle)["rows"]}
    metadata = {int(row["good_id"]): row for row in read_csv(META_FILE)}
    records: list[dict[str, object]] = []

    for platform in ("yyyp", "buff"):
        price_field = "yyyp_sell_price" if platform == "yyyp" else "buff_sell_price"
        supply_field = "yyyp_sell_num" if platform == "yyyp" else "buff_sell_num"
        for filename in glob.glob(str(ROOT / "data" / "raw" / "knives" / platform / "*.csv")):
            rows = [row for row in read_csv(Path(filename)) if row.get("price")]
            rows.sort(key=lambda row: row["date"])
            good_id = int(rows[-1]["good_id"])
            current_row = rank_rows.get(good_id)
            if not current_row or len(rows) < 42:
                continue
            current_price = float(current_row[price_field])
            current_supply = int(float(current_row[supply_field]))
            rows = [row for row in rows if row["date"] != "2026-09-07"]
            rows.append({"date": "2026-09-07", "price": str(current_price)})
            rows.sort(key=lambda row: row["date"])
            for window_days in (15, 21, 30):
                recent = rows[-window_days:]
                previous = rows[-(window_days * 2) : -window_days]
                recent_prices = [float(row["price"]) for row in recent]
                previous_prices = [float(row["price"]) for row in previous]
                recent_mean = sum(recent_prices) / len(recent_prices)
                previous_mean = sum(previous_prices) / len(previous_prices)
                records.append(
                    {
                        "platform": platform,
                        "good_id": good_id,
                        "name": metadata.get(good_id, {}).get("中文名", rows[-1].get("item_name", "")),
                        "window_days": window_days,
                        "previous_start": previous[0]["date"],
                        "previous_end": previous[-1]["date"],
                        "recent_start": recent[0]["date"],
                        "recent_end": recent[-1]["date"],
                        "current_price": current_price,
                        "current_supply": current_supply,
                        "recent_mean": recent_mean,
                        "recent_min": min(recent_prices),
                        "recent_max": max(recent_prices),
                        "recent_range_pct": (max(recent_prices) - min(recent_prices)) / recent_mean * 100,
                        "previous_mean": previous_mean,
                        "level_change_pct": (recent_mean / previous_mean - 1) * 100,
                        "current_vs_previous_mean_pct": (current_price / previous_mean - 1) * 100,
                    }
                )

    fields = list(records[0])
    with OUTPUT.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)

    for window_days in (15, 21, 30):
        for range_limit, label in ((5, "严格窄幅"), (8, "放宽窄幅")):
            candidates = [
                row
                for row in records
                if row["window_days"] == window_days
                and float(row["recent_range_pct"]) <= range_limit
                and float(row["level_change_pct"]) <= -5
            ]
            candidates.sort(key=lambda row: float(row["level_change_pct"]))
            print(f"--- {window_days}日 {label}: 波动区间<={range_limit}%，最近窗口均价较前窗口<=-5% ---")
            for row in candidates:
                print(
                    f"{row['platform']}\t{row['good_id']}\t{row['name']}\t"
                    f"当前¥{float(row['current_price']):.2f}\t"
                    f"前{row['previous_start']}~{row['previous_end']}均价¥{float(row['previous_mean']):.2f}\t"
                    f"近{row['recent_start']}~{row['recent_end']}均价¥{float(row['recent_mean']):.2f}\t"
                    f"横盘区间{float(row['recent_range_pct']):.2f}%\t"
                    f"相对前段{float(row['level_change_pct']):.2f}%\t在售{row['current_supply']}"
                )
            print(f"count={len(candidates)}")
    print(f"saved={OUTPUT} rows={len(records)}")


if __name__ == "__main__":
    main()
