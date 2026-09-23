# Direction: Newspaper Object

- Selected candidate: **A — composed front with continuous sheets**.
- Selection: `AUTO_SELECTION`; user-provided requirements directly specify one composed front, stable spatial positions, a continuous document scroll, a separate Reading destination, and muting in Settings.
- MODE: newspaper-oriented social client; section sources compose a front, then the selected source continues on following sheets.
- COMPOSITION: asymmetric front-page packages above full-width numbered continuation sheets.
- MESSAGE: the reader controls placement; feed/provider order stays attributed and unchanged.
- CTA: “Open the reading edition”; “Load more posts”; “Return to page one”.
- TRUST: source identity and actual metadata stay visible; no invented issue metadata or importance claims.
- RESPONSIVE: front-page composition flattens in editorial order; continuation sheets stay full-width and retain their folios.
- STATE: existing source loading/empty/error/retry states remain in the existing query paths.
- VISUAL SYSTEM: existing paper/ink/accent tokens; subtly darker outside surface and sheet edge; existing serif editorial roles, readable sans-serif controls.
- MOTION: no new motion; preserve reduced-motion support.
- NEGATIVE: independent scroll panes, equal feed columns, permanent filter controls, mutation of protocol content, generated headlines.
- SUCCESS: the story placement and page landmarks still read like a composed newspaper if the logo is removed.

## Candidate exploration and status

Three comparable, rendered candidate routes were not produced as throwaway prototypes. This implementation is a constrained continuation of an existing, deployed Plumblines branch, and the user's supplied direction already fixes the core information architecture and interaction boundaries. The choice is therefore recorded as an evidence-based auto-selection from the explicit requirements, not as a user preference among unseen options. Comparative visual exploration remains unverified.

## Render and selection evidence

- Existing local preview: `http://127.0.0.1:8139/` (rebuilt from current source on 2026-09-23; `/healthz` returned `ok`).
- Initial audit capture: desktop browser preview at approximately 1175px wide, 2026-09-23; it showed the lead/front composition but the Following continuation still read as a repeated feed and the surface lacked strong sheet separation.
- Post-change desktop capture: in-app browser screenshot at approximately 1038×1150 on 2026-09-23; showed the new paper/sheet boundary and Page 1 composition. Live feed content was present. The upstream quote-embed renderer still contributes a rounded card treatment.
- Post-change phone capture: `docs/zeus/evidence/responsive-390.png`, 390×992, light theme, signed-out/guest state, Playwright on 2026-09-23. The mobile test confirmed no horizontal overflow; it also exposes the guest sign-in/empty-content layout rather than an authenticated timeline.
- Three-way rendered candidate comparison: `NOT RUN`; see candidate exploration status above.

## Product Design gate

- Status: `ABSENT`.
- Exact candidate: `product-design@openai-curated-remote`, snapshot `0.1.55`, marketplace source `openai-curated-remote`.
- Installed/current-session capability: not available. No install was requested; local implementation adapter used.
- Product Design adapter comparison: `NOT RUN` because the adapter is absent and no user comparison was requested.
