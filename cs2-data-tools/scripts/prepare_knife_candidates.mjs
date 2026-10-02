import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const API_BASE = "https://api.csqaq.com";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Candidate IDs came from the CSQAQ knife + Field-Tested/Minimal-Wear list.
// This stage intentionally does not call /chart: 1095-day history is deferred
// until the user confirms the candidate list.
const CANDIDATE_IDS = [
  6645, 6710, 6672, 6630, 6659,
  6950, 7032, 7001, 6994, 6968, 6982,
  7041, 7046, 7089, 7058,
  7157, 7192,
  6899, 6900, 6939, 13856,
  6739, 6753, 6775,
  7401, 7445,
];

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function readToken() {
  const text = await fs.readFile(path.join(ROOT, ".env"), "utf8");
  const line = text.split(/\r?\n/).find((item) => /^\s*CSQAQ_API_TOKEN\s*=/.test(item));
  const token = line?.replace(/^\s*CSQAQ_API_TOKEN\s*=\s*/, "").trim().replace(/^"|"$/g, "");
  if (!token) throw new Error("CSQAQ_API_TOKEN 未填写");
  return token;
}

async function getDetail(token, id) {
  const response = await fetch(`${API_BASE}/api/v1/info/good?id=${encodeURIComponent(id)}`, {
    headers: { ApiToken: token },
  });
  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();
  if (!response.ok) throw new Error(`HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType}`);
  let parsed;
  try { parsed = JSON.parse(body); }
  catch { throw new Error(`JSON_PARSE_ERROR HTTP_STATUS=${response.status} CONTENT_TYPE=${contentType}`); }
  if (Number(parsed?.code) !== 200) throw new Error(`CSQAQ_API_CODE_ERROR code=${parsed?.code ?? ""}`);
  return parsed.data?.goods_info || {};
}

const token = await readToken();
const rows = [];
for (const id of CANDIDATE_IDS) {
  const item = await getDetail(token, id);
  const name = String(item.name || "");
  const category = name.split("（★）")[0] || name.split(" |")[0];
  const exterior = item.exterior_localized_name || (name.match(/\(([^()]*)\)$/)?.[1] ?? "");
  rows.push({
    中文名: name,
    英文名: item.market_hash_name || "",
    磨损: exterior,
    good_id: item.id ?? id,
    刀型: category,
    BUFF价格: item.buff_sell_price ?? "",
    悠悠价格: item.yyyp_sell_price ?? "",
    BUFF在售数量: item.buff_sell_num ?? "",
    悠悠在售数量: item.yyyp_sell_num ?? "",
    Steam日成交量: item.turnover_number ?? "",
    是否能获得1095天历史: "未测试（候选确认后验证）",
    筛选说明: "普通刀型；非StatTrak；排除多普勒/伽玛多普勒/渐变之色/虎牙/表面淬火等特殊溢价；价格与在售数量为本次CSQAQ详情快照",
    价格快照时间: item.updated_at || new Date().toISOString(),
  });
  await sleep(1000);
}

const columns = ["中文名", "英文名", "磨损", "good_id", "刀型", "BUFF价格", "悠悠价格", "BUFF在售数量", "悠悠在售数量", "Steam日成交量", "是否能获得1095天历史", "筛选说明", "价格快照时间"];
const output = [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n") + "\n";
await fs.writeFile(path.join(ROOT, "data", "knife_candidates.csv"), output, "utf8");
await fs.writeFile(path.join(ROOT, "data", "knife_candidates.json"), JSON.stringify({
  source: "CSQAQ official API /api/v1/info/good",
  fetched_at: new Date().toISOString(),
  historical_chart_requested: false,
  candidate_count: rows.length,
  rows,
}, null, 2) + "\n", "utf8");
console.log(`已保存 ${rows.length} 个刀皮候选；未请求 1095 天历史。`);
