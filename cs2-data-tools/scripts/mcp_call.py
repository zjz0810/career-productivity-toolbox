"""Minimal stdio MCP client for the local CSQAQ server.

The server is launched with the project root as cwd so dotenv loads .env
without exposing the token to this process or its logs.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
NODE = os.environ.get("CSQAQ_NODE", "node")
SERVER = ROOT / "csqaq-mcp" / "build" / "index.js"


class McpClient:
    def __init__(self) -> None:
        self.proc = subprocess.Popen(
            [NODE, str(SERVER)],
            cwd=ROOT,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        self.next_id = 1

    def _send(self, message: dict[str, Any]) -> None:
        payload = json.dumps(message, ensure_ascii=False).encode("utf-8")
        assert self.proc.stdin is not None
        self.proc.stdin.write(
            b"Content-Length: " + str(len(payload)).encode("ascii") + b"\r\n\r\n" + payload
        )
        self.proc.stdin.flush()

    def _read(self) -> dict[str, Any]:
        assert self.proc.stdout is not None
        first = self.proc.stdout.readline()
        if not first:
            err = ""
            if self.proc.stderr is not None:
                err = self.proc.stderr.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"MCP server closed stdout. stderr={err}")
        if first.lstrip().startswith(b"{"):
            return json.loads(first.decode("utf-8"))

        headers: dict[str, str] = {}
        line = first
        while line not in (b"\r\n", b"\n", b""):
            decoded = line.decode("ascii", errors="replace").strip()
            if ":" in decoded:
                key, value = decoded.split(":", 1)
                headers[key.lower().strip()] = value.strip()
            line = self.proc.stdout.readline()
        length = int(headers.get("content-length", "0"))
        body = self.proc.stdout.read(length)
        return json.loads(body.decode("utf-8"))

    def initialize(self) -> None:
        request_id = self.next_id
        self.next_id += 1
        self._send(
            {
                "jsonrpc": "2.0",
                "id": request_id,
                "method": "initialize",
                "params": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {},
                    "clientInfo": {"name": "cs2-case-backtest", "version": "1.0.0"},
                },
            }
        )
        response = self._read()
        if "error" in response:
            raise RuntimeError(json.dumps(response, ensure_ascii=False))
        self._send({"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}})

    def call_tool(self, name: str, arguments: dict[str, Any]) -> Any:
        request_id = self.next_id
        self.next_id += 1
        self._send(
            {
                "jsonrpc": "2.0",
                "id": request_id,
                "method": "tools/call",
                "params": {"name": name, "arguments": arguments},
            }
        )
        response = self._read()
        if "error" in response:
            raise RuntimeError(json.dumps(response, ensure_ascii=False))
        result = response.get("result", {})
        if result.get("isError"):
            text = "\n".join(str(x.get("text", "")) for x in result.get("content", []))
            raise RuntimeError(text or json.dumps(result, ensure_ascii=False))
        parts = result.get("content", [])
        texts = [x.get("text", "") for x in parts if x.get("type") == "text"]
        if len(texts) == 1:
            try:
                return json.loads(texts[0])
            except json.JSONDecodeError:
                return texts[0]
        return texts

    def close(self) -> None:
        if self.proc.poll() is None:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.proc.kill()


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: mcp_call.py TOOL [JSON_ARGS]", file=sys.stderr)
        return 2
    tool = sys.argv[1]
    args = json.loads(sys.argv[2]) if len(sys.argv) >= 3 else {}
    client = McpClient()
    try:
        client.initialize()
        print(json.dumps(client.call_tool(tool, args), ensure_ascii=False, indent=2))
        return 0
    except Exception as exc:
        print(f"MCP_ERROR: {exc}", file=sys.stderr)
        return 1
    finally:
        client.close()


if __name__ == "__main__":
    raise SystemExit(main())
