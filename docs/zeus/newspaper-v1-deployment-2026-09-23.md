# Newspaper v1 deployment — 2026-09-23

**DEPLOYED:** Cloudflare's canonical production deployment for `plumblines.uk` is `a1ec660d-f432-44dc-aaf4-9919babb15d3`, successful at 07:09 UTC. The user authorized replacing the existing site. The Docker PDS, DNS, tunnel and account records were not changed.

## Deployed behavior

- Account-local Following, custom feed, list and saved-search sections; rename/reorder/remove, per-section reply/repost/quote filters, two columns on wide screens and one active section on narrow screens. Strict Following uses the timeline without Discover or merged-feed fallback.
- Temporary account/topic snoozes with expiry and local undo; deliberate profile visits remain available.
- Reader and thread/article modes, text-only post-image export with moderation reveal preserved, keyboard navigation and root PWA install metadata.
- Supplied post/record details, escaped generic custom-record inspection and lazy credential-free DID/PDS discovery.
- Previous no-block-creation policy, existing-block removal and opt-in read-only public blocked-content readers remain intact. Missing service data stays unavailable.

## Artifact and rollback

| Item | Value |
|---|---|
| Implemented source | `a832af79b19b29433d751bc36d45bd1fc78d864d` |
| Preview | https://b653ba13.plumbline-f50.pages.dev |
| Production | https://plumblines.uk |
| Production deployment URL | https://a1ec660d.plumbline-f50.pages.dev |
| Production deployment ID | `a1ec660d-f432-44dc-aaf4-9919babb15d3` |
| Pages project / branch | `plumbline` / `main` |
| Packaged directory | `.cloudflare/pages-afar0d9i` |
| SHA-256 manifest | `.cloudflare/pages-afar0d9i-sha256.json` |
| Manifest SHA-256 | `2bb9ac215cc105ac27a440f532ce7788819aa0712154f7101c2bb3556745641c` |
| Immediate rollback | `bc9995ac-5efc-4616-a021-7815bb6677a3` |

All 389 packaged files match the local manifest. Identical files were uploaded to preview and production; production upload reused the already uploaded content-addressed assets. Follow-up test/report commits do not change this artifact's source SHA. The previous production deployment remains available for rollback through Cloudflare Pages.

## Executed checks

| Scope | Result |
|---|---|
| Full Jest | PASS: 95 suites, 957 tests, 21 snapshots; 28 inherited TODO |
| Lint / formatting | PASS |
| iOS / Android / web TypeScript | PASS; not native device execution |
| Web export / Docker | PASS; container healthy at loopback 8139 |
| Local asset bytes | PASS: 12 selected served JS/CSS/PWA resources match artifact |
| Local browser | PASS: 38/38, 1.3 minutes |
| Cloudflare preview browser | PASS: 38/38, 1.6 minutes |
| Production deployment metadata | PASS: canonical deployment ID, source SHA, main branch, success stage and custom-domain association verified through Cloudflare API |
| New custom-domain / in-app browser inspection | NOT VERIFIED: browser policy service unavailable; no bypass attempted |
| Preview remote asset hashes | NOT VERIFIED: separate Python request returned Cloudflare 403 / error 1010; browser suite passed without weakening security |
| Authenticated mutations / native devices / OS installation | NOT RUN |

Browser checks mix guest flows, actual public blocked-post recovery and deterministic protocol fixtures. They do not prove authenticated account acceptance. PWA metadata is present; offline Editions and a service-worker cache are not part of v1. Single-model review found and corrected moderation, expiry, fixture typing, thread-gap and dialog-stacking issues; external model consensus was not run.

Inherited dependency advisories and upstream service-origin/search limitations remain in the [Zeus report](zeus-report.md). The complete product acceptance result remains **PARTIAL** despite successful scoped v1 deployment. V2 features remain explicitly deferred in the [plan](../plan/plumblines-newspaper-v1/plan.md).

Raw evidence remains locally in `docs/zeus/evidence/newspaper-v1-*`: browser JSON/logs, build/static/unit output, artifact manifest checks, deployment CLI output and sanitized canonical deployment JSON. Reusable tests and this receipt are committed.
