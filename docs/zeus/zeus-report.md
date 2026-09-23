# Zeus report: Plumblines

Date: 2026-09-23. **Result: PARTIAL** for the full product/release brief; the local newspaper client implementation is complete and its selected checks pass. This was the first run, with no prior artifact archive.

The fork now has the supplied newspaper direction: a large serif masthead, original botanical ornaments, paper/ink/oxblood theme, ruled navigation and context columns, and responsive reading layout. It displays real AT Protocol content. Fork identity/assets are separated from upstream, upstream analytics collectors are disabled by default, new account/list blocks are rejected locally, and feed explanations distinguish known state from unverified ordering/inputs.

## Phase results

| Phase | Result | Evidence |
|---|---|---|
| 0 parsing | complete | User brief and image translated into six capabilities; existing React Native/Expo/AT Protocol stack retained |
| 1 Zephermine | qualified | Three implementation sections and persisted spec/API/QA/flows; external model review and diagram rendering not run |
| 2 agent-team | complete locally | Branding and policy workers, planning/review worker, main newspaper integration |
| 3 Argos | CONDITIONAL | Eight requirements traced; 12 of 18 QA IDs PASS, 4 PARTIAL, 2 NOT RUN; details in verification report |
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
- Native device builds/signing/push, `plumblines.uk` deployment/TLS, full accessibility audit, full secret/history scan, externally reviewed translations and owner acceptance are not verified.
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

See [local commands and upstream-sync guidance](../plumblines/README.md), [verification matrix](../plan/plumblines-v1/verify-report.md), [branding inventory](../plumblines/branding.md) and [execution log](zeus-log.md). Raw command output, JSON diagnostics and screenshots remain local under `docs/zeus/evidence/`; reusable tests are committed. The preview is `http://127.0.0.1:8139`.

## Evidence grades

| Phase | Grade | Boundary |
|---|---|---|
| Planning | weak | Persisted plan/sections proved; external review and rendered diagrams not run |
| Implementation | proved | Three sections implemented in the actual fork |
| Verification | weak | Local checks pass; wider acceptance and advisory remediation remain open |
| Docker | proved | Built and healthy artifact container |
| Testing | proved | Selected guest/mocked test scope passes; not authenticated or production acceptance |

Review used Codex and native workers from the same available model family; no cross-family consensus is claimed.
