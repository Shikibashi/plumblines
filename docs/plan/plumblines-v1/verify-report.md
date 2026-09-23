# Plumblines v1 verification

Date: 2026-09-23. Source baseline: `16af73133eee1ef145b6146ad1ad07fefe88822e`. Branch: `codex/plumblines-v1`.

**CONDITIONAL** for the local web fork; **NOT READY** for an unqualified production release. The screenshot direction, original identity, no-block creation guard and truthful feed context are implemented. Native signing/device flows, authenticated account acceptance, origin-restricted upstream services and dependency advisories remain separate gaps.

## Requirements and evidence

| Requirement | Finding | Evidence |
|---|---|---|
| R1 fork config / telemetry | PASS for default config and observed guest collectors | identity/config modules; metrics tests; guest request observation |
| R2 asset boundary | PASS for replaced runtime classes; native distribution NOT VERIFIED | 172 pinned Lucide SVGs, 267 exports, 83 raster replacements, asset manifests/notices; no src imports of restricted top-level original glyphs |
| R3 block policy | PASS locally | direct creation and queue guard precede network/shadow; list block=true rejected; account/list removals preserved; 6 hook tests and independent static review |
| R4 reference presentation | PASS locally | original masthead/ornaments, paper/ink, rules, widened feed, responsive rails; real public content |
| R5 feed transparency | PASS pure derivation and guest browser; signed-in UI NOT VERIFIED | 14 context tests; source/loading/mixed/fallback/page cases; no invented newest-first claim |
| R6 integration | CONDITIONAL | original protocols/auth remain; platform typechecks pass; public feed reads pass; real search results blocked by upstream CORS; native/device and account writes NOT RUN |
| R7 responsive/accessibility | PASS for exercised checks | five widths; keyboard skip/focus; reduced-motion preference; light/dark masthead and dim/dark button contrast; mobile search sticky-header regression |
| R8 separated evidence | PASS | baseline and final command logs kept separately; local, mocked, container and external gaps distinguished |

## QA coverage

| IDs | Status | Limits |
|---|---|---|
| QA01–02 | PASS | baseline install/export/browser; changed lint/types/export/Jest |
| QA03–07 | PASS | mocked mutation spies; not live account evidence |
| QA08 | PARTIAL | entrypoints reviewed; authenticated UI not exercised |
| QA09–11 | PASS | guest desktop/mobile/tablet, keyboard and reduced motion |
| QA12 | PARTIAL | light/dark shell, dim/dark primary contrast; not every authenticated dialog |
| QA13 | PARTIAL | sign-in form and search navigation; no login completion; search-result CORS failure recorded |
| QA14 | PARTIAL | pure state cases and guest disclosure; authenticated rendering not exercised |
| QA15–16 | PASS within local scope | observed guest telemetry and bundled asset sources; no native store artifact |
| QA17 | NOT RUN | no authorized test-account credentials supplied/used |
| QA18 | NOT RUN | no hosted deployment performed |

Counting each QA ID once: 12 PASS, 4 PARTIAL, 2 NOT RUN. This is not 100% release acceptance.

## Review, API and flows

Native `codex review --uncommitted` found two P2 regressions: dark/dim primary label contrast and mobile header offsets. Both were corrected and covered by browser assertions. A second search-wrapper offset issue was caught by that browser coverage and corrected. Independent read-only policy review found no actionable guard defect.

No backend endpoint or Lexicon changes. Source traces map the three plan diagrams to: identity/env → collector initialization → existing navigator; action → creation guard → error, or existing removal/mute → existing cache handling; route/feed/preferences → context derivation → existing feed rendering. Diagram rendering and external model consensus were NOT RUN; this is a source trace, not executed coverage of every diagram edge.

## Runtime and external limits

The default guest Discover timeline returned live public posts. Guest sign-in opens the original username/password form. Real post-search submission reaches `app.bsky.feed.searchPostsV2` but the public AppView rejects this browser origin/preflight. Geolocation, app-config and live-events upstream workers also return origin-restricted responses. Console diagnostics are retained; zero page exceptions does not mean zero network errors. Do not remove origin or age/region checks to mask these failures.

The Docker image packages the verified host-generated export; it runs nginx as uid 101 with a read-only filesystem on loopback port 8139. It does not provide the upstream Go server's metadata rendering. Native typechecks are not native builds or device tests. Public domain, DNS/TLS, push/signing, account posting/muting/unblocking and owner acceptance are NOT VERIFIED.

## Security and dependencies

`pnpm audit --prod --json` reports 82 findings: 1 critical, 54 high, 22 moderate and 5 low. Repeating the audit against the untouched baseline manifest/lock returns identical counts. Those are dependency advisories, not 82 proven exploitable application vulnerabilities; reachability has not been fully assessed. No dependency-remediation PASS is claimed.

No new backend authorization surface or database. Block policy is an intentional client capability limit, not a server security boundary. Existing sessions and network blocks remain authoritative. No full history secret scanner, authenticated OWASP/STRIDE exercise or third-party endpoint penetration test was run.

## Module coverage

Zeus, Zephermine, agent-team-codex, Argos and Minos contracts were read. Native workers handled branding, policy and planning; main integrated the interface and verification. Code-reviewer contract/native CLI review and a bounded web-interface audit were used. Docker-deploy source module plus applicable Dockerfile/Compose references were loaded; templates were adapted to this frontend-only Linux repository. Full nine-area UX scoring, rendered flow verification and external-model consensus remain NOT RUN.

Raw evidence is local under `docs/zeus/evidence/` and excluded from source control; the reproducible tests are in `tests/plumblines/` and `tests/explore/`.
