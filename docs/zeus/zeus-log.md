# Zeus execution log

## Phase 0 — parsing
- Current branch codex/plumblines-v1; source baseline 16af73133eee1ef145b6146ad1ad07fefe88822e. Working tree initially clean. No prior Zeus artifacts to archive.
- User brief copied to user-brief.txt; screenshot remains the authoritative appearance reference.
- [ZEUS-AUTO:mechanical] Reuse upstream React Native/Expo client and AT Protocol. No new database/backend or protocol divergence.
- Chronos setup-loop executed for Codex; state file created. Desktop hook execution is not verified.
- Upstream dependency install passed (pnpm 12.4.2 vs preferred 11.23.0; actual engine node >=24.19). Baseline build running before source edits.

## Phase 1 — planning
- Zephermine delegated to planning worker; no interactive questions. Brand/policy workers inspect read-only in parallel.

## Phase 2 — agent-team-codex
- Path A, three exclusive sections: branding worker, policy worker, main UI. Planning worker independent bounded policy review. MCP NOT SELECTED.
- Baseline build exit0; actual guest browser read at localhost8137 returned live public Discover posts with zero page errors. Screenshot baseline-desktop.png. No user authentication/writes.
- Policy hooks 6/6, combined reference-list regression 8/8 pass (worker evidence). Static independent review found no blocker; authenticated menus remain unverified.
- First web typecheck failed two new missing UI imports; corrected. Next web typecheck passed.
- First lint identifies import ordering and native-only text rule applied to web HTML. Scoped autofix and explicit web-only exception; no broad suppression file regeneration.
- [ZEUS-AUTO:taste] Paper serif web theme, large original masthead, 840px reading column, responsive rails. Rationale: user screenshot. Alternative: retain 600px social geometry rejected. Reverse through section-03 changes.
- [ZEUS-AUTO:taste] Asset replacement uses vendored pinned Lucide symbols; no new runtime package. Required to remove upstream glyph license dependency. Reverse by substituting another licensed symbol set via mapping.

## Phase 3 — Argos verification and native review
- Native `codex review --uncommitted` completed. Two P2 findings: primary-button contrast in dark/dim and mobile sticky page-header offsets. Corrected foreground and header positioning; targeted browser tests cover both.
- Independent planning worker read-only review of no-block guards found no actionable issue. Main traced the three source flow diagrams; diagram rendering/external model consensus NOT RUN.
- `pnpm lint` and all three platform typechecks PASS. Full Jest suite: 82 suites, 891 passed, 28 upstream todo, 21 snapshots. No credentialed acceptance claimed.
- `pnpm audit --prod --json`: 1 critical, 54 high, 22 moderate, 5 low findings. An isolated audit of the unchanged baseline lockfile returns identical counts. Dependency remediation and exploitability review remain release work; no blanket dependency upgrade in the UI fork.
- Scoped web-interface review: semantic HTML links/details, keyboard skip/focus, responsive geometry, dark/dim primary actions and reduced-motion. Full assistive-technology audit NOT RUN.

## Phase 4 — Docker setup
- Read docker-deploy exact source module and Dockerfile/Compose references. Frontend-only adaptation: no invented database, backend, reset script or test account.
- Docker 29.8.0 available. Unrelated running services inspected and preserved. Used free loopback port 8139.
- Exact compose file: docker-images/docker-compose.yml; image built from the host-compiled Expo export using digest-pinned nginx-unprivileged. This is artifact packaging, not compilation inside Docker.
- `docker compose -p plumblines -f docker-images/docker-compose.yml up -d --build` succeeded; health=healthy, uid=101, read-only filesystem. No deployment to public domain.

## Phase 5 — Minos browser tests and recovery
- Production-export Playwright suite created and executed, with screenshots/traces. First cycle caught missing generated message catalogs and incorrect test assumptions about the login button. Build now regenerates all catalogs; account form expectation matches actual username/password controls.
- Second cycle: 11/15 passed. Fixed search sticky wrapper; corrected combobox role and isolated display-preference fixture in tests. Targeted search and dark/dim button checks: 3/3 passed. Final full rerun pending below.
- Coded guest exploration of /, /search and /feeds: 3/3 navigation/no-page-exception checks passed. It also captured CORS rejections from upstream origin-restricted geolocation/app-config/live-events services, and public searchPostsV2. Search submission/navigation works; successful real post-search results are NOT VERIFIED. Public Discover post reads work.
- These external-service errors are retained in evidence and release gaps, not suppressed. No remote account mutations or authenticated sessions were used.

- Final container-backed Minos run: 15/15 PASS (22.0s); coded guest exploration: 3/3 PASS (3.8s), with upstream network limitations retained in JSON. Full Jest rerun: 82 suites, 891 tests passed, 28 todo, 21 snapshots.
- Native review fixes, production catalog extraction, mobile search wrapper and button contrast were reverified. Git hook exposed Node-only plugin lint scope and unnecessary async callbacks; corrected scoped configuration/callbacks, without bypassing hooks.

## Phase 6 — final report
- All phase attempts and numeric test evidence exist. Result PARTIAL: local implementation complete and green; broader acceptance has documented external and unexecuted gaps.
- Branding foundation is a separate first commit. Baseline tagged plumblines-baseline. Remaining interface, policy, tests and reports form the second review commit.
- Local Docker preview remains available at http://127.0.0.1:8139; redundant task-owned dev/preview processes are stopped after verification.

- Final visual inspection caught inline butterfly vectors in React startup components (separate from HTML splash). Replaced web/native vectors with PLUMBLINE_PATH and rebuilt. Responsive screenshots now wait for actual feed content.

## Cloudflare replacement authorized and completed
- Inspected the existing `plumbline` Pages project and live production deployment, Docker PDS and tunnel routes. Preserved existing service configuration. Read Cloudflare and Wrangler skill instructions.
- Packaged the tested export with `/static/` assets, source-map exclusions, security headers and preserved legacy OAuth metadata. Preview 15/15 browser and 3/3 guest-route checks passed.
- Uploaded identical files to production branch `main`; deployment `31462629-65f9-4903-9065-b2bf6e3a60d6` now serves https://plumblines.uk. Live 15/15 browser and 3/3 route checks passed.
- Verified JS/CSS/metadata hashes and public PDS discovery from the live browser origin. HTML differs only by existing zone analytics injection, blocked by CSP. Wrangler cannot access zone RUM configuration (403); no zone settings changed.
- Retained prior production deployment for rollback. Full details and remaining authentication/search/dependency limits are in cloudflare-deployment-2026-09-23.md.

## User-reported deep scrolling regression
- Reproduced the attached narrow-desktop screenshot on production: the sticky masthead leaves its viewport-height shell at scrollY 1800, while tabs remain at top 148px. Static HTML theme specificity exposes white document/root backgrounds.
- Fixed the masthead to the viewport with shell padding and full-width opaque background; applied newspaper variables to document/body/root. Kept native and protocol flows unchanged.
- New deep-scroll regression fails on the old site. Lint/web types/export and all 18 local browser cases pass. Five preview and five live production checks pass, plus a dark deep-scroll inspection.
- Deployed identical preview artifact to `3d164850-39b9-4484-89a3-f9d3d1b974f5`; entry assets match local hashes. See updated deployment receipt.

## Public reading through block placeholders
- Added explicit public post/profile/quotes views using the existing credential-free AppView client, isolated query keys and read-only cards. No block records, private collections, interaction permissions or PDS settings are changed. Known profile mutes and public visibility labels remain effective.
- The screenshot's real blocked quote renders via its known URI. The separate quote-count mismatch remains a service limitation: public getQuotes returns zero entries, and the UI now explains that accurately.
- Lint, all three platform types, build, focused 7/7 unit tests, and local 28/28 browser cases pass. The first browser attempt overlapped export rebuilding and is INCONCLUSIVE; the final run passed after export completion. A test response type was fixed after pre-commit lint; hooks then passed.
- Preview 1694803e and production 691324f3-e1ad-4a16-8d47-8b404f59c84d each pass all 10 new cases. The blocked-post read uses real public data; six blocked-profile cases use fixtures, not authenticated account acceptance. All five entry JS/CSS hashes match the artifact on plumblines.uk.
- Source 33abbf24832ce908e55c2c370e73eafcd34e80d8; immediate rollback 3d164850-39b9-4484-89a3-f9d3d1b974f5. Details: public-reader-deployment-2026-09-23.md. Broader release limitations remain recorded separately.

## Removal-only moderation capabilities
- User pasted a revised architecture: omit block creation capabilities rather than retaining dormant guarded branches. Existing public blocked-content readers remain in scope and unchanged. Initial checkout 150a1d5fc was clean, with no linked worktrees.
- [ZEUS-AUTO:mechanical] Reuse upstream mute/unmute/report/delete hooks, add no protocol/backend/dependency changes. Main owns shared menu/dialog and docs; exclusive workers own data/write guard, chat controls, and list/Existing Blocks controls. Source module code-reviewer loaded; orchestrator MCP NOT SELECTED.
- Account/list creators, toggles, dead BlockDialog and hidden chat creation handlers were removed. Account capability composition exposes muting and conditional unblocking; four account menu surfaces share a direct Menu.Item builder. Write defense covers serialized create/put/applyWrites through authenticated PDS/AppView/chat clients. Deletions are allowed.
- Independent UI review caught native Menu.Group dropping wrapper components; corrected builder to return a direct Menu.Item and covered actual native filtering in Jest. Confirmation dialogs remain outside Menu.Outer.
- Native codex review --uncommitted found no actionable regressions in the core refactor, independently running 29 focused and 117 session tests plus all platform types. Main full Jest run passed 84 suites / 914 tests / 21 snapshots (28 inherited todo); final request-mute addition verified separately below.
- Lint initially caught one obsolete suppression from removed SubscribeMenu code. Tool-driven pruning only lowered that existing count from two to one; no new suppressions added. Lint and iOS/Android/web typechecks pass.
- Graysky account-actions source checked live: separate block/unblock/mute operations confirmed; Plumblines omits its creation capability. Other pasted client comparisons remain unverified and are not used as implementation evidence.

## 2026-09-23 — expanded newspaper v1 implementation

- Resumed Zeus for the user's latest attached final V1/V2 hierarchy. Plan: `docs/plan/plumblines-newspaper-v1/plan.md`. No new dependency, backend or protocol introduced.
- Phase 1: scope/ownership/QA/data flow persisted. User brief supplies requirements; automated decisions are recorded as such, not a human stakeholder interview.
- Phase 2: agent-team-codex native workers split sections/query tuning, reading/thread presentation, and records/PWA; main integrates storage, attention, menus and shell. Implementation checklist N1–N10 implemented; runtime acceptance pending.
- Phase 3: initial integrated lint PASS, iOS/Android/web types PASS, Jest 92 suites / 948 passed / 28 TODO / 21 snapshots PASS. Independent review found invalid snooze timestamps and a share-image moderation bypass; both corrected with regression coverage. Native CLI review running, single-model evidence only.
- [ZEUS-AUTO:taste] No service worker caching: v1 installs metadata, v2 owns offline Editions. Existing icon assets reused without editing.
- Phase 4/5 pending completed export, Docker refresh and browser checks. Production still bc9995ac until preview acceptance.
- In-app browser inspection NOT VERIFIED: selecting the existing plumblines.uk tab was denied because the admin-enforced browser policy service was unavailable. Do not bypass that browser control. The established local/preview software test harness can validate the application artifact; do not report a successful new in-app or custom-domain browser inspection.
- Browser healer: original 28 regressions passed on the initial Docker export. PWA test exposed nginx's octet-stream manifest MIME (fixed with explicit application/manifest+json). New fixture source selector corrected to combobox role; explicit English language added so inherited language filtering does not silently omit short test posts.
- Browser tests exposed masthead z-index 25 above existing dialog layer 10, intercepting close buttons. Lowered masthead to 5 and rebuilding; tests retain real clicks rather than forcing through overlays. Thread reader controls now use Layout.Center so the desktop rail cannot cover them.
- Subsequent full static/unit validation: 95 suites / 957 tests PASS, 28 TODO, 21 snapshots; lint PASS. Test fixture userDid and incomplete-thread marker review findings resolved. Source freeze pending final rendered checks.
- Dialog stack retest contradicted the initial z-index-only fix: the portal Pressable itself creates a stacking context. Promoted that outer web dialog root above the masthead (z-index 30), restored the existing masthead level, and rebuilt. This is the final candidate; no forced-click workaround is accepted as proof.
