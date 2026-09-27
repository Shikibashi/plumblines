# Experience Contract: Story Interiors and Reading Sheets

## Source Mode

- Mode: product-derived
- Evidence: `docs/design-refs/2026-09-24-brief-story-interiors.md`; user-provided next-pass requirements; current code and local render audit, 2026-09-24.

## Product Facts

| Claim | Source | Captured at | Freshness/status | Allowed presentation |
|---|---|---|---|---|
| Dispatch text and author/time are supplied by the existing AT Protocol post view | Existing `PostFeedItem` and post record | 2026-09-24 | current | Preserve exact content and supplied identity/time |
| Public long-form documents come from the Standard Reader index and `site.standard.document` renderer | Existing Plumblines Standard Reader API/renderer | 2026-09-24 | current | Use actual document title, description, publication, author, dates, and body only when provided |
| Moderation, quote embeds, media, and post actions are handled by upstream components | Existing post/feed component tree | 2026-09-24 | current | Reuse and visually adapt; do not suppress warnings, labels, alt text, or action semantics |

## Benchmark Sources

- None for this delta. The user selected the existing Plumblines newspaper direction; no third-party layout is being copied.

## Page Goal

- User result: Scan source-attributed dispatches and articles, open a full article without losing place, and return to the Reading front.
- Product result: Make editorial organization visible within story controls while preserving protocol behavior and source truth.
- Observable success: dispatches show byline/time/text with quiet actions, quotation clippings remain moderated, Reading shows several article entries before selection, and article mode occupies a single readable sheet.

## Audience and Tasks

- Primary users: Plumblines readers, guests or signed-in.
- Priority task: Scan the newspaper, recognize a source/story type, and follow a dispatch or article.
- Start/completion: A page or Reading front is open; completion is opening a story or returning to the source front.
- Friction: generic social-card internals, quote-card styling, and a permanent list/detail dashboard.

## Header and Navigation

- Order: masthead/folio, section rail, unobtrusive view/account utilities, composed page.
- Desktop: section rail remains visible as publication navigation; editing tools open from a small “Edit edition” slip.
- Mobile: preserve direct section navigation, collapse utility actions to compact text furniture, keep controls touch-accessible.

## Core Message

- Promise: a reader-composed newspaper for the Atmosphere.
- Explanation: dispatches retain their original authorship and source order; article documents use their own metadata.
- Evidence: visible author/handle/time, repost/reply attribution, source labels, and actual Standard.site metadata.
- Next understanding: select an article to open its Reading sheet; use the return action to resume browsing.

## Content Integrity

| Content item | Classification | Evidence | Presentation rule |
|---|---|---|---|
| Dispatch text | verified | Original `app.bsky.feed.post` record | Render verbatim; never synthesize a headline |
| Quote/repost/reply attribution | verified | Feed reason and reply records | Keep protocol meaning explicit and concise |
| Article title/deck/byline/date | verified | Standard.site document/publication fields | Omit fields absent from source; no generated metadata |
| Prominence and article ordering | verified | User layout and Standard Reader ordering | Explain configured placement or service ordering; no inferred importance |

## Section Order

1. Masthead and section rail: show publication identity and current destination.
2. Front or configured section front: expose source-derived stories together with distinct treatments.
3. Reading front: show multiple actual articles as a user-browsable section, not a permanent inspector pane.
4. Article sheet: present selected document in a single reading measure with provenance and return navigation.

## CTA Strategy

- Primary: “Open article” with the genuine title included in its accessible label; opens the article sheet.
- Secondary: “Back to Reading” returns to the article front without losing the fetched list.
- Utility actions remain text-first and visually subordinate; no mute controls on the newspaper front.
- Loading, error, empty, and retry messages remain adjacent to the affected source/list.

## Trust Strategy

- Concern: whether Plumblines rewrote content, chose a political/editorial ranking, or hid moderation state.
- Evidence: source identity, real metadata, exact social text, provider ordering, and retained moderation warnings.
- Missing metadata is omitted or described as unavailable; no invented headline, byline, location, publication, or reading time.

## Asset Provenance

| Asset | Source | Local path | License/trademark/attribution | Modification allowed | Status/fallback |
|---|---|---|---|---|---|
| Existing Plumblines type/ornament | Project-owned assets and `DESIGN.md` | `src/plumblines/`, `assets/` | See `ASSETS.md` and `NOTICE.md` | Existing permitted use | Retained |
| Post images/video | Existing AT Protocol embed renderer | Remote media | Preserve author alt text and moderation | No content alteration | Existing warning/fallback |
| Article cover/body images | Standard.site document metadata | Remote document media | Source attribution and renderer policy | No content alteration | Omit unavailable media |

## Desktop Structure

- Reference viewport: 1440×900.
- First view: masthead, section navigation, page furniture, then several visible editorial packages.
- Reading front uses an asymmetric, source-ordered grid; no article-detail rail until an article is opened.
- Article mode uses metadata, optional cover, then one 55–65ch body column.
- The main document remains the only front-page scroll context.

## Mobile Transformations

| Desktop element | Operation | Mobile result | Reason |
|---|---|---|---|
| Dispatch author/avatar row | compress | Compact byline with avatar subordinate or omitted where redundant | Prioritize actual text while retaining identity |
| Dispatch action cluster | compress | Quiet labels/icons with minimum 44px target | Keep protocol actions reachable without dominating prose |
| Quote clipping | retain | Ruled inset with wrapping text and visible source | Preserve relationship and reading order |
| Reading article grid | replace | Single-column article front | Preserve scan order and avoid horizontal overflow |
| Article list/detail split | replace | Article selection opens full-width reader; “Back to Reading” restores front | Keep long-form focus and make state transition explicit |
| Edition configuration | collapse | Small “Edit edition” control opens its existing paper slip | Keep configuration out of normal reading flow |

## States

| State | Trigger | User sees | Available action | Recovery |
|---|---|---|---|---|
| loading | Index or article request pending | Existing loading status on the Reading sheet | Wait | Keep navigation stable |
| empty | Index has no documents | Clear no-articles message | Return to Front Page | Section rail |
| error | Index/document request fails | Inline error and retry | Retry fetch | Preserve prior entries when possible |
| success | Article opens | Actual title, metadata, body or unsupported-body message | Back to Reading | Return to prior section front |

## System Roles

- NOT APPLICABLE: one reader/guest interface; account permissions remain upstream.

## Role Variants

- NOT APPLICABLE: one role.

## Performance Budget

- No new packages, image filters, animations, or feed queries.
- Keep existing image loading, Standard Reader pagination, and cached article data.
- DOM list remains paginated by existing API; first screen relies on current list payload.

## Accessibility Contract

- Use semantic article/list/header/navigation structure; keep visible keyboard focus and existing accessible post action labels.
- Any new icon-only action receives an accessible name; article open/back actions are real buttons.
- Preserve `ContentHider`, moderation alerts, alt text, and language/content metadata.
- The article state announces the opened document and exposes a return control before long body content.
- Touch targets remain reachable; no state depends on color alone.
- No new motion; honor existing reduced-motion styles.

## Adopt

- Byline, deck, clipping, dispatch, and article-sheet conventions as meaningful reading cues.
- Article front as simultaneous source-ordered entries; one calm article measure after selection.
- Continue an editorial lineage through content relationships and task behavior, not period styling; use the attached reference assessment at [`2026-09-23-reference-editorial-lineage.md`](2026-09-23-reference-editorial-lineage.md).

## Adapt

- Use existing AT Protocol post and Standard.site renderers as content engines under Plumblines-owned presentation.
- Let the phone replace article grid with a sequential list and full-width reader state.
- Translate paper and instrument metaphors into spatial structure and contextual controls only where they improve comprehension; retain familiar accessible action semantics.

## Avoid

- New masthead/ornament work, social-card redesign by superficial rounded-corner overrides alone, generated post headlines, article metadata invention, hidden moderation state, and permanent master/detail rails.
- Literal stationery, physical-control simulation, a forced “Neo-Liberty” namespace, or broad compositor changes in this pass.

## Prompt Contract

GOAL — Make dispatch interiors and long-form Reading feel like parts of the newspaper.
AUDIENCE — Readers scanning configured sources and choosing a social dispatch or Standard.site article.
TASK — Identify a dispatch and its provenance, inspect media/quote/reply context, open an article, then return to Reading.
FLOW — Section/front → dispatch or Reading front → article sheet → Back to Reading.
HEADER — Preserve masthead and section rail; demote utility and edition controls to compact text furniture.
MESSAGE — Exact social text is a dispatch; actual Standard.site metadata forms an article.
FACTS — Use only source-provided identity, times, metadata, moderation, and attribution.
CONTENT_INTEGRITY — Never invent post headlines or article fields; keep quote/repost/reply relationships truthful.
SECTION_ORDER — Newspaper source front, Reading index, full article sheet.
CTA — Open article; Back to Reading; existing post actions remain accessible and functional.
TRUST — Preserve labels, content warnings, alt text, authorship and service ordering.
ASSETS — Reuse project brand assets and existing post/document media renderers.
LAYOUT — Story packages use bylines, inset quotations, media-aware composition, and quiet actions; Reading index is a section front.
RESPONSIVE — Article grid becomes a one-column list; article opens as full-width reading state; all text wraps.
STATES — Preserve loading/empty/error/retry; article body-unavailable fallback remains explicit.
PERFORMANCE — No new dependencies or fetching; keep pagination and lazy media behavior.
ACCESSIBILITY — Semantic markup, visible focus, labelled actions, preserved moderation and alt text, touch-safe targets.
PRESERVE — Feed ordering, post actions, moderation, quote embeds, PDS policy, Standard Reader semantics, continuous page scroll, Settings-only mute managers.
EXCLUDE — New palette/masthead, fake headlines, inferred prominence, fake article metadata, endless nested columns.
SUCCESS — Rendered dispatches visibly differ from generic social cards; Reading has a scan front and focused article sheet; desktop and phone remain accessible.

## Success Checks

- Article list initially shows multiple genuine entries and no permanent article-detail pane.
- Opening an item shows its true title and body; Back to Reading restores the list.
- Dispatch styles operate only inside Plumblines presentation boundaries while warnings, quote data, media alt text, and accessible action names remain.
- Reduced width has no horizontal overflow.
- With the logo, warm paper palette, and display serif mentally removed, story relationships and reading flow still signal a publication; this remains a prototype question until user review.
- Meaningful controls remain obvious as software actions; editorial language never hides what an action changes.

## Paper-Object Depth Addendum

The user selected “Keep the newspaper; add paper-object depth.” Preserve the existing page grid and Reading flow. Give the folio one crisp, offset stock edge and a restrained lower shadow. Present an actual quoted post as a raised, square clipping with its source rule. Keep ordinary dispatches and Reading entries unboxed. Reuse theme-aware paper, edge, and shadow tokens; keep focus visible independently of the shadow.
