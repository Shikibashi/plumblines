# Experience Contract: Newspaper Object

## Source Mode

- Mode: product-derived
- Evidence: `docs/design-refs/2026-09-23-brief-newspaper-object.md`; user-supplied redesign research and explicit UX constraints; source audit and live local preview on 2026-09-23.

## Product Facts

| Claim | Source | Captured at | Freshness/status | Allowed presentation |
|---|---|---|---|---|
| Following continuation is ordered from the current configured source and provider pagination | Existing Plumblines feed query and pagination code | 2026-09-23 | current | Preserve source order; do not imply editorial ranking |
| Standard.site reading material is available through the Reading destination | Existing Standard Reader integration | 2026-09-23 | current | Identify article/publication only from supplied document metadata |
| Account mutes, muted words, and local attention settings are handled in Settings | Existing Settings screen | 2026-09-23 | current | Do not move muting controls into the front page |

## Benchmark Sources

- No external site benchmark used. The product direction derives from the user's supplied newspaper design research and requirements; this is not a literal Liberty reproduction.

## Page Goal

- User result: Browse a composed newspaper front, continue through source items using one browser scrollbar, and intentionally switch to long-form Reading when desired.
- Product result: Present AT Protocol sources as a navigable newspaper object while keeping source semantics, provider order, moderation, and accessibility truthful.
- Observable success: stable Page 1/Page 2+ boundaries, deterministic ordering, a page navigator linking loaded sheets and tracking the visible one, a return-to-front-page anchor, a separate Reading destination, and no persistent mute manager in the reading flow.

## Audience and Tasks

- Primary users: Plumblines readers, signed-in or guest where supported, on desktop or phone.
- Primary task: Scan Page 1 then read the appended Following stream continuously.
- Start/completion: Front Page selected; completion is opening an item, returning to Page 1, or switching destinations.
- Friction: Nested scrollers, equal-weight feed columns, ambiguous story hierarchy, and moderation controls competing with reading.

## Header and Navigation

- Brand, folio/date, current destination, section rail, and utility actions remain in that order.
- Desktop: compact section rail below the masthead; page folios and anchors within the content sheet.
- Mobile: compact masthead and horizontally usable section navigation; sheet boundaries remain visible without forcing horizontal scroll.

## Core Message

- Promise: A reader-composed newspaper for the Atmosphere.
- Explanation: User-selected sources are arranged into editorial packages; the provider's ordering is preserved.
- Evidence: Source labels, author identity, timestamps, feed/provider attribution, and explicit sheet/page labels.
- Next understanding: Reading is its own long-form destination; this page is a continuous, paged-by-landmark stream.

## Content Integrity

| Content item | Classification | Evidence | Presentation rule |
|---|---|---|---|
| Social post text | verified source content | AT Protocol post record | Show original text; never generate a headline |
| Article title, deck, author, publication, cover | verified when present | `site.standard.document` and associated metadata | Render only real fields; omit missing values |
| Page labels and continuation copy | interface state | Current route and ordered pagination | Number sheets from position; do not imply published issue number |
| Prominence | reader configuration | Local front-page preference | Explain placement as chosen layout, never importance |
| Provider order | source-defined | Feed/search response | Attribute ordering to source/provider; never infer ranking rationale |

## Section Order

1. Masthead and folio: identify Plumblines and current edition context.
2. Section rail: select Front Page, configured sources, or Reading.
3. Page 1: lead, briefs, secondary fronts, and a clear Reading entry point.
4. Page 2+: chronological/provider-ordered continuation with folio, page navigation, and return anchor.
5. Reading destination: Standard Reader index and article detail, outside social continuation.

## CTA Strategy

- Primary: **Open the reading edition**; switches to the Reading destination from the Page 1 Reading entry.
- Secondary: **Load more posts**; fetches the next source cursor and appends without replacing earlier sheet landmarks.
- Navigation: **Return to page one**; anchors to Page 1 from each continuation sheet.
- Repeat only at the Reading entry and continuation boundary where those actions become relevant.
- Success: newly loaded items appear in source order and continue page numbering. Error: retain already loaded sheets and expose retry through the existing load-more error control.

## Trust Strategy

- Reader concern: Does prominence or order mean Plumblines ranked this as important?
- Evidence: actual selected section placement and source-provided order; source/provenance labels remain available.
- State page number as a local spatial position only. Do not fabricate dates, volume, issue, rank, publication, or reading duration.

## Asset Provenance

| Asset | Source | Local path | License/trademark/attribution | Modification allowed | Status/fallback |
|---|---|---|---|---|---|
| Plumblines masthead and ornaments | Existing Plumblines-owned implementation/assets | Existing `src/plumblines/` and `assets/` | Follow `ASSETS.md` and `NOTICE.md` | Existing permitted treatment | Current; compact text masthead fallback |
| Story images | AT Protocol source records | Remote media through existing app renderer | Preserve source attribution and alt text | No alteration by this change | Existing moderation/alt-text behavior |

## Desktop Structure

- Reference viewport: 1440×900.
- First viewport: flowing masthead/folio, section rail, then the composed first sheet.
- Grid: 12-column asymmetric Page 1; the subsequent source stream becomes full-width sheets in the same document.
- Density: front page presents several related packages simultaneously; continuation remains a readable ordered stream. No nested section scrollbar.

## Mobile Transformations

| Desktop element | Operation | Mobile result | Reason |
|---|---|---|---|
| Wide masthead sheet | compress | Compact centered masthead without desktop left offset | Protect content width |
| Asymmetric front-page grid | reorder | Lead, briefs, then secondary sections in explicit reading order | Preserve editorial hierarchy in one column |
| Continuation page sheet | retain | Full-width sheet edge, folio, content, footer | Preserve landmarks while avoiding horizontal overflow |
| Page footer | compress | Small folio row with touch-safe return link | Keep navigation available without dominating |
| Utility rail | collapse | Existing compact navigation behavior | Leave width for reading |

## States

| State | Trigger | User sees | Available action | Recovery |
|---|---|---|---|---|
| loading | Initial source or next cursor request | Existing source loading indicator | Wait or use visible load-more control | Existing query retry path |
| empty | No source items | Existing empty-source explanation | Configure/open another section | Section rail |
| error | Feed cursor fails | Error and retry at continuation boundary | Retry load | Keep prior sheets in place |
| success | Cursor returns items | New ordered stories appended in numbered sheets | Continue reading or return to Page 1 | Existing pagination controls |

## System Roles

- NOT APPLICABLE: single reader/guest presentation; authorization behavior stays in the existing application layer.

## Role Variants

- NOT APPLICABLE: single role.

## Performance Budget

- First sheet uses existing query and image-loading policies; continuation slices do not trigger new requests by themselves.
- Additional network work occurs only through existing cursor pagination/intersection behavior.
- Reuse existing fonts, renderer, and feed components; no added package, animation engine, or image effect.
- If image loading is slow, text, source identity, folio, and actions remain usable.

## Accessibility Contract

- Preserve logical document order and existing page/region headings; each continuation sheet has a visible folio and stable anchor ID.
- Page links, return link and load-more control remain keyboard-accessible; keep existing visible focus indicators and labels.
- Do not communicate page/section state by color or paper texture alone.
- Maintain current moderation labels, warnings, alt text, source semantics, and touch targets.
- No new motion; existing reduced-motion behavior remains in effect.

## Adopt

- Stable folios, margins, paper edges, and page boundaries as a cognitive map.
- User-controlled prominence and deterministic source order.
- A continuously scrolling document with visually distinct sheets instead of separate scroll containers.

## Adapt

- Newspaper page boundaries become anchors and appended DOM sections rather than fixed-height physical pages, keeping browser scrolling and accessibility intact.
- Page numbers indicate local spatial position, not issue numbering.
- Reading is linked from the front page but remains a distinct Standard.site destination.

## Avoid

- Independent section scrollbars, generic dashboard columns, generated headlines, opaque story ranking, fake publication metadata, paper texture noise, and muting controls on the front page.

## Success Checks

- Page 1 ends before the Following continuation begins, and each continuation sheet has one stable, unique page anchor.
- The same `window`/document scrollbar advances through all sheets; no continuation element has its own vertical overflow.
- Repeated appends preserve all prior stories and source order, and sheet numbers increase monotonically.
- The Reading entry changes to its own destination and never appears as a continuation timeline item.
- Muted accounts, muted words, and local snoozes are reachable from Settings; front-page story configuration contains only source/layout/filter controls.
- On a 390px viewport, `document.documentElement.scrollWidth <= window.innerWidth`.

## Prompt Contract

GOAL — Make Plumblines behave as a continuous, navigable newspaper while preserving AT Protocol content and source semantics.
AUDIENCE — Readers scanning the composed front page, following its source-ordered continuation, or deliberately opening long-form Reading.
TASK — Read Page 1, continue into numbered sheets under the same document scrollbar, return to Page 1, and switch to Reading as a separate destination.
FACTS — Show only actual source order, content, and supplied provenance; do not claim importance or invent issue facts.
CONTENT_INTEGRITY — Social text stays verbatim; Standard.site titles/metadata come from document records; local page numbers describe position only.
ASSETS — Reuse existing licensed Plumblines masthead/assets and upstream image renderers with alt text.
RESPONSIVE — Compress masthead, reorder the front to one column, retain sheet edges/folios, and preserve touch-safe controls.
STATES — Keep loading, empty, error/retry, and success behavior from existing feed/Reader paths; append success without removing prior pages.
PRESERVE — Existing source fetch, provider order, cursor pagination, moderation, post controls, content labels, alt text, account/settings behavior, blockless write policy, and deployment export.
IMPLEMENT — Keep Page 1 composition, move the continuation into sibling sheet landmarks, group loaded entries deterministically without reordering, include folios/return anchors, keep Reading distinct, and keep muting in Settings.
SUCCESS — One document scrollbar, increasing unique sheet anchors, retained source order, distinct Reading destination, Settings-only muting manager, and no phone horizontal overflow.
VERIFY — Front-page model unit test; lint; web typecheck/export; desktop and phone screenshots; confirm one document scroll, stable page anchors, no horizontal overflow, and unchanged moderation policy.
