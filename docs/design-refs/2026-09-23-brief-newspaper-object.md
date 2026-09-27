# Design Brief: Newspaper Object

## Source Mode

- Mode: product-derived
- Evidence: User's explicit newspaper redesign brief and correction that the product must feel newspaper-shaped, support continuous scrolling, keep long-form Reading separate, and keep muting in Settings; current repository audit and rendered preview.

## Product

Plumblines is a newspaper-oriented AT Protocol client. The paper metaphor must shape spatial organization and navigation as well as visual styling. The front page is a composed, user-directed arrangement of social dispatches; long-form Standard.site documents belong in a distinct Reading destination.

## Audience and primary task

Readers who want to browse Following and their configured sources in one continuous, stable, readable edition. The primary task is to scan the front page, continue into more dispatches without managing nested scrollbars, or deliberately open long-form Reading.

## User friction

The previous layout made every configured section a separately scrolling feed and repeated filter controls in the reading flow. It looked like a dashboard styled as a newspaper, interrupted spatial memory, and made the reader manage viewports instead of reading a page.

## Constraints

- Preserve upstream feed queries, pagination, moderation, labels, post actions, source order, and existing Plumblines settings.
- Do not create headlines for posts, infer story importance, or invent edition metadata.
- Use one browser scroll on the front page; pages are stable visual landmarks, not hard pagination.
- Reading/articles are a separate destination.
- Account mutes, word filters, and local snoozes remain in Settings.
- Keep the block-creation prohibition and existing account/block read handling unchanged.
- Mobile remains a single-column newspaper hierarchy without horizontal overflow.

## Observable success

- The Following continuation is appended below Page 1 as distinct, numbered sheet landmarks and uses the same document scrollbar.
- Loading more appends content while retaining existing page positions and order.
- A reader can return to Page 1 from each continuation sheet.
- Reading is opened through its own navigation destination rather than injected into the social stream.
- No moderation/muting manager appears in front-page configuration.
- Wide and phone renders preserve clear paper edges, folios, source identity, and readable story order.
