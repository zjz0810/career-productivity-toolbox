import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const API_BASE = "https://api.csqaq.com";
const TOKEN_FILE = path.join(ROOT, ".env");
const RUN_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date()).replaceAll("-", "");
const RAW_FILE = path.join(ROOT, "data", "source", `yyyp_knives_rank_${RUN_DATE}.json`);
const OUT_FILE = path.join(ROOT, "data", `yyyp_knives_under_1000_sellnum_gt40_${RUN_DATE}.csv`);
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 3000;
const MIN_INTERVAL_MS = 1000;
const TIMEOUT_MS = 30000;
let lastRequestAt = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function csvEscape(value) {
  if (value == null) return "";
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

async function readToken() {
  const text = await fs.readFile(TOKEN_FILE, "utf8");
  const line = text.split(/\r?\n/).find((x) => /^\s*CSQAQ_API_TOKEN\s*=/.test(x));
  const token = line?.replace(/^\s*CSQAQ_API_TOKEN\s*=\s*/, "").trim().replace(/^"|"$/g, "");
  if (!token) throw new Error("CSQAQ_API_TOKEN 未填写");
  return token;
}

async function requestPage(token, page) {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastRequestAt));
      if (wait) await sleep(wait);
      lastRequestAt = Date.now();
      const response = await fetch(`${API_BASE}/api/v1/info/get_rank_list`, {
        method: "POST",
        headers: { ApiToken: token, "Content-Type": "application/json" },
        body: JSON.stringify({ page_index: page, page_size: 500, filter: { "类型": ["不限_匕首"] }, show_recently_price: false }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();
      if (!response.ok) throw new Error(`HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType}`);
      if (!contentType.toLowerCase().includes("json")) throw new Error(`NON_JSON_CONTENT_TYPE=${contentType}`);
      const payload = JSON.parse(text);
      if (Number(payload?.code) !== 200) throw new Error(`CSQAQ_API_CODE_ERROR code=${payload?.code ?? ""}`);
      return payload;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  }
  throw new Error(`page=${page} ATTEMPTS=${MAX_ATTEMPTS} ${lastError?.message || "unknown"}`);
}

const token = await readToken();
const allRows = [];
let page = 1;
let pages = 0;
while (true) {
  const payload = await requestPage(token, page);
  const rows = payload.data?.data || [];
  allRows.push(...rows);
  pages = page;
  console.log(`PAGE ${page} rows=${rows.length}`);
  if (rows.length < 500) break;
  page += 1;
}

const unique = [...new Map(allRows.map((row) => [Number(row.id), row])).values()];
const selected = unique
  .filter((row) => Number(row.yyyp_sell_price) > 0 && Number(row.yyyp_sell_price) <= 1000 && Number(row.yyyp_sell_num) > 40)
  .sort((a, b) => Number(b.yyyp_sell_num) - Number(a.yyyp_sell_num));

let englishById = {};
try {
  const search = JSON.parse(await fs.readFile(path.join(ROOT, "all_items_search.json"), "utf8"));
  englishById = search.data?.data || {};
} catch { /* English name remains blank if the existing local cache is absent. */ }

const columns = [
  "good_id", "中文名", "英文名", "磨损", "悠悠最低售价", "悠悠在售数量", "悠悠求购价", "悠悠求购数量",
  "BUFF最低售价", "BUFF在售数量", "BUFF求购价", "Steam在售数量", "Steam求购数量", "Steam日成交量代理",
  "BUFF涨跌1日", "BUFF涨跌7日", "BUFF涨跌30日", "BUFF涨跌90日", "BUFF涨跌365日",
  "BUFF涨跌率1日", "BUFF涨跌率7日", "BUFF涨跌率30日", "BUFF涨跌率90日", "BUFF涨跌率365日",
  "rank_num", "snapshot_time", "source_endpoint",
];
const output = selected.map((row) => ({
  good_id: row.id,
  中文名: row.name,
  英文名: englishById[String(row.id)]?.market_hash_name || "",
  磨损: row.exterior_localized_name,
  悠悠最低售价: row.yyyp_sell_price,
  悠悠在售数量: row.yyyp_sell_num,
  悠悠求购价: row.yyyp_buy_price,
  悠悠求购数量: row.yyyp_buy_num,
  BUFF最低售价: row.buff_sell_price,
  BUFF在售数量: row.buff_sell_num,
  BUFF求购价: row.buff_buy_price,
  Steam在售数量: row.steam_sell_num,
  Steam求购数量: row.steam_buy_num,
  Steam日成交量代理: row.statistic,
  BUFF涨跌1日: row.sell_price_1,
  BUFF涨跌7日: row.sell_price_7,
  BUFF涨跌30日: row.sell_price_30,
  BUFF涨跌90日: row.sell_price_90,
  BUFF涨跌365日: row.sell_price_365,
  BUFF涨跌率1日: row.sell_price_rate_1,
  BUFF涨跌率7日: row.sell_price_rate_7,
  BUFF涨跌率30日: row.sell_price_rate_30,
  BUFF涨跌率90日: row.sell_price_rate_90,
  BUFF涨跌率365日: row.sell_price_rate_365,
  rank_num: row.rank_num,
  snapshot_time: row.created_at,
  source_endpoint: "/api/v1/info/get_rank_list",
}));

await fs.mkdir(path.dirname(RAW_FILE), { recursive: true });
await fs.writeFile(RAW_FILE, JSON.stringify({
  source: "CSQAQ official API",
  endpoint: "/api/v1/info/get_rank_list",
  query: { page_size: 500, filter: { "类型": ["不限_匕首"] } },
  fetched_at: new Date().toISOString(),
  pages,
  raw_row_count: allRows.length,
  unique_row_count: unique.length,
  selected_count: selected.length,
  rows: allRows,
}, null, 2) + "\n", "utf8");
await fs.writeFile(OUT_FILE, `\ufeff${columns.join(",")}\n${output.map((row) => columns.map((c) => csvEscape(row[c])).join(",")).join("\n")}\n`, "utf8");
console.log(`DONE pages=${pages} raw=${allRows.length} unique=${unique.length} selected=${selected.length}`);
