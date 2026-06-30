#!/usr/bin/env bash
# ローカル確認用 — ES Modules のため file:// 直開き不可
cd "$(dirname "$0")"
PORT="${1:-8080}"
echo ""
echo "  PR AX デモ — http://localhost:${PORT}/"
echo "  停止: Ctrl+C"
echo ""
python3 -m http.server "$PORT"
