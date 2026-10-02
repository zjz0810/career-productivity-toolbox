"""Build case content fundamentals from public static data, without CSQAQ.

The ByMykel CSGO-API crates.json file is a public, versioned static dataset of
case contents. It is cached locally under data/source for reproducibility. No
CSQAQ endpoint, price API, or token is used here.
"""
from pathlib import Path
from urllib.request import Request, urlopen
import json
import re

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SOURCE = DATA / "source"
OUT = DATA / "case_content_fundamentals.csv"
CASES = DATA / "cases.csv"
CRATES_URL = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json"
CRATES_FILE = SOURCE / "bymykel_crates.json"
CASE_INDEX_URL = "https://www.csgodatabase.com/cases/"


def get_cached_crates():
    SOURCE.mkdir(parents=True, exist_ok=True)
    if CRATES_FILE.exists() and CRATES_FILE.stat().st_size > 100000:
        return json.loads(CRATES_FILE.read_text(encoding="utf-8"))
    req = Request(CRATES_URL, headers={"User-Agent": "CS2-case-content-research/1.0"})
    with urlopen(req, timeout=60) as resp:
        payload = resp.read()
    CRATES_FILE.write_bytes(payload)
    return json.loads(payload.decode("utf-8"))


def clean_name(value):
    value = str(value or "")
    value = re.sub(r"^\[[^\]]+\]\s*", "", value)
    return re.sub(r"\s+", " ", value).strip()


def item_name(item):
    if isinstance(item, str):
        return clean_name(item)
    return clean_name(item.get("name", ""))


def rarity_name(item):
    if not isinstance(item, dict):
        return ""
    rarity = item.get("rarity") or {}
    return str(rarity.get("name", ""))


def base_gold_type(name):
    # Static crates data lists individual finish variants, e.g. ★ Bayonet |
    # Fade. Keep the knife/glove family and remove the finish after the pipe.
    x = re.sub(r"^★\s*", "", name).strip()
    x = x.split(" | ", 1)[0].strip()
    x = re.sub(r"\s+\([^)]*\)$", "", x).strip()
    return x


def case_slug(name):
    # For source traceability, CSGO Database uses stable English slugs. This
    # mapping handles the 42 cases in the local CSQAQ case list.
    slugs = {
        "CS:GO Weapon Case": "csgo-weapon-case", "CS:GO Weapon Case 2": "csgo-weapon-case-2", "CS:GO Weapon Case 3": "csgo-weapon-case-3",
        "Operation Bravo Case": "operation-bravo-case", "Operation Breakout Weapon Case": "operation-breakout-weapon-case", "Operation Hydra Case": "operation-hydra-case",
        "Operation Phoenix Weapon Case": "operation-phoenix-weapon-case", "Operation Vanguard Weapon Case": "operation-vanguard-weapon-case", "Operation Wildfire Case": "operation-wildfire-case",
        "Operation Broken Fang Case": "operation-broken-fang-case", "Operation Riptide Case": "operation-riptide-case", "Shattered Web Case": "shattered-web-case",
        "eSports 2013 Case": "esports-2013-case", "eSports 2013 Winter Case": "esports-2013-winter-case", "eSports 2014 Summer Case": "esports-2014-summer-case",
        "Winter Offensive Weapon Case": "winter-offensive-weapon-case", "Huntsman Weapon Case": "huntsman-weapon-case", "Falchion Case": "falchion-case",
        "Chroma Case": "chroma-case", "Chroma 2 Case": "chroma-2-case", "Chroma 3 Case": "chroma-3-case", "Gamma Case": "gamma-case", "Gamma 2 Case": "gamma-2-case",
        "Glove Case": "glove-case", "Shadow Case": "shadow-case", "Revolver Case": "revolver-case", "Spectrum Case": "spectrum-case", "Spectrum 2 Case": "spectrum-2-case",
        "Clutch Case": "clutch-case", "Horizon Case": "horizon-case", "Danger Zone Case": "danger-zone-case", "Prisma Case": "prisma-case", "CS20 Case": "cs20-case",
        "Prisma 2 Case": "prisma-2-case", "Fracture Case": "fracture-case", "Snakebite Case": "snakebite-case", "Dreams & Nightmares Case": "dreams-nightmares-case",
        "Recoil Case": "recoil-case", "Revolution Case": "revolution-case", "Kilowatt Case": "kilowatt-case", "Gallery Case": "gallery-case", "Fever Case": "fever-case",
    }
    return slugs.get(name, "")


def main():
    cases = pd.read_csv(CASES, dtype={"good_id": str})
    crates = get_cached_crates()
    case_by_hash = {str(x.get("market_hash_name", "")): x for x in crates if x.get("type") == "Case"}

    # First collect normalized gold family sets, then compute exact alternative
    # pools among the same 42-case universe. This is an objective overlap
    # measure, not a subjective “good/bad” score.
    normalized = {}
    for _, row in cases.iterrows():
        en = str(row["market_hash_name"])
        obj = case_by_hash.get(en, {})
        rare = obj.get("contains_rare") or []
        normalized[en] = {base_gold_type(item_name(i)) for i in rare if item_name(i)}

    rows = []
    for _, row in cases.iterrows():
        cn = str(row["case_name"])
        en = str(row["market_hash_name"])
        obj = case_by_hash.get(en)
        if not obj:
            raise ValueError(f"public crates.json missing case: {en}")
        contains = obj.get("contains") or []
        reds = [item_name(i) for i in contains if rarity_name(i).lower() == "covert"]
        # Some versions use a localized/legacy rarity label; the red tier is
        # objectively identified by its canonical id/color when present.
        if not reds:
            for i in contains:
                rarity = i.get("rarity") or {} if isinstance(i, dict) else {}
                rid = str(rarity.get("id", "")).lower()
                color = str(rarity.get("color", "")).lower()
                if "ancient" in rid or color in {"#eb4b4b", "#d32ce6"}:
                    reds.append(item_name(i))
        gold = sorted(normalized[en])
        exact_alts = [other for other, pool in normalized.items() if other != en and pool == normalized[en]]
        overlaps = [other for other, pool in normalized.items() if other != en and normalized[en] & pool]
        gold_types = sorted({re.sub(r"\s+", " ", g).strip() for g in gold if g})
        # No subjective demand label: only mark objective content features.
        source_content = CRATES_URL
        source_case = f"{CASE_INDEX_URL}{case_slug(en)}/" if case_slug(en) else CASE_INDEX_URL
        content_note = "红皮名称/数量与金色特殊物品类型来自公开静态 crates.json；金池替代箱按本地42箱集合中的金色家族集合完全相同计算。"
        confidence = "medium"
        if not reds or not gold:
            confidence = "low"
            content_note += " 公开静态数据对该箱未提供完整对应字段，缺失部分留空。"
        rows.append({
            "case_name": cn,
            "good_id": str(row["good_id"]),
            "market_hash_name": en,
            "gold_pool_type": "手套" if any("Glove" in g for g in gold_types) else ("刀" if gold_types else ""),
            "gold_pool_categories": "; ".join(gold_types),
            "gold_pool_category_count": len(gold_types),
            "red_skin_count": len(reds),
            "red_skin_names": "; ".join(reds),
            "high_demand_gold": "unknown",
            "high_demand_gold_basis": "未找到可统一、可审计的逐箱开箱需求证据；不凭印象标注热门/高需求。",
            "exclusive_or_scarce_gold": "unknown" if not gold_types else ("yes_within_42_case_dataset" if not overlaps else "no_clear_exclusivity_within_42"),
            "same_gold_pool_alternative_case_count": len(exact_alts),
            "same_gold_pool_alternative_cases": "; ".join(sorted(exact_alts)),
            "gold_pool_overlap_case_count": len(overlaps),
            "key_cost": "",
            "key_cost_currency": "",
            "opening_heat_proxy": "",
            "opening_heat_proxy_value": "",
            "opening_heat_proxy_note": "未填：市场成交/在售量不是开箱量，未找到统一且可审计的42箱开箱量面板。",
            "content_source": source_content,
            "case_page_source": source_case,
            "gold_pool_source": source_content,
            "gold_pool_confidence": confidence,
            "red_skins_source": source_content,
            "red_skins_confidence": confidence,
            "high_demand_gold_source": "",
            "high_demand_gold_confidence": "low",
            "exclusive_gold_source": source_content,
            "exclusive_gold_confidence": confidence,
            "alternative_source": source_content,
            "alternative_confidence": confidence,
            "key_cost_source": "",
            "key_cost_confidence": "low",
            "opening_heat_source": "",
            "opening_heat_confidence": "low",
            "content_confidence": confidence,
            "source_notes": content_note,
        })
    out = pd.DataFrame(rows)
    out.to_csv(OUT, index=False, encoding="utf-8-sig")
    print(f"cases={len(out)} source_cache={CRATES_FILE} output={OUT}")
    print(out[["gold_pool_type", "red_skin_count", "exclusive_or_scarce_gold"]].value_counts().to_string())


if __name__ == "__main__":
    main()
