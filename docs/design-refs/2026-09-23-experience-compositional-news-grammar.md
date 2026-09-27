# Experience Contract: Compositional News Grammar

## Source Mode

- Mode: product-derived.
- Evidence: direct user feedback, the attached reference material, current Plumblines source audit, existing design documentation, and primary protocol/benchmark sources linked below.
- This is a delta to the accepted page-level composition. Visual candidates are pending the installed Product Design tool becoming callable in a prototype-enabled session.

## Product Facts

| Claim | Source | Status | Allowed presentation |
|---|---|---|---|
| Social posts may include language tags in `langs` | Official `app.bsky.feed.post` lexicon | Verified in current lexicon | Group only by values actually supplied; preserve unspecified posts |
| Standard.site documents expose actual title, description, content, publication relation, dates, tags, and contributors | Official `site.standard.document` lexicon | Verified in current lexicon | Show actual supplied fields; omit missing fields |
| Standard.site core document lexicon does not define a language field | Official Standard.site document schema | Verified against current schema | Do not assert a language for a document unless an index or document extension explicitly supplies it |
| Current Plumblines Standard Reader feed item has no language property | `src/plumblines/reading/standard/api.ts` | Verified in current checkout | Design an honest unspecified state; API support is a later dependency for populated groups |
| Cursor feeds use `IntersectionObserver` and retain a visible load-more control | `src/plumblines/sections/index.tsx` | Verified in current checkout; runtime complaint still needs QA | Keep auto-load and manual recovery; prove loading against the document viewport |
| Story actions and moderation remain in the upstream post tree | `PostFeedItem` integration | Verified in current checkout | Change presentation through Plumblines seam; preserve upstream behavior |

## Benchmark Sources

- Liberty archive for historical composition: https://iapsop.com/archive/materials/liberty/index.html
- BBC News section and format architecture: https://help.bbc.com/hc/en-us/articles/39027623773331-What-types-of-news-content-will-be-available
- Not Boring Camera, used only to analyze behavior mapped to controls: https://apps.apple.com/us/app/not-boring-camera/id6737783441?platform=ipad
- Research: Golovchinsky and Chignell, https://doi.org/10.1016/S0306-4573(97)00024-1; Vaughan and Dillon, https://doi.org/10.1016/j.ijhcs.2005.11.002; Stroud, Curry, and Peacock, https://doi.org/10.1080/17512786.2020.1836997; Hou, Rashid, and Lee, https://doi.org/10.1016/j.chb.2016.10.014; Dyson and Haselgrove, https://doi.org/10.1006/ijhc.2001.0458.

## Page Goal

- User result: recognize a dispatch and its relationships, continue through the source without losing place, or enter Reading and focus on one article.
- Product result: newspaper character comes from the page's compositional grammar and interaction structure, while AT Protocol content stays intact.
- Observable success: three rendered candidates use the same data and page-level shell; one is selected only after side-by-side desktop and phone review.

## Audience and Tasks

- Primary readers: signed-in and guest users browsing configured AT Protocol sources and Standard.site documents.
- Main tasks: scan dispatches; understand authorship, reply/repost and quote context; load the next source page; browse Reading by explicitly declared language; open and return from an article.
- Completion: user opens a story, reaches the end state, switches sections, or returns from the article reader.

## Header and Navigation

- Preserve the current masthead and section rail during candidate comparison so the story-interior treatment is the variable under test.
- Keep View and account controls compact and secondary. Do not surface section-management or moderation settings as peer navigation.
- Keep Reading as its own section. Article opening becomes a distinct full-width reader state with a clear Back to Reading action and browser-history support where routing allows.

## Core Message

- Promise: the Atmosphere can be read as a reader-arranged newspaper.
- Explanation: source order and authorship remain visible; presentation changes the arrangement, not the post record.
- Evidence: byline, source, timestamp, actual post text, real article metadata, and accessible moderation context.
- Next understanding: a dispatch is social content; a Standard.site document is an article; neither should be disguised as the other.

## Content Integrity

| Content | Classification | Evidence | Presentation rule |
|---|---|---|---|
| Social dispatch body | verified | `app.bsky.feed.post` record | Display actual rich text without a generated title |
| Repost/reply reason | verified | AT Protocol feed reason and reply references | Preserve explicit protocol meaning in compact context text |
| Quoted dispatch | verified | Existing embed view | Render as an inset, source-identified clipping and preserve moderation state |
| Image, video, alt text | verified | Existing embed renderer | Use source alt text and preserve warning/reveal controls |
| Standard.site title and description | verified | Document record | Use actual fields only; omit fields absent from source |
| Article language group | hypothesis until supplied | Index or document language tag required | Show only explicit values; otherwise place under “Language not supplied” |
| Content used in design-only prototype | prototype | Existing repository test fixtures, marked as fixtures | Keep identical content in all candidates and do not present fixtures as live material |
| Story prominence | verified when user-configured | Local front-page preference and deterministic package model | Attribute position to the chosen layout, never importance |

## Section Order

1. Existing masthead and section rail.
2. Existing composed Front Page or configured section front.
3. Dispatch internals with author/source, exact text, context, media, quote, then subordinate actions.
4. Reading destination with a scan front and language groups only when source metadata supports them.
5. Full-width article reader with actual title/deck/provenance, optional cover, body, and return action.
6. Cursor continuation under the same document scroll, with stable sheet landmarks and an explicit load/retry control.
7. Mute, word-filter, and local snooze management in Settings.

## CTA Strategy

- Primary story action: open a dispatch or article while preserving the current source position.
- Reading action: “Open article” names the actual title; “Back to Reading” restores the list and position.
- Continuation: scroll triggers the next cursor near the end of loaded content; a visible “Load more” control remains available as a recovery path and after errors.
- Settings: moderation and attention controls remain reachable from Settings, not the front page.

## Trust Strategy

- Concern: did Plumblines rewrite, rank, classify, or hide content?
- Evidence: exact record text, visible authorship/source, actual provider order, source-declared language, and preserved moderation/labels.
- State what the provider determines. Do not claim importance, credibility, political classification, or language without data.
- Unknown language remains visible and filterable as unspecified rather than silently dropped.

## Asset Provenance

| Asset | Source | Rule | Status |
|---|---|---|---|
| Plumblines masthead and existing type | Project-owned files and current `DESIGN.md` | Reuse without expanding the masthead during candidate comparison | Existing |
| Social images and video | AT Protocol embeds | Keep source, alt text, moderation and current renderer | Existing |
| Article cover/body media | Standard.site document and renderer | Keep source-provided metadata and alt text; no synthetic cover | Existing |
| Not Boring Camera visuals | User attachment and official App Store reference | Interaction analysis only; do not reuse its image assets or 3D style | Reference only |
| Prototype content | Existing Playwright fixtures | Mark as prototype data; same fixture in every candidate | Available |

## Desktop Structure

- Reference viewport: 1440 by 900, with a second review around 980 pixels.
- Preserve the existing page compositor, masthead, and section rail across candidates.
- Compare dispatch structure within its assigned region: byline/source line, natural text measure, reply/repost context, quoted clipping, image treatment, and action placement.
- Reading index presents several genuine article entries without a permanent detail rail. Opening an entry replaces the index with one full-width reader sheet.
- Article body measure targets roughly 55–65 characters per line. Image width follows the article/story span and does not itself imply importance.
- All continuation content uses the same document scrollbar. The observer sentinel and load-more control live at the end of that stream.

## Mobile Transformations

| Desktop element | Operation | Mobile result | Reason |
|---|---|---|---|
| Story span across grid columns | reorder | Single-column story with source, text, context, media, and actions in that order | Preserve logical reading order |
| Byline and source row | compress | One or two wrapping metadata lines with visible handle and time | Save width without hiding provenance |
| Quote clipping | retain | Inset with one clear rule and its own byline | Preserve relationship and source identity |
| Image/text interlock | replace | Image followed by exact text/caption in normal flow | Avoid narrow wrapping and horizontal overflow |
| Reading article grid | replace | One source-ordered list, with language headings only for declared tags | Maintain scan order and language truth |
| Article reader | retain | Full-width calm article, ~60ch maximum measure, direct return action | Protect long-form readability |
| Page continuation | retain | Sequential sheets under the browser document scroll | Keep infinite browsing without nested viewports |
| Utility controls | collapse | Compact text/actions outside primary section hierarchy | Preserve content width and touch usability |

## States

| State | Trigger | User sees | Action and recovery |
|---|---|---|---|
| loading | First query or cursor request | Existing content remains; a status announces the next-page request | Wait; keep manual load control available where appropriate |
| empty | No matching item/article | Clear source-specific empty state | Choose another section or clear an explicit filter |
| error | Initial or cursor request fails | Inline alert at the affected section or stream end | Retry without removing already loaded pages |
| success | New page arrives or article opens | New source-ordered stories append; selected article fills reader state | Continue scroll or return to prior list position |
| unspecified-language | Language field absent | Explicit “Language not supplied” grouping | Read content without guessed classification |
| no-readable-body | Index has metadata but body is unavailable | Actual metadata plus source link/unavailable explanation | Open at publication if available |

## System Roles

NOT APPLICABLE: one reader/guest interface; account permissions stay in the existing application layer.

## Role Variants

NOT APPLICABLE: one interface; signed-in and guest states differ only where current authentication already requires it.

## Performance Budget

- No added image-processing or animation dependencies for the design stage.
- Preserve lazy media loading, query caching, cursor requests, and Standard Reader renderer.
- Do not fetch extra records solely to make a visual treatment appear richer.
- Auto-load only when the sentinel approaches the document viewport. Prevent overlapping cursor requests and preserve content when a request fails.

## Accessibility Contract

- Preserve semantic `article`, heading, list, navigation, and status roles with logical DOM order.
- Keep visible keyboard focus, labelled controls, and touch targets large enough on mobile.
- Preserve `ContentHider`, labels, moderation warnings, quote identity, and image alt text.
- Do not encode language or treatment only by color, texture, or position.
- Respect reduced motion and use no required animation, sound, or haptic effect.
- Infinite loading must have a keyboard-accessible manual control and announced loading/error/success states.

## Adopt

- A real shared grid and variable story spans.
- Typographic hierarchy and whitespace as primary separators.
- Compact attribution lines, readable article measure, source-identified quotes, and image/text relationships.
- Explicit direct-manipulation only where a reader changes layout or saves a clipping.

## Adapt

- Newspaper columns become a responsive browse grid; article reading stays single-column.
- Tactile interaction references become clear control/state relationships with standard accessible feedback.
- Language grouping is populated only by a declared source/index field; missing language stays visible.
- Page boundaries remain continuous document content, not nested scrollers or fixed-height paper simulation.

## Avoid

- Literal props, labels, stamps, fake paper objects, distress, page-curl physics, sound, or 3D camera/control simulation.
- Generated social headlines, invented article fields, inferred language, or opaque prominence.
- Large avatars/action bars or rounded card stacks dominating each dispatch.
- Independent scroll containers, a permanent article inspector, and mute management on the front page.

## Prompt Contract

GOAL — Make Plumblines read as a newspaper through composition and story relationships rather than decorative props.
AUDIENCE — Readers scanning AT Protocol dispatches and choosing long-form Standard.site documents.
TASK — Understand a dispatch, continue through cursor pages, browse Reading by declared language, open an article, and return.
FACTS — Social language may come from the post `langs` field; Standard.site's core document schema and current Reading adapter do not provide a language property.
CONTENT_INTEGRITY — Keep exact record content, source order, moderation, attribution, and actual document metadata; never generate headlines or infer language.
ASSETS — Reuse existing Plumblines and upstream media assets; use Not Boring Camera only as a behavioral reference.
RESPONSIVE — Preserve the current page composition on desktop; make story interiors and Reading one-column on phone without horizontal overflow.
STATES — Retain loading, empty, error, retry, success, unavailable-body, and unspecified-language states.
SUCCESS — Product Design candidates use the same data at desktop and phone; one document scroll loads cursor pages; Reading is a distinct article-reading flow; mute controls remain in Settings.

## Success Checks

- Three candidates use the same fixture content, feed order, page shell, and viewports. Candidate comparison varies story treatment, not product truth.
- A logo/palette-blind review can recognize editorial organization in the story layout.
- Original post text, labels, warnings, media alt text, quote source, reply/repost meaning, and existing actions remain available.
- No candidate invents a headline, dateline, language, publication, reading time, or ranking reason.
- One `window` scroll reaches the continuation; automatic cursor loading appends ordered items, and manual load/retry recovers if automatic loading fails.
- Browser Back or “Back to Reading” returns to the existing Reading list and position.
- Language headings use explicit source metadata only; missing language appears as unspecified.
- Mute, muted words, and local snoozes remain in Settings; block-creation prevention remains unchanged.
- At 390 pixels, document width does not exceed the viewport; at desktop, body text remains readable and actions remain keyboard/touch accessible.
