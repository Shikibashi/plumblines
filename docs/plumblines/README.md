# Plumblines

An independent AT Protocol client built from `bluesky-social/social-app`, with a newspaper web interface. This is a client fork: it uses the existing account, PDS, AppView, feed, moderation and chat protocols.

Fork: https://github.com/Shikibashi/plumblines

## Develop and verify

Use the Node and pnpm versions declared by `package.json`. The initial local verification used Node 26.8.2 and pnpm 12.4.2; pnpm warns that the repository prefers 11.23.0.

```sh
pnpm install --frozen-lockfile
pnpm web
pnpm lint
pnpm typecheck
pnpm test --runInBand
pnpm build-web
pnpm preview:plumblines
# In another terminal, with Chromium installed:
pnpm exec playwright install chromium
pnpm test:plumblines:e2e
```

`build-web` regenerates and compiles translation catalogs before exporting. Omitting extraction can render new messages as opaque IDs in production. Generated translation modules and exported bundles are ignored; catalog sources are versioned. New fork strings in other languages currently fall back to their English source and still require translation review.

The preview binds to `127.0.0.1:8137`. It maps the export's `/static/` prefix and serves application routes with an SPA fallback. Public-feed browser tests perform actual read-only requests to AT Protocol services and require network access. Mutation tests use mocked agents and do not prove authenticated server behavior.

## Container

```sh
./scripts/plumblines/build-container.sh
docker compose -p plumblines -f docker-images/docker-compose.yml up -d
# http://127.0.0.1:8139
curl http://127.0.0.1:8139/healthz
```

The build script creates the Expo export on the host, then packages it in a digest-pinned, non-root nginx image. It is intentionally an artifact container, not a claim that the application was compiled in Docker. The runtime has a read-only filesystem, a temporary `/tmp`, no Linux capabilities and no new privileges. `PLUMBLINES_PORT` changes the local port. There is no new database or server API. The upstream Go server and its Dockerfile remain available separately; this static preview does not provide its server-rendered link previews.

Deployment to `plumblines.uk`, TLS, native signing/push credentials and authenticated account acceptance are separate release work. A domain in the product configuration is not evidence that the domain serves this build.

## Product contracts

- `src/plumblines/identity.json` centralizes identity. See [branding.md](branding.md) for asset provenance and telemetry configuration.
- `src/plumblines/policy.ts` disables new account/list blocks before optimistic state and network calls. Existing block deletion, mutes, reporting, labels and interaction controls remain. The client cannot override blocks enforced by network services.
- `src/plumblines/feed-context.ts` derives provenance from the current Home selection and loaded preferences. Mixed feeds, potential Discover fallback and unknown provider inputs are disclosed; the panel does not invent chronological ordering.
- `DESIGN.md` records the supplied newspaper direction. The interface displays real user content; it does not seed the fictional people/counts in the reference image.

## Upstream synchronization

`upstream` points to `https://github.com/bluesky-social/social-app.git`. The original `develop` baseline is `16af73133eee1ef145b6146ad1ad07fefe88822e`, recorded by `plumblines-baseline`. Fork work is on `codex/plumblines-v1` for review. Fetch upstream into its remote-tracking branches and review changes on a separate integration branch before merging. Re-run block guards, telemetry/asset checks, translation generation and browser tests after each synchronization.

See [the verification report](../plan/plumblines-v1/verify-report.md) and [Zeus report](../zeus/zeus-report.md) for measured results and release gaps.
