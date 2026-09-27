# Public blocked-content reader — 2026-09-23

The user requested access to blocked posts and blocked accounts. The client now offers explicit **View public post**, **View public profile**, and **View public quotes** controls. These use the existing credential-free public AppView client, separate query caches, and read-only cards. They do not clear block records or grant interaction permissions.

A blocked quote with a known URI can be fetched directly from the public service. Profiles offer their publicly available authored posts, pagination, and a return to the account view. Known profile mutes and public visibility labels remain effective. Deleted, unavailable, or restricted results remain unavailable. No private record lookup or PDS configuration change is involved.

## Concrete evidence

The quoted record in the user screenshot, `at://did:plc:dwilen7uctmqg2dstjjhl5zs/app.bsky.feed.post/3mte7gbhdsk2u`, is returned publicly and displayed after clicking **View public post** on the user's original thread. The browser verifies the real text beginning “Odd thing about Ayn Rand”, a request to `public.api.bsky.app` without Authorization, no write requests, and no accidental parent-link navigation.

The parent's quote count is one, but its public `getQuotes` response currently contains no posts. A count does not identify the missing record. The UI now says **No quotes available** and explains the service limitation; it does not claim the missing quote was recovered.

## Validation

- **PASS:** lint, iOS/Android/web TypeScript checks, optimized web build.
- **PASS:** focused block-policy and moderation Jest suites, 7/7 tests. Earlier full-suite results are recorded separately, not repeated for this source revision.
- **PASS:** local full browser suite, 28/28 (51.1s), including the 18 newspaper/scrolling cases.
- **PASS:** Cloudflare preview, 10/10 new browser cases (25.8s).
- **PASS:** production custom domain, 10/10 new browser cases; the real blocked post from the screenshot renders successfully. Entry JavaScript/CSS hashes match the uploaded artifact.
- The actual blocked-post recovery and current empty quote response use live public data. Unavailable-post and visibility-label checks alter responses. All six profile cases use deterministic fixtures covering each block direction, list blocking, pagination, refusal, visibility labels, and mute Show/Hide. They verify deployed UI behavior, not credentialed live-account acceptance.
- **NOT RUN:** native device execution and authenticated owner acceptance. No account mutations were attempted.

The first local browser attempt overlapped an export rebuild that temporarily removed `dist`; it is INCONCLUSIVE. The final 28-case run used the completed export and passed. A pre-commit check also caught an untyped test response; its type annotation was corrected and normal hooks passed. Runtime source was unchanged by that test-only correction.

## Artifact and deployment

Tested source: `33abbf24832ce908e55c2c370e73eafcd34e80d8`.

Preview: https://1694803e.plumbline-f50.pages.dev.

Production: https://plumblines.uk, deployment `691324f3-e1ad-4a16-8d47-8b404f59c84d`, immutable URL https://691324f3.plumbline-f50.pages.dev, uploaded 2026-09-23T05:58:50.614558Z. All three entry JavaScript files and both stylesheets match the tested artifact byte-for-byte.

The identical packaged export at `.cloudflare/pages-c4bqrn8h` is used for preview and production. Its SHA-256 manifest is `.cloudflare/pages-c4bqrn8h-sha256.json`. Packaging excludes source maps and preserves existing security headers and legacy OAuth metadata.

Immediate rollback target: `3d164850-39b9-4484-89a3-f9d3d1b974f5`. No previous deployment is deleted. The existing Docker PDS, tunnel routes, DNS, and account records are unchanged.

Raw logs, browser results, screenshot, asset hash receipt, and selected Cloudflare metadata are under `docs/zeus/evidence/public-reader-*` and `public-blocked-post.png`; generated evidence is intentionally ignored by Git. Existing search/CORS, analytics-injection, dependency-audit and broader release limits remain as recorded in [the main deployment receipt](cloudflare-deployment-2026-09-23.md).
