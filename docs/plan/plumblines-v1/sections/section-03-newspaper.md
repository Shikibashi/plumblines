# Newspaper shell and truthful context
## Background
Existing upstream client; user requests Plumblines newspaper fork. Read plan.md/spec.md and root DESIGN.md.
## Requirements
R4, R5, R6, R7; preserve auth and protocol compatibility.
## Dependencies
Main must finish pristine baseline attempt before code changes. No new backend. Identity export coordination with section 01 if needed.
## Module Contract
- Provides: responsive newspaper presentation and feed context.
- Consumes: existing client conventions and source.
- Owns: src/plumblines/theme/; src/plumblines/components/; src/alf/themes.ts; src/view/shell/index.web.tsx; src/view/shell/desktop/{LeftNav,RightNav}.tsx; src/components/Layout/; minimal Typography/home integration.
- Composition Point: Existing ALF, navigator and real query state.
## Reference Libraries
Reuse installed React Native/Expo, ALF, Lingui and query stack. No new dependency without scope gate.
## Implementation
Implement DESIGN.md. Preserve working left navigation and composer. Add coherent masthead offsets across fixed rails and central content. Sidebar offers existing moderation routes and honest current feed context. Do not inject fictional timeline rows or claims. Retain loading/error/empty states, mobile navigation and theme variants.
## Test Scenarios
QA09, QA10, QA11, QA12, QA13, QA14 in qa-scenarios.md. Run only package-script checks; main integrates full build.
## Implementation Strategy
Small composition changes, preserve original handlers. Return exact changed files and actual checks to main.
## Quality Gate
No new type/lint errors; requirements covered; unexplored/live paths explicitly NOT VERIFIED.
## Risk & Rollback
Revert only section-owned diff. Preserve other workers' files. Request main reassignment before touching an overlapping path.
## Acceptance Criteria
Requirements implemented in actual app and tests/render evidence reported. Documentation existence does not prove acceptance.
## Files
src/plumblines/theme/; src/plumblines/components/; src/alf/themes.ts; src/view/shell/index.web.tsx; src/view/shell/desktop/{LeftNav,RightNav}.tsx; src/components/Layout/; minimal Typography/home integration.
