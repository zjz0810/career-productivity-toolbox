import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

// Same official CSQAQ endpoints as the MCP server. Direct HTTP is used here
// because the MCP wrapper previously attempted res.json() on an HTML response.
const ROOT = process.cwd();
const API_BASE = "https://api.csqaq.com";
const DATA_DIR = path.join(ROOT, "data");
const RAW_DIR = path.join(DATA_DIR, "raw");
const SOURCE_DIR = path.join(DATA_DIR, "source");
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

function toDate(timestamp) {
  const numeric = Number(timestamp);
  const ms = numeric < 1e12 ? numeric * 1000 : numeric;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function safeFilePart(value) {
  return String(value).replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 120);
}

function sanitize(value, token) {
  return String(value ?? "").replaceAll(token || "__NO_TOKEN__", "[REDACTED]");
}

async function readApiToken() {
  const content = await fs.readFile(path.join(ROOT, ".env"), "utf8");
  const line = content.split(/\r?\n/).find((item) => /^\s*CSQAQ_API_TOKEN\s*=/.test(item));
  const token = line?.replace(/^\s*CSQAQ_API_TOKEN\s*=\s*/, "").trim().replace(/^"|"$/g, "");
  if (!token) throw new Error("CSQAQ_API_TOKEN 未填写");
  return token;
}

async function requestJson(token, method, endpoint, body = undefined) {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const waitMs = Math.max(0, MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt));
      if (waitMs > 0) await sleep(waitMs);
      lastRequestAt = Date.now();
      const url = `${API_BASE}${endpoint}`;
      const response = await fetch(url, {
        method,
        headers: { ApiToken: token, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();
      const preview = sanitize(text.slice(0, 300), token);
      if (!response.ok) throw new Error(`HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType} URL=${url} BODY_PREFIX=${preview}`);
      if (!contentType.toLowerCase().includes("json")) throw new Error(`NON_JSON_CONTENT_TYPE HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType} URL=${url} BODY_PREFIX=${preview}`);
      let parsed;
      try { parsed = JSON.parse(text); }
      catch (error) { throw new Error(`JSON_PARSE_ERROR HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType} URL=${url} BODY_PREFIX=${preview} DETAIL=${error.message}`); }
      if (Number(parsed?.code) !== 200) throw new Error(`CSQAQ_API_CODE_ERROR HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType} URL=${url} BODY_PREFIX=${preview}`);
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
    const date = toDate(timestamps[i]);
    const price = Number(prices[i]);
    if (!date || !Number.isFinite(price) || price <= 0) continue;
    byDate.set(date, { date, price, platform, good_id: item.good_id, case_name: item.case_name });
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

async function writeCsv(filename, rows, columns) {
  const text = [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n") + "\n";
  await fs.writeFile(filename, text, "utf8");
}

async function readCsv(filename) {
  try {
    const content = await fs.readFile(filename, "utf8");
    const lines = content.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = splitCsvLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = splitCsvLine(line);
      return Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""]));
    });
  } catch { return []; }
}

async function isCompleteHistory(filename, goodId, platform) {
  const rows = await readCsv(filename);
  return rows.length > 0 && rows.every((row) => Number(row.good_id) === Number(goodId) && Number(row.platform) === Number(platform) && row.date && Number(row.price) > 0);
}

async function loadJson(filename, fallback) {
  try { return JSON.parse(await fs.readFile(filename, "utf8")); }
  catch { return fallback; }
}

async function saveCasesCsv(cases) {
  await writeCsv(path.join(DATA_DIR, "cases.csv"), cases, [
    "case_name", "good_id", "market_hash_name", "case_type", "release_date", "buff_price_current", "yyyp_price_current",
    "buff_buy_price_current", "yyyp_buy_price_current", "buff_sell_num_current", "yyyp_sell_num_current", "roi_price", "roi_rate",
    "roi_income", "roi_num", "roi_updated_at", "detail_updated_at", "source", "case_id",
  ]);
}

async function saveFetchLog(log) {
  await writeCsv(path.join(DATA_DIR, "fetch_log.csv"), log, ["case_name", "good_id", "platform", "points", "earliest_date", "latest_date", "status", "timestamp"]);
}

async function appendFailure(row, failures) {
  failures.push(row);
  await writeCsv(path.join(DATA_DIR, "failures.csv"), failures, ["timestamp", "case_name", "good_id", "platform", "stage", "attempts", "error"]);
}

function summary(caseName, platform, rows) {
  return { case_name: caseName, platform, points: rows.length, earliest: rows[0]?.date || "", latest: rows.at(-1)?.date || "", latest_price: rows.at(-1)?.price ?? "" };
}

const token = await readApiToken();
await fs.mkdir(path.join(RAW_DIR, "buff"), { recursive: true });
await fs.mkdir(path.join(RAW_DIR, "yyyp"), { recursive: true });
await fs.mkdir(SOURCE_DIR, { recursive: true });

const roiResponse = await requestJson(token, "POST", "/api/v1/info/roi", {});
const roi = Array.isArray(roiResponse.data) ? roiResponse.data : [];
const selectedCases = [...new Map(roi
  .filter((item) => typeof item.name === "string" && item.name.includes("武器箱"))
  .filter((item) => Number.isFinite(Number(item.good_id)) && Number(item.good_id) > 0)
  .map((item) => [Number(item.good_id), {
    case_id: item.id ?? "", case_name: item.name, good_id: Number(item.good_id), case_type: item.comment ?? "",
    release_date: item.created_at ? String(item.created_at).slice(0, 10) : "", roi_price: item.price ?? "", roi_rate: item.roi ?? "",
    roi_income: item.income ?? "", roi_num: item.num ?? "", roi_updated_at: item.updated_at ?? "",
  }]))].map(([, item]) => item).sort((a, b) => a.good_id - b.good_id);

const metadataPath = path.join(SOURCE_DIR, "cases_metadata.json");
const metadataById = new Map((await loadJson(metadataPath, [])).map((item) => [Number(item.good_id), item]));
const fetchLogPath = path.join(SOURCE_DIR, "fetch_log.json");
const fetchLog = await loadJson(fetchLogPath, []);
const failures = await readCsv(path.join(DATA_DIR, "failures.csv"));
const mode = process.argv[2] || "--batch";

async function getMetadata(item) {
  const existing = metadataById.get(item.good_id);
  if (existing?.buff_price_current !== undefined && existing?.yyyp_price_current !== undefined) return existing;
  const detail = await requestJson(token, "GET", `/api/v1/info/good?id=${encodeURIComponent(item.good_id)}`);
  const goods = detail.data?.goods_info || {};
  const combined = {
    ...item, market_hash_name: goods.market_hash_name ?? "", buff_price_current: goods.buff_sell_price ?? "", yyyp_price_current: goods.yyyp_sell_price ?? "",
    buff_buy_price_current: goods.buff_buy_price ?? "", yyyp_buy_price_current: goods.yyyp_buy_price ?? "", buff_sell_num_current: goods.buff_sell_num ?? "",
    yyyp_sell_num_current: goods.yyyp_sell_num ?? "", detail_updated_at: goods.updated_at ?? "",
    source: "CSQAQ official API: /api/v1/info/roi + /api/v1/info/good + /api/v1/info/chart",
  };
  metadataById.set(item.good_id, combined);
  await fs.writeFile(metadataPath, JSON.stringify([...metadataById.values()], null, 2) + "\n", "utf8");
  await saveCasesCsv([...metadataById.values()].sort((a, b) => a.good_id - b.good_id));
  return combined;
}

async function fetchPlatform(item, platform) {
  const platformName = platform === 1 ? "buff" : "yyyp";
  const filename = path.join(RAW_DIR, platformName, `${safeFilePart(item.good_id)}_${safeFilePart(item.case_name)}.csv`);
  if (mode !== "--test-only" && await isCompleteHistory(filename, item.good_id, platform)) return { rows: await readCsv(filename), status: "skipped_complete" };
  const payload = await requestJson(token, "POST", "/api/v1/info/chart", { good_id: item.good_id, key: "sell_price", platform, period: 1095, style: "all_style" });
  const rows = chartRows(payload, item, platform);
  if (!rows.length) throw new Error(`EMPTY_HISTORY platform=${platform} good_id=${item.good_id}`);
  await writeCsv(filename, rows, ["date", "price", "platform", "good_id", "case_name"]);
  return { rows, status: "success" };
}

async function processCase(item, isTest = false) {
  const metadataItem = await getMetadata(item);
  const outputs = [];
  for (const platform of [1, 2]) {
    try {
      const result = await fetchPlatform(metadataItem, platform);
      outputs.push({ ...summary(metadataItem.case_name, platform, result.rows), status: result.status });
    } catch (error) {
      await appendFailure({ timestamp: new Date().toISOString(), case_name: metadataItem.case_name, good_id: metadataItem.good_id, platform, stage: "get_item_chart", attempts: MAX_ATTEMPTS, error: String(error.message || error) }, failures);
      if (isTest) throw new Error(`TEST_FAILED ${metadataItem.case_name}(${metadataItem.good_id}) platform=${platform}: ${error.message || error}`);
      console.error(`失败并跳过该箱子：${metadataItem.case_name}(${metadataItem.good_id}) platform=${platform}`);
      return { ok: false, outputs };
    }
  }
  const now = new Date().toISOString();
  for (const output of outputs) fetchLog.push({ case_name: output.case_name, good_id: metadataItem.good_id, platform: output.platform, points: output.points, earliest_date: output.earliest, latest_date: output.latest, status: output.status, timestamp: now });
  await fs.writeFile(fetchLogPath, JSON.stringify(fetchLog, null, 2) + "\n", "utf8");
  await saveFetchLog(fetchLog);
  await saveCasesCsv([...metadataById.values()].sort((a, b) => a.good_id - b.good_id));
  return { ok: true, outputs };
}

if (mode === "--test-only") {
  const dream = selectedCases.find((item) => item.case_name === "梦魇武器箱");
  if (!dream) throw new Error("CSQAQ ROI 列表未找到梦魇武器箱");
  const result = await processCase(dream, true);
  for (const output of result.outputs) console.log(`TEST ${output.case_name} platform=${output.platform} points=${output.points} earliest=${output.earliest} latest=${output.latest} latest_price=${output.latest_price} status=${output.status}`);
  console.error("梦魇武器箱两平台测试成功，可以继续批量抓取。");
} else {
  console.error(`发现 ${selectedCases.length} 个武器箱条目（ROI 原始条目 ${roi.length}，已排除非武器箱容器）。`);
  for (let index = 0; index < selectedCases.length; index += 1) {
    const item = selectedCases[index];
    console.error(`[${index + 1}/${selectedCases.length}] ${item.case_name}(${item.good_id})`);
    try { await processCase(item, false); }
    catch (error) {
      await appendFailure({ timestamp: new Date().toISOString(), case_name: item.case_name, good_id: item.good_id, platform: "", stage: "metadata_or_case", attempts: MAX_ATTEMPTS, error: String(error.message || error) }, failures);
      console.error(`失败并继续下一个箱子：${item.case_name}(${item.good_id})`);
    }
  }
  await fs.writeFile(path.join(SOURCE_DIR, "fetch_manifest.json"), JSON.stringify({
    source: "CSQAQ official API", endpoint_tools: ["/api/v1/info/roi", "/api/v1/info/good", "/api/v1/info/chart"],
    chart_parameters: { key: "sell_price", period: 1095, style: "all_style", platforms: { "1": "BUFF", "2": "悠悠有品" } },
    discovered_roi_items: roi.length, selected_weapon_cases: selectedCases.length, fetched_at: new Date().toISOString(),
    retry_policy: { max_attempts: MAX_ATTEMPTS, retry_delay_seconds: RETRY_DELAY_MS / 1000, min_request_interval_seconds: MIN_REQUEST_INTERVAL_MS / 1000, request_timeout_seconds: REQUEST_TIMEOUT_MS / 1000 },
  }, null, 2) + "\n", "utf8");
  console.error("批量抓取完成；失败请求详见 data/failures.csv。");
}
