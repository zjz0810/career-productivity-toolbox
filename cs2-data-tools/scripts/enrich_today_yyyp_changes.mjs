import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const API_BASE = "https://api.csqaq.com";
const RUN_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date()).replaceAll("-", "");
const INPUT = path.join(ROOT, "data", `yyyp_knives_under_1000_sellnum_gt40_${RUN_DATE}.csv`);
const OUTPUT = path.join(ROOT, "data", `yyyp_knives_under_1000_with_changes_${RUN_DATE}.csv`);
const FAILURES = path.join(ROOT, "data", `yyyp_knives_under_1000_change_failures_${RUN_DATE}.csv`);
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

async function readCsv(file) {
  const lines = (await fs.readFile(file, "utf8")).split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines.shift() || "").map((h) => h.replace(/^\ufeff/, ""));
  return lines.map((line) => {
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

async function requestDetail(token, goodId) {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastRequestAt));
      if (wait) await sleep(wait);
      lastRequestAt = Date.now();
      const response = await fetch(`${API_BASE}/api/v1/info/good?id=${encodeURIComponent(goodId)}`, {
        headers: { ApiToken: token },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();
      if (!response.ok) throw new Error(`HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType}`);
      if (!contentType.toLowerCase().includes("json")) throw new Error(`NON_JSON_CONTENT_TYPE=${contentType}`);
      const payload = JSON.parse(text);
      if (Number(payload?.code) !== 200) throw new Error(`CSQAQ_API_CODE_ERROR code=${payload?.code ?? ""}`);
      const detail = payload.data?.goods_info;
      if (!detail) throw new Error("goods_info为空");
      return detail;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  }
  throw new Error(`ATTEMPTS=${MAX_ATTEMPTS} ${lastError?.message || "unknown"}`);
}

const token = await readToken();
const input = await readCsv(INPUT);
const output = [];
const failures = [];
for (let i = 0; i < input.length; i += 1) {
  const item = input[i];
  try {
    const detail = await requestDetail(token, item.good_id);
    const row = {
      ...item,
      英文名: item.英文名 || detail.market_hash_name || "",
      悠悠涨跌1日: detail.yyyp_sell_price_1 ?? "",
      悠悠涨跌7日: detail.yyyp_sell_price_7 ?? "",
      悠悠涨跌15日: detail.yyyp_sell_price_15 ?? "",
      悠悠涨跌30日: detail.yyyp_sell_price_30 ?? "",
      悠悠涨跌90日: detail.yyyp_sell_price_90 ?? "",
      悠悠涨跌180日: detail.yyyp_sell_price_180 ?? "",
      悠悠涨跌365日: detail.yyyp_sell_price_365 ?? "",
      悠悠涨跌率1日: detail.yyyp_sell_price_rate_1 ?? "",
      悠悠涨跌率7日: detail.yyyp_sell_price_rate_7 ?? "",
      悠悠涨跌率15日: detail.yyyp_sell_price_rate_15 ?? "",
      悠悠涨跌率30日: detail.yyyp_sell_price_rate_30 ?? "",
      悠悠涨跌率90日: detail.yyyp_sell_price_rate_90 ?? "",
      悠悠涨跌率180日: detail.yyyp_sell_price_rate_180 ?? "",
      悠悠涨跌率365日: detail.yyyp_sell_price_rate_365 ?? "",
      详情快照时间: detail.period_at || item.snapshot_time,
      detail_endpoint: "/api/v1/info/good",
    };
    output.push(row);
    console.log(`DETAIL ${i + 1}/${input.length} good_id=${item.good_id} success`);
  } catch (error) {
    failures.push({ good_id: item.good_id, 中文名: item.中文名, error: String(error?.message || error) });
    console.log(`DETAIL ${i + 1}/${input.length} good_id=${item.good_id} failed`);
  }
}

const baseColumns = Object.keys(input[0] || {});
const changeColumns = [
  "悠悠涨跌1日", "悠悠涨跌7日", "悠悠涨跌15日", "悠悠涨跌30日", "悠悠涨跌90日", "悠悠涨跌180日", "悠悠涨跌365日",
  "悠悠涨跌率1日", "悠悠涨跌率7日", "悠悠涨跌率15日", "悠悠涨跌率30日", "悠悠涨跌率90日", "悠悠涨跌率180日", "悠悠涨跌率365日",
  "详情快照时间", "detail_endpoint",
];
const columns = [...baseColumns, ...changeColumns];
await fs.writeFile(OUTPUT, `\ufeff${columns.join(",")}\n${output.map((r) => columns.map((c) => csvEscape(r[c])).join(",")).join("\n")}\n`, "utf8");
const failureColumns = ["good_id", "中文名", "error"];
await fs.writeFile(FAILURES, `\ufeff${failureColumns.join(",")}\n${failures.map((r) => failureColumns.map((c) => csvEscape(r[c])).join(",")).join("\n")}\n`, "utf8");
console.log(`DONE input=${input.length} success=${output.length} failures=${failures.length}`);
process.exitCode = failures.length ? 1 : 0;
