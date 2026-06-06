#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${CLOUDFLARE_ENV_FILE:-$ROOT_DIR/private.cloudflare.keystone-neuroinformatics.env}"
HOURS="${1:-24}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing Cloudflare env file: $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ZONE_ID:-}" ]]; then
  echo "CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID are required." >&2
  exit 1
fi

payload="$(python3 - "$CLOUDFLARE_ZONE_ID" "$HOURS" <<'PY'
import datetime as dt
import json
import sys

zone_id = sys.argv[1]
hours = int(sys.argv[2])
until = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
since = until - dt.timedelta(hours=hours)

query = """
query($zoneTag:String!,$since:Time!,$until:Time!){
  viewer {
    zones(filter:{zoneTag:$zoneTag}) {
      httpRequestsAdaptiveGroups(
        limit: 50,
        filter:{datetime_geq:$since,datetime_lt:$until,userAgent_like:"%bot%"},
        orderBy:[count_DESC]
      ) {
        count
        dimensions {
          clientRequestHTTPHost
          clientRequestPath
          userAgent
        }
      }
    }
  }
}
"""

print(json.dumps({
    "query": query,
    "variables": {
        "zoneTag": zone_id,
        "since": since.isoformat().replace("+00:00", "Z"),
        "until": until.isoformat().replace("+00:00", "Z"),
    },
}))
PY
)"

response="$(curl -fsS \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$payload" \
  "https://api.cloudflare.com/client/v4/graphql")"

python3 - "$response" <<'PY'
import json
import sys

data = json.loads(sys.argv[1])
if data.get("errors"):
    print(json.dumps(data["errors"], indent=2))
    sys.exit(1)

rows = data["data"]["viewer"]["zones"][0]["httpRequestsAdaptiveGroups"]
if not rows:
    print("No bot-like user agents found in the selected window.")
    sys.exit(0)

print("count\thost\tpath\tuser_agent")
for row in rows:
    dims = row["dimensions"]
    print(
        f"{row['count']}\t"
        f"{dims.get('clientRequestHTTPHost', '')}\t"
        f"{dims.get('clientRequestPath', '')}\t"
        f"{dims.get('userAgent', '')}"
    )
PY
