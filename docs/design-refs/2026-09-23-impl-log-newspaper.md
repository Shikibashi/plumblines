# Implementation Log: Newspaper Object

## Prompt Contract

From `docs/design-refs/2026-09-23-experience-newspaper.md`: preserve Page 1 composition and source order, make the continuing Following stream append as stable sheets beneath the same browser scrollbar, keep Reading separate, keep muting in Settings, add folio and return anchors, and preserve all upstream query/moderation semantics.

## Changed scope

- `src/plumblines/frontpage/model.ts`: deterministic item batching helper.
- `src/plumblines/frontpage/model.test.ts`: order, remainder, and lower-bound test coverage.
- `src/plumblines/sections/index.tsx`: Page 1/Reading separation and paginated visual sheets for Following/search continuation.
- `src/style.css`: sheet edge/surface separation, continuation sheet spacing, mobile surface overrides.
- `DESIGN.md`, `docs/plumblines/newspaper.md`: design and behavior source of truth.

## Preserved

No upstream post, query, moderation, account-action, telemetry, protocol-write, Standard.site, or deployment configuration files were intentionally changed. Block-creation policy remains owned by existing Plumblines enforcement and tests.

## Contract changes during implementation

The continuation is grouped at the presentation layer without introducing hard route pagination. The load-more controls and intersection observer remain so long as the existing cursor query provides more data. Reading remains a separate route/tab destination, not another feed appended below the stream.

## Verification

- `pnpm test -- src/plumblines/frontpage/model.test.ts`: PASS (11 tests).
- `pnpm lint`: PASS.
- `pnpm typecheck:web`: PASS (run after implementation; re-run below after final source edit).
- `git diff --check`: PASS before final formatting/build.
- `pnpm build-web`: PASS; final `expo export --platform web --source-maps` plus `post-web-build.js`: PASS.
- Local Docker preview rebuilt on port 8139; `/healthz` returned `ok` and home returned HTTP 200. No remote deployment.
- E2E PASS: lead-source cursor continuation; section-front cursor continuation; local attention controls absent from the front page; 390px responsive layout/no horizontal overflow; dark edition foreground contrast; no inherited telemetry from the front-page startup path.
- Browser visual observation: desktop live feed at approximately 1038×1150 and guest phone screenshot at 390×992. Three candidate renders and authenticated-phone content remain `NOT RUN`.
- Blockless invariant regression suite: PASS (30 tests across policy/write-boundary cases); source policy files unchanged.
