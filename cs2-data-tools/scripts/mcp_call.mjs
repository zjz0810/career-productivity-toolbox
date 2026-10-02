import { Client } from "../csqaq-mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js";
import { StdioClientTransport } from "../csqaq-mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js";
import process from "node:process";
import fs from "node:fs/promises";

const tool = process.argv[2];
const args = process.argv[3] ? JSON.parse(process.argv[3]) : {};
const outputPath = process.argv[4];
if (!tool) throw new Error("usage: node scripts/mcp_call.mjs TOOL [JSON_ARGS]");

const transport = new StdioClientTransport({
  command: process.env.CSQAQ_NODE || "node",
  args: ["csqaq-mcp/build/index.js"],
  cwd: process.cwd(),
  env: { ...process.env, CSQAQ_DEBUG_HTTP: process.env.CSQAQ_DEBUG_HTTP || "0" },
  stderr: process.env.CSQAQ_DEBUG_HTTP === "1" ? "inherit" : "pipe",
});
const client = new Client({ name: "cs2-case-backtest", version: "1.0.0" }, { capabilities: {} });
try {
  await client.connect(transport);
  const result = await client.callTool({ name: tool, arguments: args });
  const text = (result.content || []).filter((x) => x.type === "text").map((x) => x.text).join("\n");
  if (result.isError) throw new Error(text || JSON.stringify(result));
  const output = (() => { try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; } })();
  if (outputPath) await fs.writeFile(outputPath, output + "\n", "utf8");
  else console.log(output);
} finally {
  await client.close().catch(() => {});
}
