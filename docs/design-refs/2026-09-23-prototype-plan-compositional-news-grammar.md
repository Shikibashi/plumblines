# Prototype Plan: Compositional News Grammar

## Gate

The user chose Product Design prototypes in a fresh session. The plugin is installed and enabled, but its prototype tools are not present in the current session's callable tool list. Do not substitute local rendered prototypes without the user's approval. Source audit, benchmark notes, sitemap, layout blueprint, and experience contract are prepared; rendered exploration remains `NOT RUN` until the Product Design API is callable.

## Updated test question

Which treatment carries an editorial lineage through surface, behavior, and information organization—not merely paper styling—while keeping source identity, protocol behavior, and text clarity intact?

The newly attached essay changes the evaluation lens, not the product scope. Keep the established page compositor and test only story interiors, Reading, and their contextual controls. Candidate variation should cover four observable dimensions: story measure/type hierarchy, relationship cues (reply/repost/quote), image/text composition, and action placement/feedback. Do not test texture, page-curl motion, or new component naming as design directions.

Hold the previously selected **Layered edges** paper-depth treatment constant; it is recorded with the earlier comparison in [`2026-09-24-direction-story-interiors-paper-depth.md`](2026-09-24-direction-story-interiors-paper-depth.md). The existing paper-depth screenshots are not evidence for the new story-interior/system question and must not be presented as such.

## Fixed comparison conditions

- Keep the current page-level compositor, masthead, palette, section rail, and source order constant.
- Use the same desktop viewport at 1440 by 900, a boundary viewport near 980 pixels, and a phone viewport at 390 pixels.
- Use identical dispatch fixtures for all candidates: text-only, repost reason, reply context, quoted record, and image-bearing post. Preserve exact fixture text and labels; clearly mark fixtures as prototype data.
- Use the same Standard.site article fixtures with actual title/description/publication/date/reading-time fields where present, including one metadata-only document.
- Include an explicit language fixture only as prototype metadata. Show that the live Standard Reader integration currently supplies no document language; do not imply the filter is populated by live records.
- Include a second cursor response so the review can test infinite loading and an observable manual recovery control.

## Variables to test

| Candidate | Text and grid | Provenance and actions | Quote and media |
|---|---|---|---|
| Column-led dispatch | Story body occupies its assigned grid measure | Byline/source first; quiet action line after text | One-rule inset quote; media stays within story span |
| Typographic flow | Body rhythm sets the hierarchy, with more open vertical measure | Compact source/context line; actions recede below the text | Quote follows body with clear attribution; media enters the text flow |
| Image-text interlock | Media aligns to the story grid and text wraps only on wide screens | Byline stays adjacent to story opening; actions remain at story end | Quote remains a separate inset; image/caption form one source-attributed composition |

## Interaction states

- Scroll to the continuation threshold and confirm the next cursor appends without losing prior content or moving the reader into a nested scroller.
- Force IntersectionObserver unavailable and confirm manual Load more remains usable.
- Force a cursor failure and confirm retry preserves earlier pages.
- Switch to Reading, choose a declared language group in the prototype data, and open an article. Keep unspecified documents discoverable.
- Back to Reading restores the index and previous position.
- Verify moderation warning/reveal, quote source, alt text, report/action labels, and Settings-only mute managers in any candidate containing them.

## Review protocol

Capture all three candidates at desktop and phone with the same content and state. First critique the images without candidate descriptions, then compare against the Experience Contract. Record tradeoffs, accessibility and responsive issues, and user selection. Do not commit a `direction` as selected or edit production design tokens until the user approves one.

Add a logo/palette/type-blind pass: temporarily disregard the wordmark, warm paper tone, and display serif. Ask whether page order, source/byline placement, quote/reply relationships, and the transition from Reading index to article still communicate an editorial publication. Also ask whether every action remains understandable without relying on newspaper jargon.

## Current status

- Product Design installed: yes.
- Product Design version: `0.1.55`, exact selector `product-design@openai-curated-remote`, installed and enabled according to the Codex CLI.
- Product Design tools callable in this session: no; current session tool metadata exposes no prototype/render API. Gate: `RESTART_REQUIRED`.
- Three rendered candidates for this story/system question: `NOT RUN`; existing paper-depth candidates are a separate completed comparison.
- Selected visual direction: `Layered edges` remains selected for sheet depth only; no new story-interior direction has been selected.
- Production UI edits: not part of this gate.
- Existing source tests: the targeted composed-front-page cursor test passed against the current Expo web dev server; it scrolled the document and observed the next feed page append. The companion section-front cursor test also passed. This verifies the fixture path locally, not the deployed site or every provider.
- An initial run against the prebuilt static export did not reach the scroll check because its page lacked the current edition-menu fixture selector. The tests were rerun against the current source via `pnpm run web`; source files were not changed by this verification.
