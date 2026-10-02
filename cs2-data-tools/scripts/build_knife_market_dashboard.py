from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RUN_DATE = sys.argv[1] if len(sys.argv) > 1 else "20260907"
SOURCE = ROOT / "data" / f"yyyp_knives_under_1000_with_changes_{RUN_DATE}.csv"
TEMPLATE = Path(r"C:\Users\zongzi\.codex\visualizations\2026\09\05\01a07014-b906-7b33-97e1-1f3ba91e8b0a\knife-market-dashboard.html")


def main() -> None:
    data = pd.read_csv(SOURCE)
    rows = []
    for _, r in data.iterrows():
        row = {
            "id": int(r["good_id"]),
            "name": str(r["中文名"]),
            "price": float(r["悠悠最低售价"]),
            "supply": int(r["悠悠在售数量"]),
        }
        for period in [1, 7, 15, 30, 90, 180, 365]:
            row[f"change_rate_{period}"] = float(r[f"悠悠涨跌率{period}日"])
            row[f"change_amount_{period}"] = float(r[f"悠悠涨跌{period}日"])
        rows.append(row)
    payload = json.dumps(rows, ensure_ascii=False, separators=(",", ":"))
    template = TEMPLATE.read_text(encoding="utf-8")
    template = re.sub(r"const data = \[.*?\];", f"const data = {payload};", template, count=1, flags=re.S)
    template = re.sub(r"快照：\d{4}-\d{2}-\d{2}", f"快照：{RUN_DATE[:4]}-{RUN_DATE[4:6]}-{RUN_DATE[6:8]}", template, count=1)
    TEMPLATE.write_text(template, encoding="utf-8")
    print(f"dashboard rows={len(rows)} bytes={TEMPLATE.stat().st_size}")


if __name__ == "__main__":
    main()
