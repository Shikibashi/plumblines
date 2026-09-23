# Plumblines editorial front page

## Context Map

Plumblines web Home composes user-configured sections over Bluesky's existing AT Protocol data services. Long-form ATProto documents use `site.standard.document` and `site.standard.publication`; Standard Reader exposes a public indexed read-model and a headless React renderer. Reader state, PDS identity and blockless policy remain existing project boundaries.

### Ecosystem map

| System | Current integration | Planned section |
|---|---|---|
| AT Protocol AppView / Bluesky social-app | Existing PostFeedItem, feed/search queries, moderation and account actions | B. Newspaper composition |
| Plumblines local preference store | Account/guest-local section and reader preferences | A. Deterministic page model |
| Standard.site documents/publications | Existing embed recognition plus public Standard Reader index/document API and renderer | C. Standard Reading |
| Expo web shell and shared stylesheet | Existing Home route, nav shell, theme and route offsets | D. Shell and masthead |
| Cloudflare Pages and static Docker image | Existing export/packaging path, no backend | E. QA and evidence |

## Problem Statement

| # | Problem | Resolution requirement | Implementation section |
|---|---|---|---|
| P1 | Equivalent boxed sections with nested feed scrolling make Home feel like multiple dashboards instead of one composed page. | R1, R2 | B. Newspaper composition |
| P2 | Social dispatches and actual Standard.site documents are not distinguished as editorial story types. | R3, R4 | A. Deterministic page model; C. Standard Reading |
| P3 | Per-section filters and provenance details compete with stories. | R5 | B. Newspaper composition |
| P4 | The large masthead consumes similar space on front-page and interior routes. | R6 | D. Shell and masthead |
| P5 | Page/section landmarks and reader-controlled composition are weak. | R1, R2, R6 | A. Deterministic page model; B. Newspaper composition |

## Requirements

| ID | Requirement |
|---|---|
| R1 | Compose configured sources into a responsive document-flow newspaper with stable sheet/page landmarks and no nested feed scrollbars. |
| R2 | Assign prominence deterministically from reader-selected section order and provider item order; never generate rankings or social headlines. |
| R3 | Preserve original social content, provenance, moderation warnings and upstream interactions through Plumblines-owned treatments. |
| R4 | Add a public Standard.site Reading section that uses actual document metadata and the compatible shared body renderer, with honest unavailable/error fallbacks. |
| R5 | Put section filters/source details in accessible settings and retain section CRUD, search/feed/list sources and local preferences. |
| R6 | Use an expressive responsive front-page masthead and a compact interior state with visible focus and reduced-motion support. |
| R7 | Preserve blockless protocol-write policy, no-upstream-analytics policy, static export/Docker/Pages packaging and clean upstream baselines. |

## Goals

- (R1, R2) Compose configured sources in one continuous, responsive newspaper sheet with deterministic, user-controlled prominence.
- (R3, R5) Preserve section order, filters, custom feeds, lists, search, Following API semantics, query feedback, moderation, interactions, and keyboard access.
- (R2, R3) Use clear source and article-type cues without inventing headlines, dates, provider facts, or editorial importance.
- (R4) Give Standard.site documents a first-class Reading front while retaining upstream StandardSiteEmbed as a contextual share/embed.
- (R4) Use the existing open renderer and public Standard Reader index where compatible; keep rendering styling owned by Plumblines.
- (R1, R4, R6) Collapse to a readable single-column phone layout; long-form reader text targets about 60ch.
- (R7) Minimize upstream edits and keep upstream `main` unchanged.

## Non-goals

New PDS/AppView, new proprietary Lexicons, offline Editions, synchronized page layout, new publishing flow, AI summaries or rankings, automatic salience scores, political ranking, page-curl simulation, and a backend are out of scope.

## Evidence-based decisions

- [ZEUS-AUTO:taste] The user's configured first section owns the lead position; source ordering within a section supplies story order. This makes prominence inspectable and reversible. Alternative: automatic engagement/importance ranking. Reversal: change the local composition preference/template, without touching source records.
- [ZEUS-AUTO:taste] Broadsheet/Compact/Reading are local page templates; they only alter presentation. Alternative: let the client silently choose a layout from viewport heuristics. Reversal: remove template selection and retain the deterministic Broadsheet default.
- [ZEUS-AUTO:mechanical] Network/provider sorting remains untouched; Following continues to call timeline semantics, search remains latest, and custom source order remains provider-supplied.
- [ZEUS-AUTO:mechanical] Standard.site body formats are parsed through `@standard-reader/renderer-react`, with a neutral accessible fallback for unavailable/unrecognized renderer paths. Do not hand-parse Leaflet/Pckt/Offprint variants.
- Sheets are normal scrolling landmarks grouped by up to four configured sections; page anchors never create nested scroll areas or fixed paper dimensions.

## Acceptance

1. The old side-by-side fixed-height feeds are replaced by one scrollable continuous composition and clear sheet boundaries.
2. Deterministic template mapping yields identical placements for identical section order and source order.
3. Layout configuration is account/guest-local, validates corrupt values, is reversible, and never writes protocol records.
4. Social dispatch treatments preserve the exact source text and original PostFeedItem interactions/moderation. No fabricated headline/dateline.
5. Standard.site Reading section consumes only documented public API fields, renders the original document format with the open renderer, and displays actual author/publication/title/description/date/reading time. Error and unavailable states are honest.
6. Section filters/settings are moved out of reading flow, remain accessible, and persist.
7. Front page and internal routes use expressive and compact masthead states respectively, with correct sticky offsets and no lost navigation landmarks.
8. Phone, tablet/laptop, and wide desktop remain free of horizontal overflow; reduce-motion and visible focus persist.
9. Existing blockless write boundary, public blocked-content reading, telemetry policy, search and section behavior remain intact.
10. Unit/browser/build/lint/type checks pass within the explicitly exercised scope.

## Research references

- Golovchinsky & Chignell, “The newspaper as an information exploration metaphor” (1997), reports that the spatial newspaper prototype supported side-by-side comparison and better performance when more articles were shown for its tested exploration tasks: https://doi.org/10.1016/S0306-4573(97)00024-1
- Dyson & Kipping, “The Effects of Line Length and Method of Movement on Patterns of Reading from Screen” (1998), found readers judged moderate 55-character lines easiest in their experiments; the design target is flexible, not a universal optimum: https://journals.uc.edu/index.php/vl/article/view/5671
- Standard Reader renderer docs explain its headless framework renderers normalize multiple publication formats into shared blocks: https://standard-reader.app/docs/renderers
- Standard Reader API documents public `getLatestFeed`, `getDocument`, and `getPublication` reads at `https://standard-reader.app/xrpc`: https://standard-reader.app/docs/api
- Standard.site document schema and actual title/site/date/content fields: https://standard.site/docs/lexicons/document
