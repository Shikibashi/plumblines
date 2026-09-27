# Layout Blueprint: Compositional News Grammar

## Comparison frame

Use the same page-level shell, fixture content, section order, feed order, timestamps, and viewport dimensions for all three Product Design candidates. The current front-page composition is held constant; this pass tests the story interiors, Reading index, and article reader.

## Dispatch interior

- Metadata appears in a quiet line that identifies the actual author/handle, source, timestamp, and any actual repost/reply reason.
- The original post body is the primary typographic content. It may use the available story span and responsive type scale, but it is never restated as a headline.
- Reply context appears as a concise annotation before the body when it materially clarifies the thread.
- A quote appears after the quoting text as a source-identified clipping with a single rule or aligned inset. It retains warning/reveal behavior.
- Source media follows the post text unless the image-text-interlock candidate deliberately places it beside text on wide layouts. Mobile always returns media to normal flow.
- Actions follow the story in a compact labelled line or accessible control group. Their reach and hit area remain usable; engagement numbers do not become credibility cues.

## Image-bearing dispatch

- The image can occupy a larger share of its assigned story region and can align to the page grid.
- Caption and alt text retain their actual semantics; a missing caption stays missing.
- Image size changes treatment, never order, prominence claims, or inferred importance.
- A text-only dispatch has no empty media well.

## Reading front

- Heading and source/provenance statement identify the section and public index.
- Article entries use actual title, description, publication, date, reading-time metadata, and labels only when supplied.
- On desktop, entries share an asymmetric grid and a consistent baseline; on phone, they become a single ordered list.
- Language headings appear only for explicit declared tags. The current Standard Reader item has no language property, so the prototype must show the unspecified state and identify metadata support as a dependency.
- The index is not a permanent 30/70 inspector layout.

## Article reader

- Full-width reader state occupies the central reading region rather than a side rail.
- Place a clear Back to Reading control before article content.
- Render the genuine title, actual description, contributors/publication, published date, reading time, and cover only when those fields exist.
- Main prose is one column with a flexible measure around 55–65 characters; text scale and line height stay comfortable.
- No permanent recommendation rail, floating engagement pile, or competing configuration panel.

## Continuous pagination

- Browser/window remains the only vertical scroll context for Front Page and section fronts.
- Keep the sentinel at the end of the source-ordered continuation and observe against the document viewport.
- When the next cursor is available, load near the end and append under the existing sheet landmarks. Keep prior content mounted and stable.
- Show an announced loading state and a compact manual Load more control. If the request fails, show retry without clearing earlier pages.
- If there is no cursor, show an end marker rather than a false infinite-loading affordance.

## Settings boundary

- Account mutes, muted words, and local snoozes stay in Settings.
- Story menus may offer existing item-level mute/hide/report actions only if already supported and semantically correct; no manager panel is embedded in the front page.

## Candidate review variants

1. Column-led dispatch: local measure and rule relationships carry hierarchy.
2. Typographic flow: body rhythm dominates; source and context are compact but persistent.
3. Image-text interlock: supplied media and text align as a single composition; text-only stories remain complete.

No candidate may change source order, fabricate metadata, suppress moderation, or alter the page-level compositor.
