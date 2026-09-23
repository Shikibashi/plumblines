# Editorial front page verification

Date: 2026-09-23. Repository: `/var/home/tcs/Code/plumblines`, branch `codex/plumblines-v1`. This report covers the current editorial-front-page work only. The earlier 957-test v1 run is historical context and is not counted as current-run evidence.

## Scope and result

**Result: PASS for the implemented and deployed web scope, with acceptance qualifications.** The front page is a deterministic, one-document-scroll composition with responsive sheets and templates. The preview and live custom domain both pass the full 40-case browser suite. Separately, the live production Reading section fetched 20 current Standard Reader entries and opened a real body-bearing document through the shared renderer. Authenticated account mutations and native device acceptance were not exercised.

| Requirement | Result | Evidence |
|---|---|---|
| Single composed page, no nested feed scrollbars | PASS | `tests/plumblines/newspaper.spec.ts` EFP composed-sheets case; 20/20 Docker browser cases. |
| Deterministic template and reader-selected lead | PASS | `src/plumblines/frontpage/model.test.ts`; EFP template/lead browser case. No ranking score is used. |
| Preserve social source content/moderation and blockless writes | PASS within changed boundary | Existing PostFeedItem/Post/ViewFullThread and feed/search hooks are reused. `src/plumblines/__tests__/policy.test.ts`: block/listblock create, put and batch writes reject; deletes and ordinary post writes remain allowed. |
| First-class public Standard.site Reading | PASS | API parser tests; deterministic index/body fixtures in browser coverage; separate production-browser smoke fetched the current public index and rendered a real body-bearing document through `@standard-reader/renderer-react`. |
| Section settings/provenance out of the reading flow | PASS | Settings live in per-section details; source and ordering explanations use actual source behavior. |
| Responsive shell, focus and motion | PASS for exercised web viewports | Browser checks at 390, 768, 1024, 1280 and 1586px; light/dark contrast, skip link, reduced motion and deep scrolling. Desktop, phone and dark screenshots are under `docs/zeus/evidence/`. |
| Existing static deployment and package | PASS | Optimized Expo web export; digest-pinned unprivileged Docker image built and `/healthz` returned `ok`; the same 389-file Pages package was promoted from preview to production and the homepage, quote route, manifest, and full live browser suite passed. See the [deployment receipt](../../zeus/editorial-frontpage-deployment-2026-09-23.md). |

## Argos phases

| Phase | Result | Notes |
|---|---|---|
| 0. CPS traceability | PASS | P1-P5 map to R1-R7 and implementation sections. AppView, local preferences, Standard Reader, Expo shell and static hosting have explicit section coverage. |
| 1. Static requirements | PASS with scoped limits | Source map and implementation map identify reused upstream components and the two narrow shared-file touch points. No app/API backend is introduced. |
| 2. Runtime | PASS | `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck` (iOS/Android/web), optimized `pnpm build-web`, and 19 focused Jest tests across 3 suites passed. |
| 3. API spec | N/A | There is no server API implementation or `api-spec.md`; Standard Reader is a public external read adapter, checked against actual responses and parser fixtures. |
| 4. QA scenarios | PASS for the exercised suite | 40/40 Playwright cases passed against Cloudflare preview and again on `https://plumblines.uk`. The E2E Standard.site case uses deterministic API fixtures; a separate live production-browser smoke fetched the public index (20 entries, 4 body-bearing) and rendered a real Japanese-language article body. Several authenticated account/moderation flows remain outside this guest suite. |
| 5. Process diagrams | NOT RUN | This plan has no `flow-diagrams/`; no process diagram was available to compare. |
| 6. Design and UI | B / 8.0 of 10, visual pass | Rendered desktop, phone, dark edition and article screenshots were inspected. Hierarchy, editorial typography, page landmarks and non-card composition are clear. Empty signed-out Following is honest and the public Reading index is separate. Loading remains visible while the public source responds. |
| 7. Security | PASS within changed boundary | Block-write defense remains tested; Standard Reader requests omit credentials; URI/schema parsing is strict; unsafe URL schemes/hosts are rejected; links use `noopener noreferrer nofollow`; renderer receives structured data rather than arbitrary HTML. Native CLI review found one P2 untranslated lead label, which was moved to Lingui and rechecked. |
| 8. Domain vocabulary | PASS | Dispatch, article, source/provider, lead, page, and Reading vocabulary preserve actual protocol/source distinctions. No fake headlines, datelines, provider rankings or issue metadata were introduced. |

### UI scorecard

| Area | Score | Observation |
|---|---:|---|
| Theme | 8/10 | Paper/ink contrast tested in light and dark; dim/dark variables remain restrained. |
| Responsive | 8/10 | Tested widths stay inside the viewport and collapse to one reading column on phones. |
| Accessibility | 7/10 | Skip link, focus, semantic landmarks and reduced-motion paths are exercised; this is not a full assistive-technology audit. |
| Loading/performance | 7/10 | Loading, empty, unavailable and error states exist; live article fetch is click-triggered. No bundle-performance budget was measured. |
| Forms | 8/10 | Existing sign-in route remains reachable from the new masthead controls. |
| Navigation | 8/10 | Section rail, sheet anchors and next/previous page links are clear; keyboard page-turn shortcuts remain deferred. |
| Type/spacing | 9/10 | Masthead/section/body roles are distinct; article body stays near a readable 60ch column. |
| Motion | 8/10 | No physical page-turn effects; reduced motion is covered. |
| AI-slop scan | 9/10 | No gradient dashboard, repeated rounded cards, three-column feature grid or fabricated editorial copy. |

Weighted total: **8.0/10 (B)**. This is based on rendered screenshots and the checks above, not a complete accessibility or performance certification.

## Evidence limits and deferred scope

- Standard Reader's public index mixes full documents with records whose body is not available. The UI labels those records and keeps the publication link; only body-bearing records enter the shared renderer. A live browser smoke observed 20 entries, 4 marked body-bearing; the sample document rendered normally. Reader-service moderation/filter completeness cannot be inferred from a missing label.
- The suite does not exercise authenticated posting, real mute/unblock mutations, native iOS/Android builds, or system-level PWA installation.
- New newspaper vocabulary is extracted through Lingui; translations beyond the English source fall back where catalogs remain untranslated and still need human translation review.
- Full inherited Bluesky social-thread, report, chat and public-blocked-content suites were not rerun in this expansion; those source paths are reused and were not edited.
- Publication search/follows, synchronized layout, reader-state writes, offline article cache, article publishing, and Standard.site image-share output remain future work.
- Search service CORS/availability and the upstream inherited dependency advisories documented in the v1 release receipt are unchanged by this UI work.

## Review and customization surface

The fork-specific implementation lives in `src/plumblines/frontpage/` and `src/plumblines/reading/standard/`. The Home route and upstream post component internals were left intact. Shared upstream files changed only at `src/style.css` and `src/storage/schema.ts`; the build also regenerates locale catalogs. See `docs/plumblines/upstream-maintenance.md` and the [implementation map](implementation-map.md) for the merge-conflict surface.
