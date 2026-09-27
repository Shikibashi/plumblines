# Delta Critique: Story Interiors and Reading Sheets

## Selected direction

Continue the user-approved newspaper sheet/compositor. This is a focused component and Reading-state delta; no new full-page color, type, or masthead directions are explored. The user explicitly called the page-level redesign “on the right track” and supplied the next pass priorities.

## Evidence before implementation

- Local browser render shows distinct page sheets and one continuous scroll, but the stories still expose upstream avatar-first feed geometry and a rounded nested quote presentation.
- The current Reading DOM uses a 30/70 list/detail grid that looks like a dashboard; the user explicitly asks for a Reading front followed by a separate article sheet.
- The utility row and edit/manage controls remain visible alongside primary section names.

## Design decision

- Keep the upstream post renderer as the moderation, embed, attribution, and action engine.
- Add a narrow Plumblines presentation seam and a dedicated story adapter; avoid copying its business logic.
- Make quoted records read as an inset clipping, and keep reply/repost labels semantically explicit.
- Make the Reading front a source-ordered story grid. Opening a document replaces the grid with a reader sheet and a return action.
- Demote top utilities and edition editing; leave mute management in Settings.

## Render exploration status

Three full-page candidates are not appropriate for this delta because the user selected the existing page direction and explicitly requested component-level follow-up. The existing layout and palette are preserved. Acceptance is based on the local rendered implementation at desktop and phone widths, not a fictional comparative render.

## Remaining risks

- Upstream embeds include complex external and video renderers; style only the outer Plumblines presentation boundary and preserve their internal controls.
- Guest Following content is empty; authenticated feed visual coverage depends on the available signed-in browser state.

## Paper-object depth review — 2026-09-24

The user selected “Keep the newspaper; add paper-object depth.” Three rendered treatments kept the masthead, article layout, type, and fixture content constant at 1440×900 and 390×900. The broad soft lift looked like a generic card; the separately outlined under-sheet introduced a competing frame. The layered-edge treatment reads as a second sheet beneath the folio while keeping its existing rectangular outline and grid, so it was selected.

The selected source-backed browser render retains the existing Reading front and single-column article sheet at desktop and phone widths. System-dark rendering resolves to the app's `theme--dim` variant; the raised-paper and shadow tokens were also resolved under `theme--dark`. A marked CSS probe confirmed the quote selector resolves to raised stock, a 3px left rule, and the layered edge shadow. That probe checks presentation CSS only; a signed-in AT Protocol quote render was not captured.

Evidence: candidate comparisons are in `evidence/paper-depth/`; selected renders are listed in [the paper-depth direction](2026-09-24-direction-story-interiors-paper-depth.md). Product Design's prototype API was unavailable; these screenshots are local browser review, not deployment evidence.
