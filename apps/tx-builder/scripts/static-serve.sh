#!/bin/sh
# Builds the Transaction Builder from the runtime env, checks the build for Safe branding, and serves it.
# VITE_* values are compiled into the bundle, so the container builds the app on every start (as the wallet does).
# VITE_GATEWAY_URL is required: without it the app asks Sourcify and safe-client.safe.global for ABIs and chain data.
# Usage, from apps/tx-builder: sh scripts/static-serve.sh. Listens on PORT (default 4000).
set -eu

if [ -z "${VITE_GATEWAY_URL:-}" ]; then
  echo "static-serve: set VITE_GATEWAY_URL to the Client Gateway URL" >&2
  exit 2
fi

yarn build
sh ../web/scripts/check-brand.sh build 'Safe [Aa]pp([^a-zA-Z]|$)'
# -s: rewrite unknown paths to index.html for client-side routes. -C: CORS, the wallet fetches manifest.json.
# -n: do not copy the address to the clipboard (no clipboard in a container).
exec npx -y serve build -s -C -n -p "${PORT:-4000}"
