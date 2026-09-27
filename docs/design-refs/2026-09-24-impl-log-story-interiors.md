# Implementation Log: Story Interiors and Reading Sheets

## Prompt Contract

Implement `docs/design-refs/2026-09-24-experience-story-interiors.md` and `docs/design-refs/2026-09-24-layout-story-interiors.md`. Preserve current masthead, page compositor, palette, one-scroll sheets, data ordering, protocol behavior, moderation and Settings placement for mutes. Change the dispatch story interior and Reading browse/open state; keep mobile linear and article text narrow.

## Scope

- Plumblines-owned dispatch adapter and presentation styles.
- Minimal upstream presentation seam in `PostFeedItem` that reuses existing behavior nodes.
- Reading front grid and separate article sheet state.
- Compact utility and edition-editing furniture.
- Meaningful component/E2E coverage and fresh rendered QA.

## Preserved

- AT Protocol post and Standard.site data/query pipelines.
- Post actions, moderation state, quote/embed support, accessibility metadata, and blockless write policy.
- Page compositor, source ordering, sheet navigator, and deployment/export configuration.

## Implementation map

- Reused upstream: `PostFeedItem` behavior tree for moderation, content warnings, author/time, rich text, quote/reply context, media embeds, accessible post actions, and protocol semantics; existing Standard Reader index, fetches, pagination, and document renderer.
- Plumblines-owned: `src/plumblines/frontpage/EditorialDispatch.tsx`, editorial treatment CSS, section-front grid treatment, and Reading front/article state.
- Upstream integration seam: `src/view/com/posts/PostFeedItem.tsx` adds the opt-in `renderPlumblinesEditorial` callback and content markers, bypasses only the avatar-first composition for Plumblines, and passes the existing behavior nodes through named slots. Moderation and protocol action logic remains upstream.
- The former `DispatchStory.tsx` wrapper was replaced by `EditorialDispatch.tsx`.

## Delivered

- `EditorialDispatch` receives named `reason`, `byline`, `context`, `body`, `actions`, and `supplemental` slots from the upstream post behavior tree. Conventional upstream feed rendering remains unchanged where the opt-in callback is absent.
- Editorial styles give lead/feature/brief text distinct measures and scale, add a lead marginal rule, flatten quote-post cards into a ruled clipping, and make action controls subordinate. Image-bearing stories are image-forward; brief media gets a thumbnail treatment. Reply and repost attribution retain their upstream semantics.
- The Reading front presents a source-ordered article grid without a persistent detail pane. Opening a document replaces the index with the existing Standard.site article renderer and a `Back to Reading` control; phone layout is linear.
- `View` tucks Reader mode into a disclosure. `Edition` groups section management, front-page layout settings, and keyboard help. Account, word, and local attention controls remain in Settings.
- `DESIGN.md` documents the dispatch presentation seam and Reading as its own destination.

## Verification

- `pnpm typecheck:web` — PASS.
- `pnpm lint` — PASS.
- `pnpm test --runInBand src/plumblines/__tests__/policy.test.ts src/plumblines/__tests__/unblock-menu.test.tsx` — PASS, 15 tests; blockless policy coverage remains green.
- `pnpm build-web` — PASS; web export completed. Metro emitted module warnings and Sentry upload was skipped because no token was configured.
- `pnpm test:plumblines:e2e tests/plumblines/newspaper.spec.ts tests/plumblines/v1.spec.ts` against the fresh export at `127.0.0.1:8137` — PASS, 33/33. Includes responsive checks from 390px through 1586px, contrast, reduced motion, scroll continuity, Reading open/back, dispatch rendering, and keyboard navigation.
- Local browser screenshots were inspected at desktop and 390px widths. This is local-render evidence only; no production deployment or Cloudflare acceptance was performed.

## Deliberate limits / next pass

- This establishes a Plumblines presentation boundary while retaining upstream rendering internals. Separate custom `DispatchByline`, `DispatchMedia`, `DispatchQuotation`, or `DispatchActions` components were not extracted. Complex embed, attribution, and content-warning behavior stays upstream by design.
- Visual stories reuse upstream embed and moderation behavior rather than introducing a separate caption/byline-first photo-story renderer.
- Edition settings are grouped behind publication furniture, but a staged visual layout-editing mode remains follow-up work. Folio styling can be refined after story interiors.
- Standard Reader tests use mocked API responses; public-service availability, cross-format ecosystem coverage, and production behavior are not verified by this local run.

## Paper-object depth refinement — 2026-09-24

### Change

- Added light/dim/dark raised-paper and shadow tokens in `src/style.css`.
- Gave `.newspaper-sheet` a crisp offset stock edge and a shorter responsive shadow; the full-width newspaper sheet, Reading grid, article measure, and scroll remain unchanged.
- Changed quote-post insets to square raised-paper clippings with a perimeter edge, the existing source rule, and a small lower shadow.
- Updated `DESIGN.md`, the Story Interiors experience contract, and this design log. Added [the selected paper-depth direction](2026-09-24-direction-story-interiors-paper-depth.md).

### Fresh visual evidence

- **PASS — candidate comparison:** soft lift, layered edges, and separate under-sheet previews used the same marked article fixture at 1440×900 and 390×900. Layered edges were selected; screenshots are in `evidence/paper-depth/`.
- **PASS — source-backed local render:** the Expo web development server loaded the current source CSS. The selected sheet and article were reviewed at 1440×900 and 390×900 in light mode; source screenshots are linked from the direction artifact.
- **PASS — system-dark appearance:** `colorScheme: dark` selected the app's `theme--dim` variant. Desktop and phone article screenshots show the selected edge and theme tokens.
- **PASS — dark token and clipping selector probe:** `theme--dark` resolved to raised paper `#302d27` and a dark shadow. The quote DOM shape resolved to a 3px source rule, raised-paper background, and layered shadow.
- **NOT RUN by this task — automated tests and production export:** this refinement changes CSS and design documents only; it adds no data or protocol behavior. The local source render verified stylesheet parsing and responsive appearance. Existing tests were not rerun, and I did not initiate an export.
- **NOT VERIFIED — authenticated quote content:** the clipping probe validates the presentation selector and computed style, not a live or authenticated post feed. No public service, deployment, or owner acceptance was performed.

### Evidence boundaries

The article content in the new screenshots is marked test data served by a local mock. It is not a public Standard Reader result. These browser renders confirm local visual behavior only.

During this pass, a separate `pnpm build-web` process was observed running `pnpm intl:build` and modifying locale catalogs. It was not started or stopped by this task; those locale changes were left untouched, and its build result is not used as evidence here.
