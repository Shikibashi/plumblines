# Block creation policy
## Background
Existing upstream client; user requests Plumblines newspaper fork. Read plan.md/spec.md and root DESIGN.md.
## Requirements
R3, R6; preserve auth and protocol compatibility.
## Dependencies
Main must finish pristine baseline attempt before code changes. No new backend. Identity export coordination with section 01 if needed.
## Module Contract
- Provides: central block capability and guarded mutation boundary.
- Consumes: existing client conventions and source.
- Owns: src/plumblines/policy.ts; src/state/queries/profile.ts; src/state/queries/list.ts; src/view/com/profile/ProfileMenu.tsx; src/components/dms/ConvoMenu.tsx; other discovered block creation UI; policy tests.
- Composition Point: Existing profile/list query and action menu hooks.
## Reference Libraries
Reuse installed React Native/Expo, ALF, Lingui and query stack. No new dependency without scope gate.
## Implementation
Reject direct block and blocking-list creation before network calls and optimistic state changes. Hide only creation commands. Preserve existing removal, mutes, reports, thread controls and labels. Search all queueBlock, useProfileBlock and blockActorList callers; guard forgotten entrypoints through mutation boundary.
## Test Scenarios
QA03, QA04, QA05, QA06, QA07, QA08 in qa-scenarios.md. Run only package-script checks; main integrates full build.
## Implementation Strategy
Small composition changes, preserve original handlers. Return exact changed files and actual checks to main.
## Quality Gate
No new type/lint errors; requirements covered; unexplored/live paths explicitly NOT VERIFIED.
## Risk & Rollback
Revert only section-owned diff. Preserve other workers' files. Request main reassignment before touching an overlapping path.
## Acceptance Criteria
Requirements implemented in actual app and tests/render evidence reported. Documentation existence does not prove acceptance.
## Files
src/plumblines/policy.ts; src/state/queries/profile.ts; src/state/queries/list.ts; src/view/com/profile/ProfileMenu.tsx; src/components/dms/ConvoMenu.tsx; other discovered block creation UI; policy tests.
