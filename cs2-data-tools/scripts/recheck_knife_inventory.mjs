import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Client } from "../csqaq-mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js";
import { StdioClientTransport } from "../csqaq-mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js";

const ROOT = process.cwd();
const CANDIDATES = path.join(ROOT, "data", "knife_candidates_expanded.csv");
const OUT_CSV = path.join(ROOT, "data", "knife_current_inventory_rechecked.csv");
const OUT_JSON = path.join(ROOT, "data", "source", "knife_current_inventory_rechecked.json");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const MIN_INTERVAL_MS = 1000;
const RETRY_DELAY_MS = 3000;
const MAX_ATTEMPTS = 3;
let lastCallAt = 0;

function parseCsv(text) {
  const rows = [];
  let row = [], value = "", quoted = false;
  const flushValue = () => { row.push(value); value = ""; };
  const flushRow = () => { flushValue(); if (row.some((x) => x !== "")) rows.push(row); row = []; };
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (c === "," && !quoted) flushValue();
    else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i += 1;
      flushRow();
    } else value += c;
  }
  if (value || row.length) flushRow();
  const headers = rows.shift() || [];
  return rows.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}

function csvEscape(value) {
  if (value == null) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : "";
}

async function callRank(client, name) {
  let lastError = "";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastCallAt));
    if (wait) await sleep(wait);
    lastCallAt = Date.now();
    try {
      const result = await client.callTool({
        name: "get_rank_list",
        arguments: { page_index: 1, page_size: 50, filter: {}, search: name },
      });
      const text = (result.content || []).filter((x) => x.type === "text").map((x) => x.text).join("\n");
      if (result.isError) throw new Error(text || "MCP返回错误");
      const payload = JSON.parse(text);
      if (payload.code !== 200) throw new Error(`CSQAQ code=${payload.code}`);
      const data = payload.data?.data || [];
      if (!data.length) throw new Error("排行榜返回空列表");
      return data;
    } catch (error) {
      lastError = String(error?.message || error);
      if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  }
  throw new Error(`尝试${MAX_ATTEMPTS}次失败: ${lastError}`);
}

const candidates = parseCsv(await fs.readFile(CANDIDATES, "utf8")).map((r) => ({ ...r, good_id: Number(r.good_id) }));
if (candidates.length !== 75 || new Set(candidates.map((r) => r.good_id)).size !== 75) {
  throw new Error(`候选池不是75个唯一good_id: ${candidates.length}`);
}

const transport = new StdioClientTransport({
  command: process.env.CSQAQ_NODE || "node",
  args: ["csqaq-mcp/build/index.js"],
  cwd: ROOT,
  env: { ...process.env, CSQAQ_DEBUG_HTTP: "0" },
  stderr: "pipe",
});
const client = new Client({ name: "cs2-current-inventory-recheck", version: "1.0.0" }, { capabilities: {} });
const output = [];
const failures = [];
try {
  await client.connect(transport);
  for (let i = 0; i < candidates.length; i += 1) {
    const item = candidates[i];
    try {
      const data = await callRank(client, item.中文名);
      const found = data.find((r) => Number(r.id) === item.good_id);
      if (!found) throw new Error(`排行榜结果未找到good_id=${item.good_id}`);
      const required = ["buff_sell_price", "buff_sell_num", "yyyp_sell_price", "yyyp_sell_num"];
      const missing = required.filter((key) => !(key in found));
      if (missing.length) throw new Error(`缺少字段: ${missing.join(",")}`);
      output.push({
        good_id: item.good_id,
        中文名: found.name || item.中文名,
        英文名: item.英文名,
        刀型: item.刀型,
        涂装: item.涂装,
        磨损: found.exterior_localized_name || item.磨损,
        BUFF当前最低售价: num(found.buff_sell_price),
        BUFF当前在售数量: num(found.buff_sell_num),
        悠悠当前最低售价: num(found.yyyp_sell_price),
        悠悠当前在售数量: num(found.yyyp_sell_num),
        字段_求购_BUFF: num(found.buff_buy_num),
        字段_求购_悠悠: num(found.yyyp_buy_num),
        字段_统计值: num(found.statistic),
        字段_Steam在售: num(found.steam_sell_num),
        字段_Steam求购: num(found.steam_buy_num),
        rank_num: found.rank_num ?? "",
        snapshot_time: found.created_at ?? "",
        source_endpoint: "/api/v1/info/get_rank_list",
        status: "success",
      });
      console.log(`RECHECK ${i + 1}/75 good_id=${item.good_id} success`);
    } catch (error) {
      failures.push({ good_id: item.good_id, 中文名: item.中文名, error: String(error?.message || error) });
      console.log(`RECHECK ${i + 1}/75 good_id=${item.good_id} failed`);
    }
  }
} finally {
  await client.close().catch(() => {});
}

const columns = [
  "good_id", "中文名", "英文名", "刀型", "涂装", "磨损",
  "BUFF当前最低售价", "BUFF当前在售数量", "悠悠当前最低售价", "悠悠当前在售数量",
  "字段_求购_BUFF", "字段_求购_悠悠", "字段_统计值", "字段_Steam在售", "字段_Steam求购",
  "rank_num", "snapshot_time", "source_endpoint", "status",
];
await fs.writeFile(OUT_CSV, `\ufeff${columns.join(",")}\n${output.map((r) => columns.map((c) => csvEscape(r[c])).join(",")).join("\n")}\n`, "utf8");
await fs.writeFile(OUT_JSON, JSON.stringify({
  source: "CSQAQ official API",
  endpoint: "/api/v1/info/get_rank_list",
  fetched_at: new Date().toISOString(),
  candidate_count: candidates.length,
  success_count: output.length,
  failure_count: failures.length,
  field_mapping: {
    "BUFF当前在售数量": "buff_sell_num",
    "悠悠当前在售数量": "yyyp_sell_num",
    "BUFF当前最低售价": "buff_sell_price",
    "悠悠当前最低售价": "yyyp_sell_price",
    not_listing_count: ["buff_buy_num", "yyyp_buy_num", "statistic", "steam_sell_num", "steam_buy_num"],
  },
  failures,
}, null, 2) + "\n", "utf8");
console.log(`DONE success=${output.length} failures=${failures.length}`);
process.exitCode = failures.length ? 1 : 0;
