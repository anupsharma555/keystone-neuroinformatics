#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${CLOUDFLARE_ENV_FILE:-$ROOT_DIR/private.cloudflare.keystone-neuroinformatics.env}"
PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT_NAME:-keystone-neuroinformatics}"
BRANCH="${CLOUDFLARE_PAGES_BRANCH:-main}"

cd "$ROOT_DIR"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing Cloudflare env file: $ENV_FILE" >&2
  exit 1
fi

npm run build

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "CLOUDFLARE_API_TOKEN is required." >&2
  exit 1
fi

npx wrangler pages deploy _site --project-name "$PROJECT_NAME" --branch "$BRANCH"

"$ROOT_DIR/scripts/verify-live-site.sh"
