# QA scenarios

| ID | Scenario | Expected |
|---|---|---|
| EFP-01 | Same configured sections/items render twice for each template | Identical source-order slot mapping; no randomization or engagement score. |
| EFP-02 | First section becomes lead, then user reorders sections | Prominence follows explicit local order and says it follows the reader's layout. |
| EFP-03 | One or eight sections, including more than one sheet | Every story remains in document scroll; all pages have named/numbered anchors and navigation. |
| EFP-04 | Add/rename/reorder/filter/remove section | Existing v1 behavior and local persistence remain; filters are inside section settings, not always-on story header. |
| EFP-05 | Exact long/short social dispatch, quote, repost, image, label or muted item | No generated headline/dateline; original interactions/provenance/moderation labels and warnings work. |
| EFP-06 | Feed loading/error/empty/load-more | Honest source-specific status/action remains within section with no nested scrollbar. |
| EFP-07 | Standard.site `getLatestFeed` and `getDocument` fixtures | Actual title/description/publication/author/date/time are shown; renderer draws supported body blocks. |
| EFP-08 | Malformed/unavailable Standard record, body with inline/block embeds | Safe fallback/error; no unsafe HTML execution, invented fields, or lost attribution. |
| EFP-09 | Guest and signed-in front page, no publications indexed | Guest can read public results without signing in; empty state explains source. Authenticated writes are not made. |
| EFP-10 | 390, 768, 1040, 1586px; light/dim/dark; keyboard/reduced motion | No horizontal overflow, acceptable hierarchy/touch target, clear focus, reduced motion honored. |
| EFP-11 | Front page then post/profile/other route | Masthead compacts on interior route; sticky headers and page shell remain correctly offset. |
| EFP-12 | Existing no-block policy/public blocked-content tests | Creation writes remain rejected; removal and read-only public access retain prior behavior. |
