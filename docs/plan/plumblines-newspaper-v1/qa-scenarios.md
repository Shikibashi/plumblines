# Acceptance scenarios

- Add and rename a public feed/list/search section; reorder/remove; reload retains config. Signed-out Following asks for sign-in without silent Discover.
- Wide two-column vs narrow active-section geometry; keyboard skips editable fields/dialogs and navigates visible stories.
- Following strict route uses timeline API, bypassing merge/fallback. Section filter matrix covers reply/repost/quote combinations.
- Local rules match literal text/account DID, expire exactly at boundary, replace prior snooze, reject corrupt schema, isolate accounts and guests; UI can end rules.
- Post info shows supplied DID/URI/CID and label sources; unavailable information stays unknown. Unknown custom JSON is literal text, no extra record request.
- Reader mode hides metrics/avatar decoration while preserving buttons, warning controls and author labels. Article mode retains original thread response and pagination.
- Text image preview/download includes full text and metadata; generation only after permitted moderation reveal.
- Root PWA metadata/icon paths resolve with correct sizes and MIME.
- Run all existing public profile/post recovery and telemetry/no-block regressions. No authenticated destructive account actions in production tests.
