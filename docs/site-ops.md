# Keystone Site Operations

This runbook keeps the website workflow repeatable: local change, validation, GitHub, Cloudflare deployment, and search/analytics checks. Scripts are limited to steps that are faster or safer than doing the work manually.

## Helper Scripts

Use these scripts when they save real time:

- `npm run audit:metadata`: checks generated page titles and descriptions for Bing/SEO-style length issues.
- `npm run verify:live`: verifies important live URLs return `200` and are not served with `X-Robots-Tag: noindex`.
- `npm run deploy:cloudflare`: builds, deploys `_site` to Cloudflare Pages, then runs live verification.
- `npm run cloudflare:traffic`: pulls Cloudflare GraphQL traffic summaries for status codes, top paths, countries, user agents, and bot-like crawlers.
- `npm run indexnow:submit`: submits sitemap URLs to IndexNow after production deployment.

Google Search Console and Bing Webmaster Tools remain browser-console workflows because their useful indexing actions are account/UI based.

## Change Workflow

1. Edit source files under `src/`, `_redirects`, `wrangler.toml`, or supporting data files.
2. Build locally:
   ```sh
   npm run build
   ```
3. Check generated metadata:
   ```sh
   npm run audit:metadata
   ```
4. Review the diff:
   ```sh
   git status --short
   git diff
   ```
5. Stage only the intended files, commit, and push:
   ```sh
   git add <files>
   git commit -m "<message>"
   git push origin main
   ```
6. Deploy immediately when the live site should update now:
   ```sh
   npm run deploy:cloudflare
   ```
7. Verify key URLs:
   ```sh
   npm run verify:live
   ```

The deploy helper sources `private.cloudflare.keystone-neuroinformatics.env`, runs the Eleventy build, deploys `_site` to Cloudflare Pages, and verifies key live URLs.

## Local-Only Notes

Keep private strategy and operations notes in `.local/`. That folder is ignored by Git. Do not put credentials, private backlog notes, or account-specific operational details into public tracked files.

## Search Metadata

Use the metadata audit after changing page titles or descriptions:

```sh
npm run audit:metadata
```

The audit reports title and description lengths using conservative search-snippet thresholds. It does not fail by default because some long research titles may be intentional. For strict CI-style checks:

```sh
npm run audit:metadata:strict
```

## Live Indexability Checks

Run:

```sh
npm run verify:live
```

This checks important public URLs for:

- HTTP `200`
- no `X-Robots-Tag: noindex`
- reachable sitemap and robots file

For a crawler-specific check:

```sh
USER_AGENT="Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" npm run verify:live
```

## IndexNow

After a production deployment, submit the sitemap URLs to IndexNow:

```sh
npm run indexnow:submit
```

Preview the payload first:

```sh
npm run indexnow:submit -- --dry-run --source local
```

## Cloudflare Analytics

For a quick API-backed traffic summary:

```sh
npm run cloudflare:traffic
```

Use a custom window:

```sh
scripts/cloudflare_traffic_summary.sh 72
```

This reports status codes, countries, top paths, top user agents, and bot-like user agents. It is useful for confirming Googlebot, Bingbot, ChatGPT/OpenAI, and other crawler activity without buying Log Explorer.

The current plan/token may not expose request-level referrer or ASN fields through GraphQL. Use Cloudflare Web Analytics in the dashboard for referrer/source views when available.

## Google Search Console

Batch reports can lag. For immediate validation, use URL Inspection.

Priority checks:

1. Inspect the exact canonical URL.
2. Click `TEST LIVE URL`.
3. Confirm:
   - `URL is available to Google`
   - `Page can be indexed`
   - page fetch succeeds
   - indexing is allowed
4. Click `REQUEST INDEXING` for priority pages after live test passes.

Priority URLs:

- `https://www.keystoneneuroinformatics.com/`
- `https://www.keystoneneuroinformatics.com/contact/`
- `https://www.keystoneneuroinformatics.com/services/`
- `https://www.keystoneneuroinformatics.com/projects/`
- `https://www.keystoneneuroinformatics.com/research/`
- `https://www.keystoneneuroinformatics.com/project/clinical-ai-in-psychiatry/`
- `https://www.keystoneneuroinformatics.com/research/ai-evaluation-in-clinical-psychiatry/`
- `https://www.keystoneneuroinformatics.com/services/healthcare-llm-evaluation/`

Also check `Sitemaps` after deployment to confirm Google has accepted `/sitemap.xml`.

## Bing Webmaster Tools

Use `Live URL` for current state and `Bing Index` for historical/index state.

Priority checks:

1. Inspect the exact canonical HTTPS URL with trailing slash where applicable.
2. Open `Live URL`.
3. Confirm `URL can be indexed by Bing`.
4. Fix SEO/GEO issues if they are straightforward metadata issues.
5. Click `Request indexing`.
6. Recheck `Bing Index` later; it can lag after live checks pass.

If Bing Site Scan reports a 400-499 issue, compare it with Cloudflare analytics. A `403 managed_challenge` for a Bing-like user agent means Cloudflare challenged that request. Prefer verified-bot allow/skip rules over broad user-agent allow rules.

## Cloudflare Dashboard Views

Useful dashboard locations:

- Account or zone `Analytics > Dashboards`: top paths, hosts, IPs, status codes, countries, browsers, user agents.
- Zone `AI Crawl Control`: AI crawler counts by operator.
- Zone `Web analytics`: privacy-conscious page views, referrers, and UTM sources.
- `Log Explorer`: request-level detail if plan access is available.

## Common Failure Modes

- Live pages show `X-Robots-Tag: noindex`: verify `wrangler.toml` has `pages_build_output_dir = "_site"` and redeploy.
- Deep pages return `404`: rebuild and deploy `_site`; check `_site/<path>/index.html` exists.
- Google/Bing index tabs show stale errors but live tests pass: request indexing and wait for batch data to refresh.
- Bing Site Scan shows a 403: check Cloudflare security actions before changing robots rules.
- `robots.txt` changed but crawlers do not appear: robots rules permit/deny crawlers, but do not force them to visit.
