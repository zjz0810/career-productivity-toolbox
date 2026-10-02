import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");
const SOURCE = path.join(DATA, "source");
const API_BASE = "https://api.csqaq.com";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const MIN_REQUEST_INTERVAL_MS = 1000;
const MAX_ATTEMPTS = 3;
let lastRequestAt = 0;

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function splitCsvLine(line) {
  const out = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (c === "," && !quoted) { out.push(value); value = ""; }
    else value += c;
  }
  out.push(value);
  return out;
}

async function readCsv(file) {
  const text = await fs.readFile(file, "utf8");
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

async function readToken() {
  const text = await fs.readFile(path.join(ROOT, ".env"), "utf8");
  const line = text.split(/\r?\n/).find((x) => /^\s*CSQAQ_API_TOKEN\s*=/.test(x));
  const token = line?.replace(/^\s*CSQAQ_API_TOKEN\s*=\s*/, "").trim().replace(/^"|"$/g, "");
  if (!token) throw new Error("CSQAQ_API_TOKEN 未填写");
  return token;
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function isExcluded(name) {
  const terms = [
    "多普勒", "伽玛多普勒", "渐变之色", "虎牙", "表面淬火", "宝石", "特殊模板",
    "Doppler", "Gamma Doppler", "Fade", "Tiger Tooth", "Case Hardened",
    "Sapphire", "Ruby", "Black Pearl", "Emerald", "StatTrak", "StatTrak™",
  ];
  return terms.some((term) => name.toLowerCase().includes(term.toLowerCase()));
}

function isStandard(row) {
  const name = String(row.name || "");
  return !isExcluded(name)
    && ["久经沙场", "略有磨损"].includes(row.exterior_localized_name)
    && number(row.buff_sell_num) >= 60
    && number(row.buff_sell_price) > 0 && number(row.buff_sell_price) <= 1500
    && number(row.yyyp_sell_price) > 0 && number(row.yyyp_sell_price) <= 1500;
}

function groupKey(name) {
  const parts = String(name).split("|");
  const type = parts[0]?.trim() || "";
  const finish = (parts.slice(1).join("|") || "").replace(/\s*[（(][^（）()]*[）)]\s*$/, "").trim();
  return `${type}|${finish}`;
}

function typeOf(name) { return String(name).split("（★")[0].trim(); }
function finishOf(name) {
  return (String(name).split("|").slice(1).join("|") || "").replace(/\s*[（(][^（）()]*[）)]\s*$/, "").trim();
}

async function requestDetail(token, id) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const wait = Math.max(0, MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt));
      if (wait) await sleep(wait);
      lastRequestAt = Date.now();
      const response = await fetch(`${API_BASE}/api/v1/info/good?id=${encodeURIComponent(id)}`, { headers: { ApiToken: token } });
      const contentType = response.headers.get("content-type") || "";
      const body = await response.text();
      if (!response.ok) throw new Error(`HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType}`);
      if (!contentType.toLowerCase().includes("json")) throw new Error(`NON_JSON_CONTENT_TYPE=${contentType}`);
      const parsed = JSON.parse(body);
      if (Number(parsed?.code) !== 200) throw new Error(`CSQAQ_API_CODE_ERROR code=${parsed?.code ?? ""}`);
      return parsed.data?.goods_info || {};
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) await sleep(3000);
    }
  }
  throw new Error(`ATTEMPTS=${MAX_ATTEMPTS} ${lastError?.message || "unknown"}`);
}

const token = await readToken();
const oldRows = await readCsv(path.join(DATA, "knife_candidates.csv"));
const originalIds = new Set(oldRows.map((x) => Number(x.good_id)).filter(Number.isFinite));
const probeFiles = ["knife_rank_probe.json", "knife_rank_probe_dagger.json"];
const catalogRows = [];
for (const file of probeFiles) {
  const payload = JSON.parse(await fs.readFile(path.join(SOURCE, file), "utf8"));
  catalogRows.push(...(payload.data?.data || []));
}
const unique = [...new Map(catalogRows.map((row) => [Number(row.id), row])).values()];
const candidates = unique.filter(isStandard).filter((row) => !originalIds.has(Number(row.id)));
const byGroup = new Map();
for (const row of candidates) {
  const key = groupKey(row.name);
  const prior = byGroup.get(key);
  if (!prior || number(row.buff_sell_num) > number(prior.buff_sell_num)) byGroup.set(key, row);
}
const selected = [...byGroup.values()].sort((a, b) => number(b.buff_sell_num) - number(a.buff_sell_num));

const failures = [];
const newRows = [];
for (const row of selected) {
  try {
    const detail = await requestDetail(token, Number(row.id));
    newRows.push({
      中文名: detail.name || row.name,
      英文名: detail.market_hash_name || "",
      磨损: detail.exterior_localized_name || row.exterior_localized_name,
      good_id: detail.id || row.id,
      刀型: typeOf(detail.name || row.name),
      涂装: finishOf(detail.name || row.name),
      BUFF价格: row.buff_sell_price,
      悠悠价格: row.yyyp_sell_price,
      BUFF在售数量: row.buff_sell_num,
      悠悠在售数量: row.yyyp_sell_num,
      Steam日成交量: detail.turnover_number ?? "",
      是否能获得1095天历史: "待抓取",
      是否为原26样本: "否",
      筛选说明: "CSQAQ get_rank_list 当前快照：BUFF在售≥60；两平台价格≤1500；标准磨损；排除StatTrak及特殊涂装；同刀型+涂装保留BUFF在售量更高的磨损。",
      价格快照时间: row.created_at || new Date().toISOString(),
    });
    console.log(`DETAIL ${row.id} ok`);
  } catch (error) {
    failures.push({ good_id: row.id, 中文名: row.name, error: String(error.message || error) });
    console.error(`DETAIL ${row.id} failed; skipped`);
  }
}

const existing = oldRows.map((row) => ({ ...row, 涂装: row.涂装 || finishOf(row.中文名), 是否为原26样本: "是" }));
const columns = ["good_id", "中文名", "英文名", "刀型", "涂装", "磨损", "BUFF价格", "BUFF在售数量", "悠悠价格", "悠悠在售数量", "Steam日成交量", "是否能获得1095天历史", "是否为原26样本", "筛选说明", "价格快照时间"];
const all = [...existing, ...newRows].sort((a, b) => number(b.BUFF在售数量) - number(a.BUFF在售数量));
const csv = [columns.join(","), ...all.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n") + "\n";
await fs.writeFile(path.join(DATA, "knife_candidates_expanded.csv"), csv, "utf8");
await fs.writeFile(path.join(DATA, "knife_candidates_expanded.json"), JSON.stringify({ source: "CSQAQ get_rank_list + get_item_detail", fetched_at: new Date().toISOString(), original_count: existing.length, new_count: newRows.length, total_count: all.length, new_selection_count: selected.length, failures }, null, 2) + "\n", "utf8");
const failureCsv = ["good_id,中文名,error", ...failures.map((row) => [row.good_id, row.中文名, row.error].map(csvEscape).join(","))].join("\n") + "\n";
await fs.writeFile(path.join(DATA, "knife_candidate_discovery_failures.csv"), failureCsv, "utf8");
console.log(`EXPANDED original=${existing.length} new=${newRows.length} total=${all.length} selected=${selected.length} failures=${failures.length}`);
