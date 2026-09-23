# Layout Blueprint: Newspaper Object

## Front Page, desktop

1. Masthead sheet: Plumblines nameplate and existing publication metadata; answer “where am I?”
2. Section rail: Front Page, configured sections, Reading; the active item uses an underline/rule.
3. Folio: current Live Edition/page marker; do not make up issue numbers.
4. Page 1 compositor: lead source, briefs from that same source, configured secondary fronts. Asymmetric 12-column composition. Source configuration selects layout; it does not rank content.
5. Reading entry: concise link to its separate edition.
6. Page 2+ continuation: lead source items after the Page 1 packages, grouped in ordered slices. One global document scroll; no internal overflow viewport.
7. Each continuation sheet: folio, items, colophon/page number and Return to Page 1 anchor. More/retry controls stay outside story content and preserve previous sheets.

## Section Front

1. Compact masthead and selected section name.
2. Section settings in the section menu, including filters and source details.
3. Existing feed results in provider order with current moderation and actions.
4. Existing cursor pagination and visible retry/loading states.

## Reading Edition

1. Compact masthead and Reading position in the section rail.
2. Standard Reader index, with explicit loading/empty/error states.
3. Article detail uses genuine document fields and existing Standard.site renderer.
4. Calm readable body measure; no permanent recommendation rail interrupting the article.

## Settings

Mute accounts, muted words, local attention/snoozes, and moderation preferences remain in Settings. Contextual hide/report controls remain with stories/accounts.

## First viewport and density

At 1440×900, show masthead, section rail, and the first composed packages. The page then scrolls through remaining Page 1 content and enters a distinct Page 2 sheet. At 390px, the hierarchy flattens to a single column in editorial order; no horizontal overflow or nested scrollbar is introduced.

## UI anatomy

`reading surface → paper sheet → masthead/folio → section rail → editorial package → source identity → original content → actions → page colophon`.

The front page sheet has a hairline edge and slight lift. Rules, margins, scale, and position carry structure; story packages do not each receive complete borders. Page boundaries are visible but do not constrain content to a print-sized rectangle.
