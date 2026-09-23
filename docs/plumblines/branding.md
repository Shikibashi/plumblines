# Fork identity and asset boundary

Identity lives in `src/plumblines/identity.json`, consumed by the Expo config and
`src/plumblines/config.ts`. Application package IDs, shared native app groups,
app deep links, browser titles, splash screens, and support entry points use
Plumblines. Protocol NSIDs, service DIDs, PDS/AppView/chat/video endpoints and
third-party service names remain compatible. Native module/class names are
internal ABI names; they are not the installed application's identity.

## Assets

267 runtime glyph exports use 172 vendored Lucide SVGs pinned to
`f06ac67e33d645c40b8ce19a0419c85c5d7dd751`. `licenses/LUCIDE.txt` retains both the
ISC notice and the Feather MIT notice. `assets/plumblines/icon-map.json` records
all semantic mappings; existing SVG metadata contracts are preserved. Filled
and outline API variants share an outline design, with state shown by existing
color and accessibility behavior. Optional novelty glyphs use the nearest
semantic replacement (alien: ghost; UFO: orbit; shaka: hand).

83 runtime raster paths have original Plumblines mark/editorial artwork at the
original image dimensions, including app icons, commissioned splash images,
announcement images, favicons, and social cards. The manifest and reproducible
scripts are documented in `assets/plumblines/README.md`.

Unused top-level upstream Central SVG source files in `assets/icons/` are not
imported by `src/` and must not be copied wholesale into a release. The web
export bundles referenced assets; `post-web-build.js` copies only that export.
Apple, Google and community logos identify their respective third-party
services; font and flag license notices remain unchanged. The upstream asset
inventory is retained below the fork status in `ASSETS.md`.

## Telemetry and support

Metrics and remote experiments are disabled without explicit fork configuration:

- `EXPO_PUBLIC_PLUMLINES_METRICS_API_HOST`
- `EXPO_PUBLIC_PLUMLINES_GROWTHBOOK_API_HOST` and `EXPO_PUBLIC_PLUMLINES_GROWTHBOOK_CLIENT_KEY`
- `EXPO_PUBLIC_PLUMLINES_SENTRY_DSN`
- `EXPO_PUBLIC_PLUMLINES_BITDRIFT_API_KEY`

The upstream environment variable names cannot accidentally enable these
services. Metrics do not queue, schedule timers, or transmit when unconfigured;
GrowthBook does not initialize or refresh remotely. Fork support points to the
repository issue tracker and no longer places the account email, DID, or handle
in support URLs. Network-service policies and explanatory documents remain
attributed to their network operator; they are not presented as fork policies.

Expo updates are disabled unless `PLUMBLINES_UPDATES_URL` is provided. Configure
a fork signing certificate with `PLUMBLINES_UPDATES_CERTIFICATE`. Native release
setup also requires the fork's own Expo owner/project, Apple credentials,
Firebase configuration and push-service support. No native device build,
signing, store registration, or push-service registration is proven here.

## Workflow boundary

Upstream AWS deploy, native build and EAS update jobs have repository-identity
guards. The unguarded scheduled translation writer now also requires the
upstream repository identity. The Cactus preparation workflow is explicitly a
read-only dry run. Nothing in this change enables GitHub Actions, uploads a
release, installs credentials, or publishes to production. A future fork
release workflow needs explicit fork infrastructure configuration.

## Validation

Focused metrics tests: 8 passed, including the disabled-endpoint behavior.
Identity/browser title tests: 2 passed. Deep-link tests cover both the new scheme
and upstream parsing compatibility. Main integration owns the full typecheck,
web export and browser acceptance; native acceptance remains NOT RUN.

The React startup splash components on web and native also use `PLUMBLINE_PATH`; replacing HTML templates alone does not replace the transient React splash.
