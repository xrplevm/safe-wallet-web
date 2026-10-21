#!/bin/sh
# Fails when the static export still contains Safe trademarks, links to Safe-hosted pages or the Safe logo path.
# Source maps (*.map) are skipped: they carry the published GPL source, including code comments.
# third-party-licenses.* is skipped: it holds the dependencies' license texts, and their copyright notices
# (for example "Safe Ecosystem Foundation" on @safe-global/* MIT packages) must be kept by license.
# Works with GNU and BusyBox grep. Usage: scripts/check-brand.sh [export dir, default: out]
set -eu

DIR="${1:-out}"
PATTERN='Safe\{(Wallet|WALLET|Pass|DAO|Core)\}|Safe Labs|Safe Shield|Safe Ecosystem Foundation|Gnosis Safe|Safe Accounts?([^a-zA-Z]|$)|(app|help|docs|chat|status)\.safe\.global|M21\.757 11\.998h-2\.485'

if [ ! -d "$DIR" ]; then
  echo "check-brand: directory '$DIR' not found" >&2
  exit 2
fi

MATCHES=$(find "$DIR" -type f ! -name '*.map' ! -name 'third-party-licenses.*' -exec grep -hoE "$PATTERN" {} + | sort | uniq -c | sort -rn || true)

if [ -n "$MATCHES" ]; then
  echo "check-brand: Safe branding found in $DIR:" >&2
  echo "$MATCHES" >&2
  echo "Files:" >&2
  find "$DIR" -type f ! -name '*.map' ! -name 'third-party-licenses.*' -exec grep -lE "$PATTERN" {} + >&2 || true
  exit 1
fi

echo "check-brand: no Safe branding found in $DIR"
