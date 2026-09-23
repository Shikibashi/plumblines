# Cloudflare production deployment — 2026-09-23

**DEPLOYED:** https://plumblines.uk now serves the Plumblines newspaper client, replacing the previous Rust client. The user explicitly authorized this replacement. No DNS, PDS, tunnel, database or account records were changed.

## Version and destination

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
