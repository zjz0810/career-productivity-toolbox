import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const API_BASE = "https://api.csqaq.com";
const INVENTORY_FILE = path.join(ROOT, "data", "knife_current_inventory_rechecked.csv");
const RAW_ROOT = path.join(ROOT, "data", "raw", "knives");
const SOURCE_ROOT = path.join(ROOT, "data", "source");
const LOG_FILE = path.join(ROOT, "data", "knife_sell_num_fetch_log.csv");
const FAILURE_FILE = path.join(ROOT, "data", "knife_sell_num_failures.csv");
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 3000;
const MIN_REQUEST_INTERVAL_MS = 1000;
const REQUEST_TIMEOUT_MS = 30000;
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

async function readCsv(file) {
  const text = await fs.readFile(file, "utf8");
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.replace(/^\ufeff/, ""));
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

async function readCsvOptional(file, columns) {
  try { return await readCsv(file); }
  catch { await writeCsv(file, [], columns); return []; }
}

async function writeCsv(file, rows, columns) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const text = `\ufeff${columns.join(",")}\n${rows.map((r) => columns.map((c) => csvEscape(r[c])).join(",")).join("\n")}\n`;
  await fs.writeFile(file, text, "utf8");
}

async function appendCsv(file, row, columns) {
  const rows = await readCsvOptional(file, columns);
  rows.push(row);
  await writeCsv(file, rows, columns);
}

function safePart(value) {
  return String(value).replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 160);
}

function localDate(timestamp) {
  const n = Number(timestamp);
  const date = new Date(n < 1e12 ? n * 1000 : n);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

function redact(text, token) {
  return String(text ?? "").replaceAll(token || "__NO_TOKEN__", "[REDACTED]");
}

async function readToken() {
  const text = await fs.readFile(path.join(ROOT, ".env"), "utf8");
  const line = text.split(/\r?\n/).find((x) => /^\s*CSQAQ_API_TOKEN\s*=/.test(x));
  const token = line?.replace(/^\s*CSQAQ_API_TOKEN\s*=\s*/, "").trim().replace(/^"|"$/g, "");
  if (!token) throw new Error("CSQAQ_API_TOKEN 未填写");
  return token;
}

async function requestJson(token, body) {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const wait = Math.max(0, MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt));
      if (wait) await sleep(wait);
      lastRequestAt = Date.now();
      const response = await fetch(`${API_BASE}/api/v1/info/chart`, {
        method: "POST",
        headers: { ApiToken: token, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();
      const preview = redact(text.slice(0, 300), token);
      if (!response.ok) throw new Error(`HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType} BODY_PREFIX=${preview}`);
      if (!contentType.toLowerCase().includes("json")) throw new Error(`NON_JSON_CONTENT_TYPE=${contentType} BODY_PREFIX=${preview}`);
      let payload;
      try { payload = JSON.parse(text); }
      catch (error) { throw new Error(`JSON_PARSE_ERROR CONTENT_TYPE=${contentType} BODY_PREFIX=${preview} DETAIL=${error.message}`); }
      if (Number(payload?.code) !== 200) throw new Error(`CSQAQ_API_CODE_ERROR code=${payload?.code ?? ""} BODY_PREFIX=${preview}`);
      return payload;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  }
  throw new Error(`ATTEMPTS=${MAX_ATTEMPTS} ${lastError?.message || "unknown"}`);
}

function chartRows(payload, item, platform) {
  const data = payload?.data || {};
  const timestamps = Array.isArray(data.timestamp) ? data.timestamp : [];
  const values = Array.isArray(data.main_data) ? data.main_data : [];
  const byDate = new Map();
  for (let i = 0; i < Math.min(timestamps.length, values.length); i += 1) {
    const date = localDate(timestamps[i]);
    const sellNum = Number(values[i]);
    if (!date || !Number.isFinite(sellNum) || sellNum < 0) continue;
    byDate.set(date, { date, sell_num: sellNum, platform, good_id: item.good_id, item_name: item.中文名 });
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function complete(rows, item, platform) {
  return rows.length > 0 && rows.every((r) => Number(r.good_id) === Number(item.good_id)
    && Number(r.platform) === platform && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && Number(r.sell_num) >= 0);
}

const token = await readToken();
const inventory = await readCsv(INVENTORY_FILE);
const candidates = inventory.filter((r) => Number(r.BUFF当前在售数量) >= 60 && Number(r.悠悠当前在售数量) >= 60);
if (candidates.length !== 48) throw new Error(`双平台在售≥60的数量不是48: ${candidates.length}`);

const logColumns = ["timestamp", "中文名", "good_id", "platform", "数据点数", "最早日期", "最晚日期", "status", "file"];
const failureColumns = ["timestamp", "中文名", "good_id", "platform", "stage", "attempts", "error"];
await fs.mkdir(path.join(RAW_ROOT, "buff_sell_num"), { recursive: true });
await fs.mkdir(path.join(RAW_ROOT, "yyyp_sell_num"), { recursive: true });
const logs = await readCsvOptional(LOG_FILE, logColumns);
const failures = await readCsvOptional(FAILURE_FILE, failureColumns);

for (const item of candidates) {
  for (const platform of [1, 2]) {
    const folder = platform === 1 ? "buff_sell_num" : "yyyp_sell_num";
    const file = path.join(RAW_ROOT, folder, `${safePart(item.good_id)}_${safePart(item.中文名)}.csv`);
    const existing = await readCsvOptional(file, ["date", "sell_num", "platform", "good_id", "item_name"]);
    if (complete(existing, item, platform)) {
      console.log(`SKIP good_id=${item.good_id} platform=${platform} complete`);
      continue;
    }
    try {
      const payload = await requestJson(token, { good_id: Number(item.good_id), key: "sell_num", platform, period: 1095, style: "all_style" });
      const rows = chartRows(payload, item, platform);
      if (!rows.length) throw new Error(`EMPTY_HISTORY good_id=${item.good_id} platform=${platform}`);
      await writeCsv(file, rows, ["date", "sell_num", "platform", "good_id", "item_name"]);
      await appendCsv(LOG_FILE, {
        timestamp: new Date().toISOString(), 中文名: item.中文名, good_id: item.good_id, platform,
        数据点数: rows.length, 最早日期: rows[0].date, 最晚日期: rows.at(-1).date, status: "success", file: path.relative(ROOT, file),
      }, logColumns);
      console.log(`SUCCESS good_id=${item.good_id} platform=${platform} points=${rows.length} earliest=${rows[0].date} latest=${rows.at(-1).date}`);
    } catch (error) {
      const safeError = redact(error?.message || error, token);
      await appendCsv(FAILURE_FILE, {
        timestamp: new Date().toISOString(), 中文名: item.中文名, good_id: item.good_id, platform,
        stage: "get_item_chart_sell_num", attempts: MAX_ATTEMPTS, error: safeError,
      }, failureColumns);
      console.error(`FAIL good_id=${item.good_id} platform=${platform} after ${MAX_ATTEMPTS} attempts`);
    }
  }
}

await fs.writeFile(path.join(SOURCE_ROOT, "knife_sell_num_fetch_manifest.json"), JSON.stringify({
  source: "CSQAQ official API",
  endpoint: "/api/v1/info/chart",
  chart_parameters: { key: "sell_num", period: 1095, style: "all_style", platforms: { "1": "BUFF", "2": "悠悠有品" } },
  candidate_count: candidates.length,
  fetched_at: new Date().toISOString(),
  retry_policy: { max_attempts: MAX_ATTEMPTS, retry_delay_seconds: RETRY_DELAY_MS / 1000, min_request_interval_seconds: MIN_REQUEST_INTERVAL_MS / 1000, timeout_seconds: REQUEST_TIMEOUT_MS / 1000 },
}, null, 2) + "\n", "utf8");
console.log(`DONE candidates=${candidates.length} failures=${failures.length}`);
