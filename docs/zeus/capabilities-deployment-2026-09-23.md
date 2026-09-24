# Removal-only moderation deployment

Deployed to https://plumblines.uk: `bc9995ac-5efc-4616-a021-7815bb6677a3`, source `486b5ee8c314485812a6844e2eb877f17b561082`, at 2026-09-23T06:27:00.013306Z. Immutable URL: https://bc9995ac.plumbline-f50.pages.dev. Preview: https://3be26002.plumbline-f50.pages.dev. Rollback: `691324f3-e1ad-4a16-8d47-8b404f59c84d`.

The client no longer contains account/list block-creation hooks or dormant block handlers. Shared account capabilities and menu builders expose existing-block removal. Chat requests offer independent mute, delete and report actions; after-report dialogs cannot block. The Existing Blocks page explains account state. The common authenticated-client transport rejects serialized block/listblock create, put and batch writes while allowing deletes. See [capability contract](../plumblines/moderation-capabilities.md).

## Verified

- Lint and iOS/Android/web typechecks pass. A new test fixture initially widened a DID to string; corrected to a literal type and rerun successfully.
- Core full Jest run: 84 suites, 914 passed, 28 inherited todo, 21 snapshots. Final focused run after request-menu mute addition: four suites, 34 passed, including five new request-action cases.
- Independent native review found no actionable core regressions; separate UI review found native Menu.Group dropping wrapper children. Fixed to return direct Menu.Item and tested with the real native group.
- Optimized export passes. Non-root Docker container rebuilt from final export and healthy; local container browser suite 28/28 (52.6s).
- Preview browser suite 28/28 (1.0m). Production custom-domain browser suite 28/28 (59.3s).
- All three entry JavaScript assets and two stylesheets on plumblines.uk match `.cloudflare/pages-ton2dfza` byte-for-byte. Identical packaged files were uploaded to preview and production.

SDK transport tests use a controlled fetch boundary, and account/profile states use fixtures. No authenticated live-account mutations or native-device execution were performed. Public blocked-post recovery continues to use live public data. Existing search/CORS, dependency and analytics-injection limits remain. The PDS, DNS, tunnel, account data and previous deployments are unchanged.

Raw generated evidence: `docs/zeus/evidence/capabilities-*`. A Cloudflare API inspection first returned 401 after OAuth expiry; the normal Wrangler CLI refreshed its existing session, and inspection/deployment then succeeded.

The expanded newspaper-v1 brief received during this deployment is tracked as the next implementation phase; this receipt covers moderation only.
