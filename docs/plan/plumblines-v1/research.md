# Research — 2026-09-23
Existing application: React Native/Expo social-app, ALF tokens and React Navigation. This is an improvement of existing source, not a standalone mockup.

## Source evidence
- `AGENTS.md`: use package scripts for checks; preserve navigation/session/query patterns and Lingui strings.
- `src/view/shell/index.web.tsx`: FlatNavigator and shared dialogs; preserve portal, composer, drawer and session behavior.
- `src/view/shell/desktop/LeftNav.tsx`: existing desktop navigation, session controls and composition action.
- `src/view/shell/desktop/RightNav.tsx`: fixed rail with search/feed components and layout breakpoints.
- `src/components/Layout/index.tsx`: center-column positioning; coordinate any masthead offset here, not arbitrary per-page margins.
- `src/alf/themes.ts`: createThemes composition point; use palette changes here to cover existing surfaces.
- `src/state/queries/profile.ts`: queueBlock optimistic shadow update; block mutation creates app.bsky.graph.block; unblock mutation deletes it.
- `src/state/queries/list.ts`: blockActorList creates blocking subscription; unblockActorList removes it. Mute list uses separate calls.
- `ASSETS.md`, `NOTICE.md`: upstream distinguishes source license from icons, illustration and brand asset rights.

## Current official references consulted
- https://github.com/bluesky-social/social-app/blob/main/README.md : fork identity, support and telemetry must differ; source and asset licenses are separate.
- https://atproto.com/blog/block-implementation : network blocking uses public repository records and distributed enforcement.
- https://docs.bsky.app/docs/advanced-guides/moderation redirected but returned no content; no additional claim inferred from it.

## Visual evidence
User image examined directly: large uppercase serif masthead, double horizontal rule, narrow left navigation, central feed with fine separators, boxed right provenance/attention controls, warm parchment and ink with oxblood accent. Approximate desktop proportions 19:57:24. Live content must not copy fictional authors or invented counters.

No install/build was run by planner. Baseline execution is main-agent owned and must precede implementation.
