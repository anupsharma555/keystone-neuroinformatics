# Keystone Neuroinformatics

Keystone Neuroinformatics is now scaffolded as an Eleventy-powered static site for Cloudflare Pages. The current implementation is intentionally designed as a future-ready publishing system: stable organization pages, collection-driven project profiles, a research-and-updates archive, collaboration intake guidance, and SEO/AI-discovery support.

## What changed

- Eleventy templates and layouts replace hand-authored standalone HTML pages.
- Core routes now use clean URLs such as `/about/`, `/projects/`, and `/research/`.
- Project pages live in a content collection under `src/projects/`.
- Research and blog-style updates live in a content collection under `src/research/`.
- Shared metadata, navigation, contact details, and crawler configuration live in `src/_data/site.js`.
- The site generates `robots.txt`, `sitemap.xml`, and `llms.txt`.
- The collaboration workflow is scaffolded via `/collaborate/`.

## Structure

- `src/pages/` core public pages
- `src/projects/` project content files
- `src/research/` research and update content files
- `src/_includes/` layouts, partials, and reusable macros
- `src/_data/site.js` shared site configuration
- `src/assets/` styles, scripts, favicon, social card, and future images
- [`CONTENT-CHECKLIST.md`](/Users/anup/gitProjects/keystone-neuroinformatics/CONTENT-CHECKLIST.md) downstream content/assets checklist

## Local development

```bash
npm install
npm run build
npm run dev
npm run indexnow:submit -- --dry-run
```

Eleventy outputs the generated site to `_site/`.

## Search discovery

The site publishes `robots.txt`, `sitemap.xml`, `llms.txt`, and a public IndexNow key file. The IndexNow key is configured in `src/_data/discovery.js`, emitted at the site root, and used by `npm run indexnow:submit` to submit the live sitemap URLs to participating IndexNow engines.

After changing public content, submit URLs after the Cloudflare Pages production deployment is live:

```bash
npm run indexnow:submit
```

The `Submit IndexNow URLs` GitHub Action also runs on pushes to `main` that affect source or build files, with a short wait for Cloudflare Pages deployment.

Recommended Cloudflare dashboard setting: enable Crawler Hints under the zone's cache/configuration settings. Keep Cloudflare managed `robots.txt` disabled so the repository-controlled crawler policy is served without Cloudflare's prepended AI crawler block.

## Cloudflare Pages

Recommended Pages settings:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `_site`
- Root directory: `/`
- Node.js version: `22` (set `NODE_VERSION=22` in Pages environment variables if needed)

Cloudflare Pages should deploy automatically when new commits land on the configured production branch. If preview deployments are enabled, pushes to non-production branches or pull requests can generate preview builds without affecting the live site.

## GitHub push and deploy workflow

Recommended workflow:

1. Create a working branch from `main`.
2. Commit the site changes on that branch.
3. Push the branch to GitHub.
4. Open and review a pull request into `main`.
5. Merge into `main` once the build looks correct.
6. Let Cloudflare Pages rebuild from `main`.

Typical commands:

```bash
git switch -c codex/site-refresh
git add .
git commit -m "Rebuild site with Eleventy scaffold and content refresh"
git push -u origin codex/site-refresh
```

After merge, verify the Cloudflare deployment log for:

- install step completes
- `npm run build` succeeds
- output directory is `_site`
- no missing dependency or Node-version errors

This repository should commit source files and configuration only. Do not commit `node_modules/`, `_site/`, or local Playwright artifacts.

## Content workflow

To add a new project:

1. Create a Markdown file in `src/projects/`.
2. Add front matter for title, summary, status, problem, approach, collaborators, next steps, and contact CTA.
3. Optionally add `image`, `imageAlt`, and `imageCaption`.

To add a new research update:

1. Create a Markdown file in `src/research/`.
2. Add front matter for title, date, summary, key insight, and implications.
3. Optionally add `image`, `imageAlt`, and `imageCaption`.

## Notes

- Placeholder project and research pages are scaffolds only and should be replaced with real details over time.
- Old `.html` routes redirect to clean URLs via `_redirects`.
- The current site remains fully static; no CMS or backend has been introduced yet.

## License

See `LICENSE`.
