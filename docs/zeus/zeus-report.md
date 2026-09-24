# Zeus report: Plumblines

## Current editorial newspaper expansion — 10:18 UTC

**Implemented and deployed web scope: PASS. Full product acceptance: PARTIAL.** The old Home composition gave configurable feeds equal dashboard columns, per-column controls and independent scroll regions. The new front page uses one document scroll, responsive paper sheets/folios, a newspaper section rail, asymmetric deterministic story treatments and an explicit lead chosen from reader configuration. Social posts continue to use their actual text; Standard.site documents use document titles and the shared Standard Reader renderer.

The implementation is recorded in [the design specification](../plan/plumblines-editorial-frontpage/spec.md), [implementation map](../plan/plumblines-editorial-frontpage/implementation-map.md), and [verification report](../plan/plumblines-editorial-frontpage/verify-report.md). Reused upstream components and the small shared-file surface are listed there. No upstream Home screen, post internals, PDS protocol code or moderation read paths were rewritten. Block/list-block creation remains rejected by the write policy; removal remains allowed.

Production now serves Cloudflare deployment `1abaaf7f-e124-4fe3-aa1b-9c50ed955a63` on <https://plumblines.uk>, built from source `e65ebee`. The exact packaged Pages artifact passed 40/40 browser cases on both preview and the live custom domain. A separate production-browser smoke loaded the public Standard Reader index and rendered a real body-bearing article. See the [deployment receipt](editorial-frontpage-deployment-2026-09-23.md). The immediately previous production version, `a1ec660d-f432-44dc-aaf4-9919babb15d3`, remains available for rollback.

Current checks: optimized web export, lint, iOS/Android/web typechecks, 19 focused Jest tests, 40/40 preview E2E, 40/40 production E2E, live Reading browser smoke, and Docker `/healthz` all pass. The full inherited Jest suite was not rerun in this expansion. Authenticated mutations, native device builds, assistive-technology certification and OS-level installation are not claimed. The upstream search/app-config/geolocation origin limits and previously recorded dependency advisories remain open. Full Zeus/product acceptance is therefore **PARTIAL**.

### Old front page and new composition

| Previous dashboard form | Editorial newspaper form |
|---|---|
| Equal feed boxes with controls in the reading flow | Section furniture with controls behind settings |
| Independent section scrolling | One page scroll with visible sheet/folio landmarks |
| Upstream `PostFeedItem` as the only front-page treatment | Plumblines deterministic treatment adapter over the same upstream post data |
| Generic long-form embed prominence | A distinct Reading page/index using Standard.site metadata and renderer |
| Equal columns imply no reader-selected lead | Lead section and templates follow saved reader configuration; no engagement ranking |

The preceding v1 and initial fork reports below remain historical release records.

## Current newspaper v1 result — 07:09 UTC

**Scoped v1 implementation and deployment: PASS. Full product acceptance: PARTIAL.** Configurable account-local feed/list/search sections, strict Following, two-column reading, per-section filters, local snoozes, reader/article modes, moderated PNG sharing, post/DID/PDS and custom-record inspection, keyboard controls and PWA metadata are live on https://plumblines.uk. Existing public blocked-content readers and removal-only moderation remain available.

Final validation: 957 unit tests / 95 suites / 21 snapshots (28 inherited TODO), lint, formatting, all three platform typechecks, optimized export and Docker packaging pass. Local and Cloudflare preview browser suites each pass **38/38**. Cloudflare canonical production metadata confirms deployment `a1ec660d-f432-44dc-aaf4-9919babb15d3` and source `a832af79b19b29433d751bc36d45bd1fc78d864d`. See the [verification record](newspaper-v1-verification.md) and [deployment receipt](newspaper-v1-deployment-2026-09-23.md).

New in-app/custom-domain browser inspection is NOT VERIFIED because the browser policy service was unavailable. Authenticated account mutations, native device runs and OS-level PWA installation were not exercised. Existing dependency advisories and upstream service-origin/search restrictions remain open. V2 Editions, layout sync, folders/annotations, alternate AppViews and custom publishing remain deferred. The existing Docker PDS is unchanged.

## Original run history — superseded counts below

Date: 2026-09-23. **Result: PARTIAL** for the full product/release brief; the local newspaper client implementation is complete and its selected checks pass. This was the first run, with no prior artifact archive.

The fork now has the supplied newspaper direction: a large serif masthead, original botanical ornaments, paper/ink/oxblood theme, ruled navigation and context columns, and responsive reading layout. It displays real AT Protocol content. Fork identity/assets are separated from upstream, upstream analytics collectors are disabled by default, new account/list blocks are rejected locally, and feed explanations distinguish known state from unverified ordering/inputs.

## Phase results

| Phase | Result | Evidence |
|---|---|---|
| 0 parsing | complete | User brief and image translated into six capabilities; existing React Native/Expo/AT Protocol stack retained |
| 1 Zephermine | qualified | Three implementation sections and persisted spec/API/QA/flows; external model review and diagram rendering not run |
| 2 agent-team | complete locally | Branding and policy workers, planning/review worker, main newspaper integration |
| 3 Argos | CONDITIONAL | Eight requirements traced; 13 of 18 QA IDs PASS, 4 PARTIAL, 1 NOT RUN; details in verification report |
| 4 Docker | PASS | Digest-pinned non-root artifact image, healthy read-only runtime, loopback 8139 |
| 5 Minos | PASS within tested scope | 15/15 browser cases plus 3/3 coded guest-route exploration checks; 891 Jest tests / 82 suites, 28 upstream todo; 21 snapshots |
| 6 report | complete | This report and requirement/QA verification matrix |

`pnpm lint`, web/iOS/Android TypeScript checks and the optimized web build pass. The final splash and search-header changes were included in platform typechecks. Typecheck success is not a native device build. Container packaging uses the host-built export, not an in-container source build.

## Errors and recovery

| Finding | Recovery |
|---|---|
| Dark/dim primary labels failed contrast in native review | Use dark foreground on pale primary button backgrounds; browser contrast assertions pass |
| Sticky mobile headers overlapped masthead | Shared header offsets and dedicated search wrapper offset; scrolling regression passes |
| Startup animation still used an inline butterfly | Replaced both web/native splash vectors with the shared original Plumblines mark; source and rebuilt bundle checked |
| New production strings appeared as translation IDs | Build regenerates/compiles catalogs before export; tests assert real accessible text |
| Jest collected browser specs | Separate Jest/Playwright discovery; full unit suite passes |
| Test assumptions mismatched actual form/search roles | Inspect rendered controls; assert username/password form and Search combobox |
| Git hook applied browser Node-import rule to Expo config plugins | Narrow Node-environment lint override for plugins/tests; remove redundant async callbacks; hooks retained |
| Origin-restricted upstream requests | Captured and reported; not bypassed or mislabeled as working |

## Release gaps

- Public Discover reads work. Public `searchPostsV2`, geolocation, app-config and live-events services rejected local browser-origin requests. Search navigation/submission is verified; successful live search results are not. Resolve supported service access before release.
- Production dependency audit reports 1 critical, 54 high, 22 moderate and 5 low advisories. The unchanged upstream baseline reports identical counts. Reachability/remediation remains open.
- Authenticated login completion, posting, real mute/unblock operations and authenticated menu rendering were not exercised. No account credentials or real mutations were used.
- Native device builds/signing/push, full accessibility audit, full secret/history scan, externally reviewed translations and owner acceptance are not verified.
- The static container does not implement the upstream Go server's social-preview metadata routes. Existing protocol endpoints, native ABI names and third-party references intentionally remain where required for compatibility.

## Decision ledger

| Choice | Reason | Reversal |
|---|---|---|
| Paper serif with original leaf ornaments and 840px reading column | Supplied reference | Edit DESIGN.md, newspaper components, ALF/layout constants together |
| Compact rails below 1500px; single column below 980px | Keep existing controls usable | Adjust breakpoints and CSS offsets together, rerun responsive cases |
| Pinned Lucide glyphs and generated original artwork | Replace restricted asset classes while preserving component APIs | Replace through the asset map/generation scripts and retained notices |
| Existing feed ordering with accurate disclosures | Avoid unsupported ranking claims or protocol changes | Implement an explicit feed policy with matching source and browser tests |
| Block creation disabled, removals preserved | Requested attention-control policy | Change central capability and associated tests; do not alter server semantics |
| Non-root static export container | Reviewable local deployment without a new backend | Adopt the upstream Go server or chosen hosting adapter with separate verification |

## Review and reproduction

Source: `https://github.com/Shikibashi/plumblines`, branch `codex/plumblines-v1`. The untouched baseline is tagged `plumblines-baseline`. The first fork commit is the branding/licensing/configuration foundation; the second contains the newspaper UI, attention policy and verification setup.

See [local commands and upstream-sync guidance](../plumblines/README.md), [verification matrix](../plan/plumblines-v1/verify-report.md), [branding inventory](../plumblines/branding.md) and [execution log](zeus-log.md). Raw command output, JSON diagnostics and screenshots remain local under `docs/zeus/evidence/`; reusable tests are committed. The local preview is `http://127.0.0.1:8139`. Production is https://plumblines.uk; the [Cloudflare deployment receipt](cloudflare-deployment-2026-09-23.md) records 15/15 live browser checks, 3/3 guest routes, exact assets and rollback.

## Evidence grades

| Phase | Grade | Boundary |
|---|---|---|
| Planning | weak | Persisted plan/sections proved; external review and rendered diagrams not run |
| Implementation | proved | Three sections implemented in the actual fork |
| Verification | weak | Local checks pass; wider acceptance and advisory remediation remain open |
| Docker | proved | Built and healthy artifact container |
| Testing | proved | Selected guest/mocked test scope passes; not authenticated acceptance |

Review used Codex and native workers from the same available model family; no cross-family consensus is claimed.
