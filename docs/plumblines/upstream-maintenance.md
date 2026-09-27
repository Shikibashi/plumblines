# Maintaining the social-app fork

Plumblines follows the fork rule: every changed upstream line is a future merge conflict. Keep product behavior in `src/plumblines/` and integrate through the smallest possible existing shell or typed-storage boundary. Reuse upstream account, query, moderation, post and thread components instead of rewriting their internals.

## Customization map

- Home route mount: `src/view/screens/Home.tsx` (existing integration; avoid further changes unless the route contract requires them).
- Shell, global masthead offsets and responsive paper styles: `src/style.css` (shared file; keep Plumblines rules grouped and scoped to `.press-*`, `.newspaper-*` or `body[data-plumblines-front-page]`).
- Typed account-local fields: `src/storage/schema.ts` (shared file; only add namespaced `plumblines*` local preferences, never protocol records here).
- Newspaper composition: `src/plumblines/frontpage/` and `src/plumblines/sections/`.
- Long-form document integration: `src/plumblines/reading/standard/`; keep upstream `StandardSiteEmbed` as the social-post preview.
- Blockless policy and action capability: `src/plumblines/policy.ts` and `src/plumblines/account-actions.ts`.

## Upstream sync steps

1. Keep `main` and `develop` on the upstream baseline. Fetch `upstream` and integrate on an explicit feature/integration branch from `codex/plumblines-v1`.
2. Inspect upstream changes touching Home, shell offsets, feed/post rendering, Standard.site support, typed storage and shared CSS before resolving conflicts. Preserve a concise `// plumblines:` marker only where code context needs an ownership explanation.
3. Prefer restoring upstream changes and adapting Plumblines-owned wrappers. Do not resolve by copying broad Plumblines rewrites back over upstream files.
4. Re-run the block-policy tests, all platform typechecks, lint, tests, web export and responsive browser cases. Distinguish mocks/local export from authenticated PDS, provider API, and production evidence.
5. Review branding, upstream analytics/feature-gate requests, CSP, and shipped asset provenance after each sync. No external telemetry endpoint is assumed to belong to Plumblines.

Current redesigned surface: [newspaper behavior](newspaper.md) and [audited file map](../plan/plumblines-editorial-frontpage/implementation-map.md).
