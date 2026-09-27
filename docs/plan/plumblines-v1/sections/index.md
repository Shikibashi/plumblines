<!-- SECTION_MANIFEST
section-01-brand
section-02-policy
section-03-newspaper
END_MANIFEST -->
# Section index
Baseline build is a main-owned prerequisite. All three sections may then run in parallel with exclusive files.

## Harness
Existing Expo app, FlatNavigator, ALF themes, query mutation hooks. Main owns cross-section integration and evidence.
| Section | Provides | Consumes | Composition |
|---|---|---|---|
| 01-brand | identity config, original assets, disabled collectors | existing entrypoints | app.config / analytics / logger |
| 02-policy | no-create-block capability | existing profile/list actions | mutation hooks + action menus |
| 03-newspaper | shell/theme/provenance UI | config identity; actual feed context | ALF + web shell |
No shared foundation rewrite: three independent capabilities, no common new runtime registry.

## Ownership
01 owns config, brand assets, app configuration, analytics/logger, logo primitives and asset inventory. It must not edit desktop rails, Layout, ALF or policy mutation files.
02 owns policy files, profile/list mutation hooks and block action entrypoints, associated tests. It must not edit shell/theme/branding.
03 owns theme/components, web shell rails, ALF and Layout/typography integrations. It consumes config exports; must not edit config or logo primitives.
Main resolves any additional shared path before edits, and owns docs outside this planning directory, build/runtime/test integration and release decisions.

## Ecosystem coverage
Client identity 01; attention mutations 02; presentation/feed provenance 03; external PDS/AppView unchanged; deployment main-owned conditional validation.
