import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const API_BASE = "https://api.csqaq.com";
const CANDIDATE_FILE = path.join(ROOT, process.env.KNIFE_CANDIDATE_FILE || "data/knife_candidates.csv");
const RAW_ROOT = path.join(ROOT, "data", "raw", "knives");
const SOURCE_ROOT = path.join(ROOT, "data", "source");
const LOG_FILE = path.join(ROOT, "data", "knife_fetch_log.csv");
const FAILURE_FILE = path.join(ROOT, "data", "knife_failures.csv");
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 3000;
const MIN_REQUEST_INTERVAL_MS = 1000;
const REQUEST_TIMEOUT_MS = 30000;
let lastRequestAt = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) { out.push(value); value = ""; }
    else value += char;
  }
  out.push(value);
  return out;
}

async function readCsv(filename) {
  try {
    const text = await fs.readFile(filename, "utf8");
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = splitCsvLine(lines[0]);
    return lines.slice(1).map((line) => Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""])))
      .map((row) => row);
  } catch { return []; }
}

async function readCsvSafe(filename) {
  try {
    const text = await fs.readFile(filename, "utf8");
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = splitCsvLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = splitCsvLine(line);
      return Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""]));
    });
  } catch { return []; }
}

async function writeCsv(filename, rows, columns) {
  const text = [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n") + "\n";
  await fs.writeFile(filename, text, "utf8");
}

async function readToken() {
  const text = await fs.readFile(path.join(ROOT, ".env"), "utf8");
  const line = text.split(/\r?\n/).find((item) => /^\s*CSQAQ_API_TOKEN\s*=/.test(item));
  const token = line?.replace(/^\s*CSQAQ_API_TOKEN\s*=\s*/, "").trim().replace(/^"|"$/g, "");
  if (!token) throw new Error("CSQAQ_API_TOKEN 未填写");
  return token;
}

function safeFilePart(value) {
  return String(value).replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 160);
}

function localDate(timestamp) {
  const numeric = Number(timestamp);
  const milliseconds = numeric < 1e12 ? numeric * 1000 : numeric;
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function sanitize(text, token) {
  return String(text ?? "").replaceAll(token || "__NO_TOKEN__", "[REDACTED]");
}

async function requestJson(token, body) {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const waitMs = Math.max(0, MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt));
      if (waitMs > 0) await sleep(waitMs);
      lastRequestAt = Date.now();
      const url = `${API_BASE}/api/v1/info/chart`;
      const response = await fetch(url, {
        method: "POST",
        headers: { ApiToken: token, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();
      const preview = sanitize(text.slice(0, 300), token);
      if (!response.ok) throw new Error(`HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType} BODY_PREFIX=${preview}`);
      if (!contentType.toLowerCase().includes("json")) throw new Error(`NON_JSON_CONTENT_TYPE HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType} BODY_PREFIX=${preview}`);
      let parsed;
      try { parsed = JSON.parse(text); }
      catch (error) { throw new Error(`JSON_PARSE_ERROR HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType} BODY_PREFIX=${preview} DETAIL=${error.message}`); }
      if (Number(parsed?.code) !== 200) throw new Error(`CSQAQ_API_CODE_ERROR code=${parsed?.code ?? ""} BODY_PREFIX=${preview}`);
      return parsed;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  }
  throw new Error(`ATTEMPTS=${MAX_ATTEMPTS} ${lastError?.message || "unknown error"}`);
}

function chartRows(payload, item, platform) {
  const data = payload?.data || {};
  const timestamps = Array.isArray(data.timestamp) ? data.timestamp : [];
  const prices = Array.isArray(data.main_data) ? data.main_data : [];
  const byDate = new Map();
  for (let i = 0; i < Math.min(timestamps.length, prices.length); i += 1) {
    const date = localDate(timestamps[i]);
    const price = Number(prices[i]);
    if (!date || !Number.isFinite(price) || price <= 0) continue;
    byDate.set(date, { date, price, platform, good_id: item.good_id, item_name: item.中文名 });
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function isComplete(rows, item, platform) {
  return rows.length > 0 && rows.every((row) => Number(row.good_id) === Number(item.good_id) && Number(row.platform) === platform && /^\d{4}-\d{2}-\d{2}$/.test(row.date) && Number(row.price) > 0);
}

async function appendCsvRow(filename, row, columns) {
  const existing = await readCsvSafe(filename);
  existing.push(row);
  await writeCsv(filename, existing, columns);
}

const token = await readToken();
const candidates = await readCsvSafe(CANDIDATE_FILE);
if (!candidates.length) throw new Error("data/knife_candidates.csv 为空或不存在");
await fs.mkdir(path.join(RAW_ROOT, "buff"), { recursive: true });
await fs.mkdir(path.join(RAW_ROOT, "yyyp"), { recursive: true });
await fs.mkdir(SOURCE_ROOT, { recursive: true });

const logColumns = ["timestamp", "中文名", "good_id", "platform", "数据点数", "最早日期", "最晚日期", "status", "file"];
const failureColumns = ["timestamp", "中文名", "good_id", "platform", "stage", "attempts", "error"];
const fetchLog = await readCsvSafe(LOG_FILE);
const failures = await readCsvSafe(FAILURE_FILE);
if (!(await fs.stat(FAILURE_FILE).catch(() => null))) await writeCsv(FAILURE_FILE, [], failureColumns);

for (const item of candidates) {
  for (const platform of [1, 2]) {
    const folderName = platform === 1 ? "buff" : "yyyp";
    const file = path.join(RAW_ROOT, folderName, `${safeFilePart(item.good_id)}_${safeFilePart(item.中文名)}.csv`);
    const existing = await readCsvSafe(file);
    if (isComplete(existing, item, platform)) {
      console.error(`跳过已存在完整文件：${item.中文名} platform=${platform}`);
      continue;
    }
    try {
      const payload = await requestJson(token, { good_id: Number(item.good_id), key: "sell_price", platform, period: 1095, style: "all_style" });
      const rows = chartRows(payload, item, platform);
      if (!rows.length) throw new Error(`EMPTY_HISTORY good_id=${item.good_id} platform=${platform}`);
      await writeCsv(file, rows, ["date", "price", "platform", "good_id", "item_name"]);
      const summary = {
        timestamp: new Date().toISOString(), 中文名: item.中文名, good_id: item.good_id, platform,
        数据点数: rows.length, 最早日期: rows[0].date, 最晚日期: rows.at(-1).date, status: "success", file: path.relative(ROOT, file),
      };
      await appendCsvRow(LOG_FILE, summary, logColumns);
      console.log(`SUCCESS ${item.中文名} platform=${platform} points=${rows.length} earliest=${rows[0].date} latest=${rows.at(-1).date}`);
    } catch (error) {
      const failure = {
        timestamp: new Date().toISOString(), 中文名: item.中文名, good_id: item.good_id, platform,
        stage: "get_item_chart", attempts: MAX_ATTEMPTS, error: sanitize(error.message || error, token),
      };
      await appendCsvRow(FAILURE_FILE, failure, failureColumns);
      console.error(`FAIL ${item.中文名} platform=${platform}：已重试 ${MAX_ATTEMPTS} 次，继续下一个标的`);
    }
  }
}

await fs.writeFile(path.join(SOURCE_ROOT, "knife_fetch_manifest.json"), JSON.stringify({
  source: "CSQAQ official API",
  endpoint: "/api/v1/info/chart",
  chart_parameters: { key: "sell_price", period: 1095, style: "all_style", platforms: { "1": "BUFF", "2": "悠悠有品" } },
  candidate_count: candidates.length,
  fetched_at: new Date().toISOString(),
  retry_policy: { max_attempts: MAX_ATTEMPTS, retry_delay_seconds: RETRY_DELAY_MS / 1000, min_request_interval_seconds: MIN_REQUEST_INTERVAL_MS / 1000, timeout_seconds: REQUEST_TIMEOUT_MS / 1000 },
}, null, 2) + "\n", "utf8");

console.log(`抓取流程完成：候选 ${candidates.length} 个；详情日志 ${path.relative(ROOT, LOG_FILE)}；失败日志 ${path.relative(ROOT, FAILURE_FILE)}。`);
