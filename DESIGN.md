# Plumblines design

User reference: `/tmp/codex-clipboard-61c0abb9-e226-4d2a-83d1-fd9c9583044f.png`, examined 2026-09-23.

A working AT Protocol newspaper: reading and choosing a feed are the primary tasks. The expressive risk is a very large engraved-feeling serif masthead; everything below stays legible and functional.

## Tokens
- Paper: #f5efdf; raised paper: #eee6d5; ink: #24221e; muted ink: #625b50; rule: #a49a87; accent: #8d2924.
- Web headline/body serif: Georgia, Times New Roman, serif. Keep existing sans-serif where technical handles/forms need clarity. Native uses supported existing fonts unless separately verified.
- Fine 1px rules and double masthead divider. Square sidebar boxes; avoid card shadows and pill-heavy chrome.
- Masthead large uppercase, tightly spaced on desktop, compact on phone. Optional line: “Liberty — not authority — orders the page.” Do not present invented historical quotes as authentic.

## Layout
Desktop: full-width 184px masthead, 280px navigation, 840px feed and 320px context rail. Below 1500px, navigation becomes an icon rail and the masthead is 148px; the context rail appears from 1280px at 270px. Below 980px, use the upstream mobile navigation and a single feed column under an 88px masthead. The masthead is fixed to the viewport; the shell reserves its height in padding. Sticky headers and fixed sidebars share these offsets. The navigation stack is viewport-sized, so a sticky masthead would disappear on deep scroll. The document, body and root keep the paper theme beyond the navigation viewport. Layout constants and ALF breakpoints change together. Native phone styling remains on the existing flow; native tablet rendering is not device-verified.
Mobile: compact brand, single column, existing mobile navigation and composer. Collapse side ornaments/rails before shrinking readable content. No horizontal scrolling at 390px.

## Content and behavior
Use actual account/feed data. Do not copy fictional posts, counts or imagery from reference. Do not claim user ownership, verified ranking inputs or newest-first without evidence. Feed explanation separates supplied metadata and unknown facts. Client does not create blocks; existing network relationships may remain enforced.

## Accessibility and verification
Readable body ~16–18px with comfortable line height. Keep accessible action labels, visible keyboard focus, suitable touch targets and theme-specific contrast. Reduced motion must work. Verify desktop, tablet and phone actual render, font fallback/glyphs, dark/dim and form states. Reference screenshot is aesthetic direction, not functional or protocol evidence.
