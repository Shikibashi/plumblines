# Selected Direction: Newspaper Paper-Object Depth

## Source and selection

- Source mode: user-directed refinement of the existing Story Interiors design.
- User selection: “Keep the newspaper; add paper-object depth.”
- Scope: preserve the masthead, newspaper compositor, Reading index/article states, source order, and existing post/document behavior.
- Reference family: adapt the paper-object branch of papercraft and analog stationery. Use the supplied reference's distinction between a material object and a flat surface as the design test; do not reproduce a named site's branding or layout.
- Product Design capability: installed, but its prototype API was not callable in this session. The local comparison varies only the selected paper-depth treatment; it does not replace the earlier story-composition candidates.

## Three rendered treatments

All candidates used the same marked Standard Reader fixture at 1440×900 and 390×900. The layout, type, navigation, and article content stayed constant.

| Candidate | Treatment | Review |
|---|---|---|
| Soft lift | One broad, diffuse shadow around each sheet | Rejected: adds elevation but reads like a generic card and reveals little paper stock. |
| Layered edges | Hairline edge, a crisp offset stock edge, then a short soft shadow | **Selected:** reads as a newspaper sheet with another sheet beneath it; keeps the existing rectangular page and wide margins. |
| Under-sheet | A second, separately outlined paper rectangle behind the folio | Rejected: the duplicate outline becomes a second frame and competes with the newspaper's own border. |

Desktop index comparisons: [soft lift](evidence/paper-depth/01-soft-lift-desktop-index.png), [layered edges](evidence/paper-depth/02-layered-edges-desktop-index.png), [under-sheet](evidence/paper-depth/03-under-sheet-desktop-index.png).

Phone index comparisons: [soft lift](evidence/paper-depth/01-soft-lift-phone-index.png), [layered edges](evidence/paper-depth/02-layered-edges-phone-index.png), [under-sheet](evidence/paper-depth/03-under-sheet-phone-index.png).

The selected direction also treats quoted posts as source-identified clippings: raised paper, a thin perimeter, the existing left source rule, and a restrained lower edge. Story rows and the Reading grid remain unboxed. This keeps physicality attached to real paper relationships instead of making every item a card.

## Adopt, adapt, avoid

- **Adopt:** visible stock edges and the slight offset produced by stacked sheets and pasted clippings.
- **Adapt:** keep the current Georgia/Times newspaper typography and square clipping shape; use existing colors and a small CSS shadow instead of adding a paper texture or new dependency.
- **Avoid:** simulated handwriting, torn edges, tape, binder hardware, chrome, glass, and universal card grids. They would shift the product away from its established newspaper structure.

## Acceptance

- The article folio shows a second stock edge on desktop and phone without changing its layout or scroll behavior.
- A quoted record has visible paper material and source alignment in light, dim, and dark themes.
- Body copy, provenance, moderation, keyboard focus, and touch targets retain their existing states.
- Reduced-motion behavior needs no additional rule because the treatment adds no motion.

## Implementation and visual QA

Selected source-render views: [light desktop index](evidence/paper-depth/selected-light-desktop-index.png), [light desktop article](evidence/paper-depth/selected-light-desktop-article.png), [light phone article](evidence/paper-depth/selected-light-phone-article.png), [system dark/dim desktop article](evidence/paper-depth/selected-system-dark-dim-desktop-article.png), and [system dark/dim phone article](evidence/paper-depth/selected-system-dark-dim-phone-article.png).

Implementation and fresh render evidence are recorded in [the Story Interiors implementation log](2026-09-24-impl-log-story-interiors.md). The comparison screenshots use marked test content and are design evidence only; they are not product copy or protocol evidence.
