#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://www.keystoneneuroinformatics.com}"
USER_AGENT="${USER_AGENT:-KeystoneSiteOps/1.0}"

URLS=("$@")
if [[ ${#URLS[@]} -eq 0 ]]; then
  URLS=(
    "$BASE_URL/"
    "$BASE_URL/contact/"
    "$BASE_URL/projects/"
    "$BASE_URL/research/"
    "$BASE_URL/services/"
    "$BASE_URL/project/clinical-ai-in-psychiatry/"
    "$BASE_URL/research/ai-evaluation-in-clinical-psychiatry/"
    "$BASE_URL/services/healthcare-llm-evaluation/"
    "$BASE_URL/sitemap.xml"
    "$BASE_URL/robots.txt"
  )
fi

failures=0

for url in "${URLS[@]}"; do
  headers="$(curl -fsSI -A "$USER_AGENT" "$url" || true)"
  status="$(printf "%s\n" "$headers" | awk '/^HTTP/{code=$2} END{print code}')"
  content_type="$(printf "%s\n" "$headers" | awk -F': ' 'tolower($1)=="content-type"{print $2}' | tail -n 1 | tr -d '\r')"
  robots="$(printf "%s\n" "$headers" | awk -F': ' 'tolower($1)=="x-robots-tag"{print $2}' | tail -n 1 | tr -d '\r')"

  printf "%s\tstatus=%s\tcontent_type=%s" "$url" "${status:-none}" "${content_type:-unknown}"
  if [[ -n "${robots:-}" ]]; then
    printf "\tx_robots=%s" "$robots"
  fi
  printf "\n"

  if [[ "$status" != "200" ]]; then
    failures=$((failures + 1))
  fi
  robots_lower="$(printf "%s" "${robots:-}" | tr '[:upper:]' '[:lower:]')"
  if [[ "$robots_lower" == *"noindex"* ]]; then
    failures=$((failures + 1))
  fi
done

if [[ "$failures" -gt 0 ]]; then
  echo "Live verification failed: $failures issue(s)." >&2
  exit 1
fi

echo "Live verification passed."
