# Keystone Website To-Do

Use this roadmap to prioritize website improvements after the initial static site launch. The current site is a polished Eleventy/Cloudflare Pages site with project pages, research-update pages, contact links, and a collaboration intake path. A newsletter or update-capture flow is not currently visible.

## Priority Actions

- [ ] Add a lightweight research-update capture form.
  - Place it on the homepage, research page, and contact page.
  - Position it as "get research updates" rather than a general newsletter.
  - Decide whether the first implementation should use an external provider, Cloudflare Pages Functions, or a simple mailto fallback.

- [ ] Strengthen each project page with concrete proof.
  - Add 2-4 artifacts per project, such as publication links, figures, methods notes, datasets, tooling notes, or representative collaboration questions.
  - Start with clinical AI, reward circuitry, digital phenotyping, and translational psychiatry.
  - Replace scaffold-like claims with verifiable details.

- [ ] Make collaboration intake more outcome-oriented.
  - Add example engagements for AI evaluation protocols, neuroimaging analysis consults, trial strategy, and digital biomarker review.
  - Help visitors self-select before emailing.
  - Add privacy/consent language before collecting structured submissions.

- [ ] Add a concise credibility block near the homepage fold.
  - Keep it short and factual: board-certified psychiatry, MD/PhD, neuroimaging, clinical trials, peer-reviewed publications, and AI evaluation.
  - Reuse the same proof language on About and Research where appropriate.

- [ ] Publish one new research or update note per month.
  - Keep the cadence sustainable and high-signal.
  - Favor publication summaries, project milestones, methods notes, and clinical AI evaluation commentary.
  - Track the next 3 planned updates before publishing the first cadence-driven post.

## Search

- [ ] Verify Google Search Console and Bing Webmaster Tools ownership for the canonical `www` domain.
- [ ] Submit `sitemap.xml` after canonical redirects are stable.
- [ ] Review generated `robots.txt`, `sitemap.xml`, and `llms.txt` after real project and publication content is added.
- [ ] Add Organization structured data once final public organization details are approved.
- [ ] Add Person or ProfilePage structured data only if the public identity details are final.
- [ ] Improve page-specific titles and meta descriptions after each proof page is expanded.
- [ ] Add canonical URL checks for apex, `www`, HTTP, HTTPS, and old `.html` routes.
- [ ] Monitor search queries around clinical AI psychiatry, computational psychiatry, neuroimaging biomarkers, digital phenotyping, and translational neuroscience.

## Content

- [ ] Create a publication inventory with canonical links, preferred citations, summaries, and related project pages.
- [ ] Add a compact publications section or page if the research archive becomes too broad.
- [ ] Expand project pages from themes into proof pages.
- [ ] Add approved figures or diagrams where they clarify a project or research update.
- [ ] Add case-study-style pages only when they can be written without overstating client, partner, or project details.
- [ ] Add an editorial calendar for the next 3 months of research updates.
- [ ] Define content quality rules: every new page should have a clear audience, evidence, CTA, and search intent.
- [ ] Revisit mobile layout after each major content expansion.
- [ ] Audit image size and asset loading before adding heavy visuals.

## Collaboration

- [ ] Add example engagement types to the collaboration page.
- [ ] Clarify best-fit collaborators: research teams, digital health groups, clinical AI teams, neuroimaging groups, and translational psychiatry projects.
- [ ] Add "not a fit" guidance if needed to reduce low-signal inquiries.
- [ ] Decide whether collaboration intake should remain email-based or move to a structured form.
- [ ] If using a form, define storage, notification routing, spam protection, and consent language before implementation.
- [ ] Create reusable email routing notes for `info@` and `collaborate@`.
- [ ] Add a simple internal triage process for collaboration requests.

## Revenue Opportunities

- [ ] Define a fixed-scope advisory package for clinical AI evaluation in psychiatry.
- [ ] Define a collaboration support offer for grants, protocols, neuroimaging methods, or digital biomarker strategy.
- [ ] Define a short paid briefing or workshop offer for labs, startups, incubators, or behavioral health teams.
- [ ] Decide whether any exclusive or subscriber-only content is appropriate; keep public credibility content open by default.
- [ ] Avoid affiliate marketing unless a partner clearly aligns with the site's scientific and clinical positioning.

## Market Signals To Monitor

- [ ] NIH/NIMH notices and funding opportunities related to AI, digital mental health, computational psychiatry, measurement-based care, and biomarkers.
- [ ] Startup, payer, and health-system activity around AI scribes, clinical decision support, digital biomarkers, and behavioral health infrastructure.
- [ ] Regulatory and safety developments for clinical AI, especially evaluation, validation, privacy, and human oversight.
- [ ] Publication trends in neuroimaging, computational psychiatry, multimodal biomarkers, and AI model evaluation.

## Operations

- [ ] Keep Cloudflare Pages production branch on `main`.
- [ ] Confirm Cloudflare Pages build command remains `npm run build` and output directory remains `_site`.
- [ ] Keep apex-to-`www` redirects tested after DNS or Pages changes.
- [ ] Purge Cloudflare cache only when asset or redirect behavior requires it.
- [ ] Keep local Cloudflare credentials out of git.
- [ ] Consider adding deployment notes for DNS, Pages custom domains, redirects, and email routing.
