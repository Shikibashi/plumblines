# Work sections and dependencies

## Section manifest

| Section | Name | Owns |
|---|---|---|
| A | Deterministic page model | Pure local layout, stable ordering, template placement and unit tests |
| B | Newspaper composition | One-scroll sheet composition, existing social source queries, dispatch treatments and settings |
| C | Standard Reading | Public document index/detail adapter, normalized renderer and article presentation |
| D | Shell and masthead | Responsive paper surface, compact/expressive masthead and route offsets |
| E | QA and evidence | Tests, verification matrix, screenshot evidence and release receipts |

## Ecosystem coverage

| System | Section | Disposition |
|---|---|---|
| AT Protocol AppView and inherited Bluesky feed/query components | B, E | Reuse existing APIs, moderation and post renderers; do not replace the service or mutate source records. |
| Plumblines local preference store | A, B | Reuse for reader-controlled local layout; add no network-synced lexicon. |
| Standard.site / Standard Reader public index and renderer | C, E | Public unauthenticated reads only; no publication search, private reader state or new backend in this release. |
| Expo navigation/shell and shared theme CSS | B, D | Keep the existing Home mount point and make the smallest shared-shell edits needed for responsive offsets. |
| Cloudflare Pages and Docker artifact hosting | E | Keep the current static export and deployment shape; no PDS/DNS changes. |

| Section | Owns | Depends on | Acceptance |
|---|---|---|---|
| A. Deterministic page model | `src/plumblines/frontpage/model.ts` and pure tests | Audit/spec | Same section order and source order always map to same template positions; no score/rank; corrupt local preference falls back safely. |
| B. Newspaper composition | `src/plumblines/sections/index.tsx`, `src/plumblines/frontpage/*`, selected Plumblines CSS | A | One page scroll; newspaper rhythm; menus/details hold settings; source context honest; all existing feeds/search and moderation work. |
| C. Standard Reading | `src/plumblines/reading/standard/*`, dependency declarations if justified | Standard API/package compatibility audit | Public latest/document reads; original metadata and body renderer; usable empty/error/loading states; no authenticated writes or custom Lexicons. |
| D. Shell and masthead | `src/plumblines/components/NewspaperMasthead.tsx`, `src/style.css` | B | Front-page and interior masthead modes; no covering/fixed-height surprises; 390/1040/1586px and light/dim/dark QA. |
| E. QA and evidence | `tests/plumblines/*`, docs in this planning folder, verification receipts | A-D | Determinism, accessibility/motion, no nested scrolling, source truth and compatibility regression checks pass. |

All sections are authorized implementation work in this brief. Defer only where acceptance cannot be met in the existing client boundary; record the evidence and the fallback.
