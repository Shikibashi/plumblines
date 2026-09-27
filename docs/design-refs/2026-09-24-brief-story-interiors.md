# Design Brief: Story Interiors and Reading Sheets

## Source mode

- Mode: delta
- Evidence: user-provided design brief in `Pasted text.txt`; current `DESIGN.md`; current front-page render and source audit on 2026-09-24.

## Product and task

Plumblines already composes sources into a paper-like front page. This pass makes the individual dispatch and long-form reading interactions belong to that publication model. Readers scan the configured front, recognize who wrote or reposted a dispatch, inspect quotes and replies without losing context, then open a separate article sheet when they choose long-form reading.

## Friction to remove

- Dispatch wrappers still contain prominent social-feed geometry (large avatars, generic action rows, nested quote cards).
- The Reading destination still places an article list beside an article, creating a dashboard-like master/detail page.
- Reader, account, edition-editing, and section-management controls compete with the section rail.
- Image-bearing posts differ too little from text-only posts.

## Constraints

- Preserve source text, timestamps, identities, repost/reply attribution, media alt text, labels, warnings, moderation, embed rendering, and protocol action behavior.
- Do not infer headlines or significance for social posts. Do not reorder source/provider items for visual treatment.
- Reuse upstream post/data/action renderers through a small presentation adapter; do not copy `PostFeedItem` internals.
- Preserve the one document scroll, separate Reading route-state, Settings location for mute management, blockless write policy, and current deployment path.
- Keep mobile Reading as a single-column article list; opening an article replaces the list with a calm reader sheet and a clear return action.

## Desired outcome

Dispatch metadata reads as a byline; actual post text is the headline-like element; repost and reply context become concise editorial annotations; quoted posts read as ruled clippings; images gain a visual-story composition; engagement controls remain accessible but recede. Reading first presents an asymmetrical article front, then opens one document in a single readable measure.

## Design-reference delta

The attached “continuing an old design language forward” essay adds a useful test: the editorial character should remain in the relationships and behaviors when the brand styling is removed. Apply this as **editorial continuity without period simulation**; see [`2026-09-23-reference-editorial-lineage.md`](2026-09-23-reference-editorial-lineage.md) for the Adopt/Adapt/Avoid assessment. The essay is inspiration, not authority to introduce a “Neo-Liberty” component namespace, physical-paper props, or a new compositor.

The already selected `Layered edges` paper-depth treatment in [`2026-09-24-direction-story-interiors-paper-depth.md`](2026-09-24-direction-story-interiors-paper-depth.md) is fixed during this delta; it is a restrained sheet cue, not a direction to add paper objects to stories.

## Scope boundary

This is a delta to the current newspaper direction, not a new color, masthead, or page-compositor exploration. Sheet, folio, section ordering, continuous scroll, and palette are preserved.
