# Plumblines design

User reference: `/tmp/codex-clipboard-61c0abb9-e226-4d2a-83d1-fd9c9583044f.png`, examined 2026-09-23.

A working AT Protocol newspaper: reading and choosing a feed are the primary tasks. The expressive risk is a very large engraved-feeling serif masthead; everything below stays legible and functional.

## Tokens
- Paper: #f5efdf; raised paper: #eee6d5; ink: #24221e; muted ink: #625b50; rule: #a49a87; accent: #8d2924.
- Web headline/body serif: Georgia, Times New Roman, serif. Keep existing sans-serif where technical handles/forms need clarity. Native uses supported existing fonts unless separately verified.
- Fine 1px rules and double masthead divider. Square sidebar boxes; avoid card shadows and pill-heavy chrome.
- Masthead large uppercase, tightly spaced on desktop, compact on phone. Optional line: “Liberty — not authority — orders the page.” Do not present invented historical quotes as authentic.

## Layout
Interior routes use a compact 68px masthead. The web front page restores an expressive 132px desktop masthead and a 92px phone masthead. Its slim utility rail sits beside a paper sheet on a subtly darker reading surface. The Home sheet is capped at a comfortable wide measure and has a section rail, multiple editorial fronts, page/folio landmarks and an explicit Reading sheet. All sheets belong to one document scroll; do not introduce independent feed scrollers. Existing shell headers use the same masthead offset.

Broadsheet places the reader-selected lead source first, with its next three items in the briefs rail, then secondary sections; Compact uses a denser modular grid; Reading is a chronological, single-column configuration. Phone layouts flatten every template to one column instead of shrinking a desktop broadsheet. Tablet uses the responsive web layout; no fixed two-page tablet spread is assumed.

## Content and behavior
Use actual account/feed data. Do not copy fictional posts, counts or imagery from reference. Do not claim user ownership, verified ranking inputs or newest-first without evidence. Feed explanation separates supplied metadata and unknown facts. Client does not create blocks; existing network relationships may remain enforced.

## Accessibility and verification
Readable body ~16–18px with comfortable line height. Keep accessible action labels, visible keyboard focus, suitable touch targets and theme-specific contrast. Reduced motion must work. Verify desktop, tablet and phone actual render, font fallback/glyphs, dark/dim and form states. Reference screenshot is aesthetic direction, not functional or protocol evidence.

## Configurable front page

Up to eight local Following/feed/list/latest-search sections retain the existing query and moderation paths. The deterministic compositor uses configured source order and provider item order only. The reader-selected lead is moved first and identified as their choice; the first secondary section receives a feature treatment. Image-bearing content may receive a visual treatment without reordering it. Section filters and source details live in each section's settings menu. Standard Reader's public latest index adds an explicitly separate long-form Reading surface; its real document metadata and normalized renderer keep article titles distinct from social dispatch text. No bespoke ranking or reader-state lexicon is introduced. See [the current newspaper behavior](docs/plumblines/newspaper.md).

Ornament is sparse. Rules, scale and alignment create structure; complete story borders and nested feed scrollbars are avoided. Keep controls sans-serif, body prose around 55–65ch, focus visible, mobile targets large, content warnings/provenance intact, and movement disabled under reduced-motion preferences. Light, dim and dark paper use separate readable colors; never invert to black. Dark/phone screenshots must be reviewed on the real rendered application, not inferred from these tokens.
