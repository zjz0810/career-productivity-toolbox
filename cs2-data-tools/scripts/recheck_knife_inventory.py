"""Recheck current knife listings from CSQAQ's rank endpoint only.

This script deliberately does not call the chart/history endpoint and does not
write any raw price history.  It records the rank response fields explicitly so
sell listings cannot be confused with buy orders or turnover metrics.
"""
from __future__ import annotations

import csv
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
from mcp_call import McpClient  # noqa: E402


ROOT = Path(__file__).resolve().parents[1]
CANDIDATES = ROOT / "data" / "knife_candidates_expanded.csv"
OUT_CSV = ROOT / "data" / "knife_current_inventory_rechecked.csv"
OUT_JSON = ROOT / "data" / "source" / "knife_current_inventory_rechecked.json"
MIN_INTERVAL = 1.0
RETRY_DELAY = 3.0
MAX_ATTEMPTS = 3


def number(value: Any) -> float | None:
    try:
        n = float(value)
    except (TypeError, ValueError):
        return None
    return n if pd.notna(n) else None


def request_rank(client: McpClient, name: str, last_call: list[float]) -> dict[str, Any]:
    last_error = ""
    for attempt in range(1, MAX_ATTEMPTS + 1):
        wait = MIN_INTERVAL - (time.monotonic() - last_call[0])
        if wait > 0:
            time.sleep(wait)
        last_call[0] = time.monotonic()
        try:
            payload = client.call_tool(
                "get_rank_list",
                {
                    "page_index": 1,
                    "page_size": 50,
                    "filter": {},
                    "search": name,
                },
            )
            if not isinstance(payload, dict):
                raise RuntimeError("响应不是对象")
            if payload.get("code") != 200:
                raise RuntimeError(f"CSQAQ code={payload.get('code')}")
            rows = ((payload.get("data") or {}).get("data") or [])
            if not rows:
                raise RuntimeError("排行榜返回空列表")
            return {"payload": payload, "rows": rows}
        except Exception as exc:  # noqa: BLE001 - preserve API error text in local audit
            last_error = str(exc)
            if attempt < MAX_ATTEMPTS:
                time.sleep(RETRY_DELAY)
    raise RuntimeError(f"尝试{MAX_ATTEMPTS}次失败: {last_error}")


def main() -> int:
    candidates = pd.read_csv(CANDIDATES, dtype={"good_id": str}).fillna("")
    if len(candidates) != 75 or candidates["good_id"].nunique() != 75:
        raise RuntimeError(f"候选池不是75个唯一good_id: rows={len(candidates)}")

    rows: list[dict[str, Any]] = []
    failures: list[dict[str, Any]] = []
    last_call = [0.0]
    client = McpClient()
    try:
        client.initialize()
        for index, item in enumerate(candidates.to_dict("records"), start=1):
            good_id = int(item["good_id"])
            name = str(item["中文名"])
            try:
                response = request_rank(client, name, last_call)
                rank_rows = response["rows"]
                matched = next((r for r in rank_rows if int(r.get("id", -1)) == good_id), None)
                if matched is None:
                    raise RuntimeError(f"排行榜结果未找到good_id={good_id}")

                required = ["buff_sell_price", "buff_sell_num", "yyyp_sell_price", "yyyp_sell_num"]
                missing = [key for key in required if key not in matched]
                if missing:
                    raise RuntimeError("缺少字段: " + ",".join(missing))

                rows.append(
                    {
                        "good_id": good_id,
                        "中文名": matched.get("name") or name,
                        "英文名": item.get("英文名", ""),
                        "刀型": item.get("刀型", ""),
                        "涂装": item.get("涂装", ""),
                        "磨损": matched.get("exterior_localized_name") or item.get("磨损", ""),
                        "BUFF当前最低售价": number(matched.get("buff_sell_price")),
                        "BUFF当前在售数量": number(matched.get("buff_sell_num")),
                        "悠悠当前最低售价": number(matched.get("yyyp_sell_price")),
                        "悠悠当前在售数量": number(matched.get("yyyp_sell_num")),
                        "字段_求购_BUFF": number(matched.get("buff_buy_num")),
                        "字段_求购_悠悠": number(matched.get("yyyp_buy_num")),
                        "字段_统计值": number(matched.get("statistic")),
                        "字段_Steam在售": number(matched.get("steam_sell_num")),
                        "字段_Steam求购": number(matched.get("steam_buy_num")),
                        "rank_num": matched.get("rank_num", ""),
                        "snapshot_time": matched.get("created_at", ""),
                        "source_endpoint": "/api/v1/info/get_rank_list",
                        "status": "success",
                    }
                )
                print(f"RECHECK {index}/75 good_id={good_id} success", flush=True)
            except Exception as exc:  # noqa: BLE001 - continue audit for remaining items
                failures.append({"good_id": good_id, "中文名": name, "error": str(exc)})
                print(f"RECHECK {index}/75 good_id={good_id} failed", flush=True)
    finally:
        client.close()

    columns = [
        "good_id", "中文名", "英文名", "刀型", "涂装", "磨损",
        "BUFF当前最低售价", "BUFF当前在售数量", "悠悠当前最低售价", "悠悠当前在售数量",
        "字段_求购_BUFF", "字段_求购_悠悠", "字段_统计值", "字段_Steam在售", "字段_Steam求购",
        "rank_num", "snapshot_time", "source_endpoint", "status",
    ]
    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUT_CSV.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)

    audit = {
        "source": "CSQAQ official API",
        "endpoint": "/api/v1/info/get_rank_list",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "candidate_count": len(candidates),
        "success_count": len(rows),
        "failure_count": len(failures),
        "field_mapping": {
            "BUFF当前在售数量": "buff_sell_num",
            "悠悠当前在售数量": "yyyp_sell_num",
            "BUFF当前最低售价": "buff_sell_price",
            "悠悠当前最低售价": "yyyp_sell_price",
            "not_listing_count": ["buff_buy_num", "yyyp_buy_num", "statistic", "steam_sell_num", "steam_buy_num"],
        },
        "failures": failures,
    }
    OUT_JSON.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"DONE success={len(rows)} failures={len(failures)}", flush=True)
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
