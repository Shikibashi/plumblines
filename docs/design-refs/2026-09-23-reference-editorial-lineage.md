# Reference Assessment: Continuing an Editorial Lineage

## Source and authority

- Source: user-attached essay, `Pasted text.txt` in this design-plan request.
- Type: conceptual design reference, not a visual benchmark or implementation instruction.
- Evidence limit: the essay proposes useful design ideas but does not provide enough primary-study details to independently validate its research claims. Treat its HCI framing as a hypothesis for prototype review, not as established Plumblines product evidence.
- Direct product constraints remain authoritative: keep the current page compositor, make story interiors and Reading more editorial, preserve one document scroll, and keep mute management in Settings.

## Useful idea

Continue the editorial grammar of *Liberty* into contemporary software instead of recreating its historical appearance. Judge that continuity across three connected layers:

1. **Surface:** hierarchy comes from measure, alignment, type roles, whitespace, and a few rules. It should still read as publication design when the masthead, warm palette, and serif display type are mentally removed.
2. **Behavior:** controls are placed where their consequences make sense. Editing a reader-selected edition may reveal layout controls; reading a dispatch should keep ordinary, accessible post actions understandable and available.
3. **System:** Plumblines presents source-faithful dispatches and long-form documents as distinct editorial forms while retaining their AT Protocol records, ordering, moderation, and action behavior.

The working design thesis is **editorial continuity without period simulation**. The interface should derive from publication relationships and reading tasks, not from fictional paper props.

## Adopt / Adapt / Avoid

### Adopt

- Let editorial identity arise from organization, not a name or skin.
- Make author, source, time, reply/repost context, quotation, media, and actions relate visibly within each dispatch.
- Keep dispatches, quotations, correspondence, images, and Standard.site articles distinct where their source semantics differ.
- Make direct manipulation available for actual reader choices, such as a supported edition-layout change, with clear standard controls and reversible state.

### Adapt

- Treat “operational furniture” as contextual, legible web controls that expose a real publication task; do not imitate a physical control panel.
- Use clipping-like inset treatment only to clarify quoted-source boundaries; keep source identity and moderation visible.
- Use the paper-sheet metaphor as quiet spatial structure already in the product, not as a mandate for cards, stationery, texture, stamps, or 3D effects.
- Prefer Plumblines-owned presentation seams around upstream content/actions. Add components when they own a real presentation responsibility, not to satisfy a proposed naming scheme.

### Avoid

- A mandatory “Neo-Liberty” namespace or a broad design-system rewrite before the rendered direction demonstrates value.
- Treating “no cards” as an absolute rule; use a boundary when it improves grouping, focus, touch use, or comprehension.
- Replacing meaningful post actions with obscure newspaper jargon.
- Reimplementing `PostFeedItem` protocol, moderation, embed, or action logic.
- Historical labels, invented issue furniture, decorative paper objects, distressed text, sound, page curls, or camera-like hardware controls.
- Changing the front-page compositor in this story-interior pass.

## Prototype implications

The next Product Design exploration should test whether story identity survives beyond surface styling. Keep the existing masthead, palette, section rail, page composition, source order, and fixture data fixed. Compare dispatch typography and relationships, the treatment of reply/quote/media, and the visibility and placement of actions. Include both the Reading index and its focused article state so the publication/reader transition is evaluated as a system behavior.

Use three rendered candidates only after the Product Design capability is callable. Keep animations off or incidental; there is no benefit in testing physical simulation here. Review the candidates both with and without the Plumblines logo/paper/serif cues, and use comprehension, source truth, mobile order, and action discoverability as the deciding evidence.

## Decision status

- Accepted as a design hypothesis: editorial lineage should extend through composition and behavior, not decoration alone.
- Adapted: “paper craft” and “instrument panel” become structure and contextual controls, not literal simulated objects.
- Preserve the previously selected `Layered edges` paper-depth treatment in [`2026-09-24-direction-story-interiors-paper-depth.md`](2026-09-24-direction-story-interiors-paper-depth.md); this reference does not reopen that decision.
- Not selected: a new story-interior direction or architecture.
- Production code and `DESIGN.md`: unchanged by this reference assessment.
