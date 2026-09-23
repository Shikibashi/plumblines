# Cloudflare production deployment — 2026-09-23

**DEPLOYED:** https://plumblines.uk now serves the Plumblines newspaper client, replacing the previous Rust client. The user explicitly authorized this replacement. No DNS, PDS, tunnel, database or account records were changed.

## Removal-only moderation (06:27 UTC)

Current deployment: `bc9995ac-5efc-4616-a021-7815bb6677a3`. See [the moderation capability receipt](capabilities-deployment-2026-09-23.md).

## Public blocked-content reader (05:58 UTC)

This earlier deployment is `691324f3-e1ad-4a16-8d47-8b404f59c84d`, source `33abbf24832ce908e55c2c370e73eafcd34e80d8`. It adds opt-in public reading for blocked posts/profiles and truthful quote-list availability. See the [public-reader deployment receipt](public-reader-deployment-2026-09-23.md) for exact behavior, verification, service limits, and rollback.

## Deep-scroll correction (05:28 UTC)

This earlier deployment is `3d164850-39b9-4484-89a3-f9d3d1b974f5`, at https://3d164850.plumbline-f50.pages.dev, source commit `75b71547ae6dfc2f3322d891ff21dddf02777ef3`. It replaces the initial deployment described below. The immediate rollback target is `31462629-65f9-4903-9065-b2bf6e3a60d6`.

A user screenshot exposed a deep-scroll defect missed by the initial viewport tests. The masthead was sticky inside a viewport-height navigation shell, so it scrolled away beyond the first screen while feed tabs retained their masthead offset. More-specific static HTML theme styles also painted the root white outside that shell.

The masthead is now fixed with reserved shell padding, and document/body/root backgrounds use the newspaper theme. No JavaScript bundle or protocol behavior changed. Main CSS SHA-256 is `784f14a54af8ebafdde2a7dbad40a8edc3fde10dc6f413e9d03f6419c10dd502`; all entry JS and CSS bytes were checked against the uploaded artifact.

Verification: the new 1040px test failed against the prior production deployment. After the fix, lint, web types and export passed; the full local browser suite passed 18/18 (32.7s). Preview https://78a84cec.plumbline-f50.pages.dev passed five targeted scrolling/theme checks (12.1s), and https://plumblines.uk passed the same five (11.3s). Deep scrolling was checked at 390px, 1040px and 1586px; a separate dark-mode deep-scroll check passed. Rendered screenshots were inspected. The review was scoped to layout, theme and navigation regressions, not a new full nine-area UX audit. Existing release limits below remain.

Raw evidence uses the `docs/zeus/evidence/scroll-*` prefix. Identical `.cloudflare/pages-cc4f8fmx` files were uploaded to preview and production. The prior production version remains available for rollback.

## Initial version and destination

| Item | Value |
|---|---|
| Repository | https://github.com/Shikibashi/plumblines |
| Tested source / packaging commit | `4c5aa8ba81a79afdab1293316e351d4a599a882e` |
| Pages project / production branch | `plumbline` / `main` (direct upload) |
| Preview | https://28bcc20a.plumbline-f50.pages.dev |
| Production deployment | `31462629-65f9-4903-9065-b2bf6e3a60d6` |
| Immutable production URL | https://31462629.plumbline-f50.pages.dev |
| Uploaded at | 2026-09-23 05:17:59 UTC |
| Rollback deployment | `d22501c6-81da-4745-a4db-66731b6414e2` |
| Previous deployment URL | https://d22501c6.plumbline-f50.pages.dev |

Wrangler 4.136.3 uploaded the same 369-file artifact to preview and production. Production reused all uploaded files. The artifact was packaged from the previously built and tested export, without rebuilding between environments. Source maps were omitted; Pages provides SPA route fallback. The old public OAuth client metadata was retained byte-for-byte, but this does not establish compatibility with an old session's in-flight callback.

## Executed verification

- **PASS:** preview browser suite 15/15 (30.2s), guest-route exploration 3/3 (4.8s).
- **PASS:** production browser suite 15/15 (27.6s), guest-route exploration 3/3 (4.5s), using `https://plumblines.uk` as the base URL.
- **PASS:** HTTPS root, `/search`, `/feeds`, favicon, client metadata, all three entry scripts and both stylesheets return 200. JavaScript, CSS, favicon and metadata SHA-256 values match the local artifact.
- **PASS with recorded edge transformation:** custom-domain HTML matches the local index after removing only Cloudflare's injected analytics script. Raw HTML does not match byte-for-byte. Preview HTML matched unchanged.
- **PASS:** live public Discover posts and images render, responsive geometry and selected contrast/keyboard checks pass, and all three explored routes have zero JavaScript page exceptions.
- **PASS:** a browser-origin fetch from the live site to `https://pds.edriffles.us/xrpc/com.atproto.server.describeServer` returns 200 and `did:web:pds.edriffles.us`. The existing Docker PDS was preserved. This is public discovery, not authenticated login acceptance.
- **PASS:** existing HTTP security headers are present. The sole observed CSP violation blocks Cloudflare's injected analytics script; application scripts execute.

Main JS SHA-256: `652fa10df2f7598fbd8765175ac59170d3fba66764af879f3f9f6538f5677e22`.
Main CSS SHA-256: `7f019c5c84b114b2c3944c092e430d761e8d4df844781f33be97e1927c9df83e`.

The earlier local checks passed lint, web/iOS/Android types, production export, 82 Jest suites / 891 tests / 21 snapshots (28 inherited todo). CI at source commit `6e97716709e3ba5c5f19f359242b41247296645e` passed lint, formatting, all platform types, all four Jest shards, Go tests, licensing, workflow audit and the regenerated-lockfile check. Bundle analysis was still pending when inspected; no blanket final-CI PASS is claimed.

## Remaining limitations

Authenticated login completion, posting, mute/unblock, native devices and owner acceptance remain **NOT RUN**. Real public post search encounters an upstream `searchPostsV2` CORS rejection; search navigation/submission is verified, successful search results are not. Upstream geolocation, app-config and live-events endpoints also reject this origin. Deployment does not resolve these upstream integration gaps.

Cloudflare injects its existing Web Analytics script on the custom domain. CSP blocks execution. Pages-level analytics fields are null; the available Wrangler OAuth token cannot access the zone RUM configuration (403), so no zone settings were changed. This blocked request is recorded rather than concealed or enabled by relaxing CSP.

Inherited dependency advisories remain: 1 critical, 54 high, 22 moderate, 5 low, matching the untouched baseline. Static Pages hosting also does not supply the upstream Go server's dynamic social-preview metadata. The full release result remains **PARTIAL**, while this requested deployment and its guest-browser verification are complete.

## Rollback and evidence

Restore the prior production deployment `d22501c6-81da-4745-a4db-66731b6414e2` through the existing Pages project's rollback action if needed. No previous deployment was deleted. See [Cloudflare's rollback procedure](https://developers.cloudflare.com/pages/configuration/rollbacks/) and the [packaging instructions](../../deployment/cloudflare/README.md).

Raw local evidence is under `docs/zeus/evidence/`: `cloudflare-before.json`, preview/production deployment logs, HTTP/hash receipts, browser/explorer logs and JSON results, and `cloudflare-production-desktop.png`. The artifact and SHA-256 manifest are under `.cloudflare/pages-0eyf2n50*`. These generated files are intentionally excluded from Git; reusable packaging and browser checks are versioned.
