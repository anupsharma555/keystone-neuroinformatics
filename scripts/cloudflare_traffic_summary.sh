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

python3 - "$CLOUDFLARE_API_TOKEN" "$CLOUDFLARE_ZONE_ID" "$HOURS" <<'PY'
import datetime as dt
import json
import sys
import urllib.request

token, zone_id, hours_text = sys.argv[1:4]
hours = int(hours_text)
until = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
since = until - dt.timedelta(hours=hours)

query = """
query($zoneTag:String!,$since:Time!,$until:Time!){
  viewer { zones(filter:{zoneTag:$zoneTag}) {
    status: httpRequestsAdaptiveGroups(limit:20, filter:{datetime_geq:$since,datetime_lt:$until,clientRequestHTTPHost_like:"%keystoneneuroinformatics.com%"}, orderBy:[count_DESC]) {
      count dimensions { edgeResponseStatus }
    }
    countries: httpRequestsAdaptiveGroups(limit:20, filter:{datetime_geq:$since,datetime_lt:$until,clientRequestHTTPHost_like:"%keystoneneuroinformatics.com%"}, orderBy:[count_DESC]) {
      count dimensions { clientCountryName }
    }
    paths: httpRequestsAdaptiveGroups(limit:30, filter:{datetime_geq:$since,datetime_lt:$until,clientRequestHTTPHost_like:"%keystoneneuroinformatics.com%"}, orderBy:[count_DESC]) {
      count dimensions { clientRequestHTTPHost clientRequestPath }
    }
    userAgents: httpRequestsAdaptiveGroups(limit:25, filter:{datetime_geq:$since,datetime_lt:$until,clientRequestHTTPHost_like:"%keystoneneuroinformatics.com%"}, orderBy:[count_DESC]) {
      count dimensions { userAgent verifiedBotCategory }
    }
    aiAndSearchBots: httpRequestsAdaptiveGroups(limit:50, filter:{datetime_geq:$since,datetime_lt:$until,clientRequestHTTPHost_like:"%keystoneneuroinformatics.com%",userAgent_like:"%bot%"}, orderBy:[count_DESC]) {
      count dimensions { clientRequestHTTPHost clientRequestPath userAgent verifiedBotCategory edgeResponseStatus }
    }
  } }
}
"""

payload = json.dumps({
    "query": query,
    "variables": {
        "zoneTag": zone_id,
        "since": since.isoformat().replace("+00:00", "Z"),
        "until": until.isoformat().replace("+00:00", "Z"),
    },
}).encode()

request = urllib.request.Request(
    "https://api.cloudflare.com/client/v4/graphql",
    data=payload,
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    },
)

with urllib.request.urlopen(request, timeout=30) as response:
    data = json.load(response)

if data.get("errors"):
    print(json.dumps(data["errors"], indent=2))
    sys.exit(1)

zone = data["data"]["viewer"]["zones"][0]
print(f"Cloudflare traffic summary: last {hours}h")
print(f"Window UTC: {since.isoformat()} to {until.isoformat()}")

def print_section(name, rows):
    print(f"\n## {name}")
    if not rows:
        print("No rows.")
        return
    for row in rows:
        dims = row["dimensions"]
        parts = [f"count={row['count']}"]
        for key, value in dims.items():
            if value is None or value == "":
                continue
            value = str(value).replace("\n", " ")
            if len(value) > 140:
                value = value[:137] + "..."
            parts.append(f"{key}={value}")
        print("\t".join(parts))

print_section("Status Codes", zone["status"])
print_section("Countries", zone["countries"])
print_section("Top Paths", zone["paths"])
print_section("Top User Agents", zone["userAgents"])
print_section("AI/Search Bot-like User Agents", zone["aiAndSearchBots"])
PY
