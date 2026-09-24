# Plumblines design

User reference: `/tmp/codex-clipboard-61c0abb9-e226-4d2a-83d1-fd9c9583044f.png`, examined 2026-09-23.

A working AT Protocol newspaper: reading and choosing a feed are the primary tasks. The expressive risk is a very large engraved-feeling serif masthead; everything below stays legible and functional.

## Tokens
- Paper: #f5efdf; raised paper: #eee6d5; ink: #24221e; muted ink: #625b50; rule: #a49a87; accent: #8d2924.
- Web headline/body serif: Georgia, Times New Roman, serif. Keep existing sans-serif where technical handles/forms need clarity. Native uses supported existing fonts unless separately verified.
- Fine 1px rules and double masthead divider. The reading surface is visibly darker than the paper sheet; give each sheet a hairline edge, slight lift, and deliberate gap. Use square newsroom slips; avoid card shadows and pill-heavy chrome.
- Masthead large uppercase, tightly spaced on desktop, compact on phone. Use publication metadata and a short product strapline (“A newspaper for the Atmosphere”), not manifesto copy or fabricated issue facts.

## Layout
Interior routes use a compact 68px masthead. The web front page has an expressive masthead in normal document flow (140px desktop, 92px phone); it scrolls away as the reader moves down the edition. A slim utility rail remains beside a capped paper sheet on a subtly darker reading surface. Interior route offsets remain compact and fixed.

Sources and page regions are separate concepts. The section rail selects Front Page, one configured section front, or Reading. The front-page compositor resolves a reader-chosen lead source, places that source's first timeline item in Lead and the next three in Dispatches, then places at most two other configured sources in secondary fronts. Remaining sources stay available from the rail; eight configured sources do not become eight side-by-side feeds. Source and item order remain deterministic. Section fronts display one source at a time. Broadsheet is asymmetric (keep the 7/5 lead-to-briefs relationship down to laptop widths), Compact balances the top regions, and Reading is a single column. Phone layouts flatten every composition instead of shrinking the desktop spread.

## Content and behavior
Use actual account/feed data. Do not copy fictional posts, counts or imagery from reference. Do not claim user ownership, verified ranking inputs or newest-first without evidence. Feed explanation separates supplied metadata and unknown facts. Client does not create blocks; existing network relationships may remain enforced.

The upstream post renderer remains responsible for moderation, embeds, provenance links, reply context, and protocol actions. Plumblines frames it as a dispatch: original post text remains the only headline-like text, identity/source and time remain visible, and action controls sit quietly on the page instead of appearing as rounded social buttons. Page links point to real local sheet anchors and the current sheet follows the reader's scroll position. Front page and continuation share one document scroll; no source column gets its own viewport. Standard.site documents remain in the separate Reading destination. Mute accounts, words, and local snoozes remain in Settings.

## Accessibility and verification
Readable body ~16–18px with comfortable line height. Keep accessible action labels, visible keyboard focus, suitable touch targets and theme-specific contrast. Reduced motion must work. Verify desktop, tablet and phone actual render, font fallback/glyphs, dark/dim and form states. Reference screenshot is aesthetic direction, not functional or protocol evidence.

## Configurable front page

Up to eight local Following/feed/list/latest-search sections retain the existing query and moderation paths. The deterministic compositor uses configured source order and provider item order only. The lead slot is identified without implying an editorial ranking; the next configured sources fill the left and right secondary fronts. A configured section remains directly available in the rail but does not automatically become a permanent feed column. Image-bearing content may receive a visual treatment without reordering it. Section filters and source details live in each section's settings menu. Standard Reader's public latest index adds an explicitly separate long-form Reading sheet; its real document metadata and normalized renderer keep article titles distinct from social dispatch text. No bespoke ranking or reader-state lexicon is introduced. See [the current newspaper behavior](docs/plumblines/newspaper.md).

## Spatial behavior
- Page 1 is the composed front page. Following continuation begins on Page 2 and flows into stable batches of eight feed slices (or ten latest-search posts), with each loaded cursor page appended under the same document scrollbar. Folios, a page navigator, and return links create navigable landmarks; load-more remains as a manual fallback.
- Reading is a separate destination for the Standard Reader index and article renderer, not another timeline region on the front page.
- Muted accounts, muted words, and local snoozes are managed in Settings. Contextual hide/report controls remain with the story or account; front-page layout controls do not become moderation controls.
- The paper metaphor affects surface, organization, and navigation. It does not alter AT Protocol records or invent headlines, rankings, issue numbers, bylines, or dates.

Ornament is sparse. Rules, scale and alignment create structure; complete story borders and nested feed scrollbars are avoided. Keep controls sans-serif, body prose around 55–65ch, focus visible, mobile targets large, content warnings/provenance intact, and movement disabled under reduced-motion preferences. Light, dim and dark paper use separate readable colors; never invert to black. Dark/phone screenshots must be reviewed on the real rendered application, not inferred from these tokens.
