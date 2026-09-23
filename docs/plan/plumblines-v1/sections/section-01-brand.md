# Fork identity and telemetry
## Background
Existing upstream client; user requests Plumblines newspaper fork. Read plan.md/spec.md and root DESIGN.md.
## Requirements
R1, R2, R6; preserve auth and protocol compatibility.
## Dependencies
Main must finish pristine baseline attempt before code changes. No new backend. Identity export coordination with section 01 if needed.
## Module Contract
- Provides: identity config and original product assets.
- Consumes: existing client conventions and source.
- Owns: src/plumblines/config.ts; fork brand assets; app.config.js; src/analytics/; src/logger/sentry/setup/; src/view/icons/Logo/Logomark/Logotype variants; asset inventory.
- Composition Point: Original application initialization.
## Reference Libraries
Reuse installed React Native/Expo, ALF, Lingui and query stack. No new dependency without scope gate.
## Implementation
Audit ASSETS.md and NOTICE.md. Introduce app name/domain/support in one config. Replace shipped entrypoint branding and disable upstream telemetry/error collection by default. Do not globally replace protocol service domains. Inventory remaining restricted assets explicitly; do not claim complete debranding if any ship.
## Test Scenarios
QA02, QA13, QA15, QA16 in qa-scenarios.md. Run only package-script checks; main integrates full build.
## Implementation Strategy
Small composition changes, preserve original handlers. Return exact changed files and actual checks to main.
## Quality Gate
No new type/lint errors; requirements covered; unexplored/live paths explicitly NOT VERIFIED.
## Risk & Rollback
Revert only section-owned diff. Preserve other workers' files. Request main reassignment before touching an overlapping path.
## Acceptance Criteria
Requirements implemented in actual app and tests/render evidence reported. Documentation existence does not prove acceptance.
## Files
src/plumblines/config.ts; fork brand assets; app.config.js; src/analytics/; src/logger/sentry/setup/; src/view/icons/Logo/Logomark/Logotype variants; asset inventory.
