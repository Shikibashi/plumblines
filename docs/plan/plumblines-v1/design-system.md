# Newspaper design system
Canonical design choices: see root DESIGN.md. This document maps them to implementation.

- `src/alf/themes.ts`: warm neutral light palette, restrained red primary, accessible alternate themes.
- `src/plumblines/theme/`: newspaper tokens and web serif stack; avoid overriding native font family globally.
- `src/plumblines/components/`: masthead and truthful feed context; existing navigation Link/Button used for actions.
- `src/view/shell/desktop/{LeftNav,RightNav}.tsx`: navigation and contextual rail, retain real handlers.
- `src/view/shell/index.web.tsx` / `src/components/Layout/index.tsx`: masthead and coherent offsets, preserve portal layers.
- Feed styles should inherit theme and typography while maintaining existing interaction bounds.

Desktop: wide masthead, three clear columns, fine rules, square edges. Mobile: compact masthead, one content column and existing navigation; hide ornamental slogans before shrinking content.
Do not render screenshot as application, copy fictional people, or assert fake counts. Body text remains readable at 16px or more; controls retain accessible labels and visible focus. Test 390px, 768px and 1440px widths.
