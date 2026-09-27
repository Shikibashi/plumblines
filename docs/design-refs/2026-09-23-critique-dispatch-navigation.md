# Render Critique: Dispatch Treatments and Page Navigation

## Scope and direction exemption

This is a focused delta to the existing newspaper direction, not a replacement of its front-page composition, message, or mobile flow. The prior render already establishes the paper sheet, asymmetrical front page, separate Reading destination, and continuous document scroll. The design-plan render-critique exemption for a small component/local change applies; three new full-page candidate renders were not run. Render-based acceptance still requires actual post data, desktop/mobile screenshots, and keyboard/reflow checks.

## Before

The live 1038px-wide render showed that the lead/briefs relationship became an even split at laptop width. The lead and brief items also retained upstream round avatar/action styling. This made the visual page subordinate to the social-feed component grammar, especially in the dispatch rail. Long continuation streams had numbered sheets and return links, but readers had no direct page index or current-folio signal.

## Changes

- Keep the lead/briefs split asymmetric at laptop widths, flattening only at the established mobile breakpoint.
- Preserve upstream `PostFeedItem` / `Post` for source identity, original text, moderation, embeds, reply context, and actions; apply Plumblines-owned dispatch treatment around them.
- Set a red marginal focus/lead cue, prose measure, smaller metadata and avatar treatment, and square transparent action controls. Do not invent a headline or dateline.
- Add a loaded-page index linking to actual sheet anchors; a scroll-position landmark updates `aria-current="location"` for the visible sheet, including unusually tall pages. Normal document scrolling remains.
- Keep long-form Standard.site material on the separate Reading destination and all mute/snooze managers in Settings.

## Remaining visual risks

- The reused upstream renderer still contains quote/link embeds and a rich set of actions. This delta quiets their controls but does not redesign each embed type.
- Guest Following has no entries by design, so its blank state cannot visually prove the dense authenticated composition. Authenticated phone QA is still required.
- One composition direction was retained because this change is a local component/navigation delta; a whole-page direction comparison is out of scope for this pass.
