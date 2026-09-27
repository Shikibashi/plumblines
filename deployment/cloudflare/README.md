# Cloudflare Pages deployment

The existing Pages project is `plumbline`, with production branch `main`, Pages alias `plumbline-f50.pages.dev` and custom domain `plumblines.uk`. This is a direct-upload project; repository branch names do not themselves deploy it.

Build and verify the web client, then package that exact export:

```sh
pnpm build-web
python3 scripts/plumblines/prepare-pages.py
```

The script prints a new directory under `.cloudflare/`. It preserves the Expo `/static/` URL prefix, excludes source maps, writes security headers with hashes for the HTML's inline scripts, and saves a SHA-256 manifest alongside the directory. Pages supplies its standard SPA fallback because the artifact has no top-level `404.html`.

Use Wrangler 4.136.3 with the existing authenticated account. Run the CLI from outside the repository (or use `npx --prefix /tmp`) to keep npm from enforcing this pnpm project's runtime policy. Upload the printed directory to `--project-name plumbline --branch newspaper-preview` first. After checking the preview, upload the identical directory with `--branch main`. Set `--commit-hash` to the tested source commit. No DNS change is needed.

The public `client-metadata.json` from the previous deployment is retained verbatim as `legacy-client-metadata.json` to preserve the existing OAuth client identity. This does not add an OAuth flow to the new fork or prove that an old application's in-flight callback will work in it. Existing accounts/PDS data are not migrated by this client deployment.

The latest verified deployment (2026-09-27) is `2f3f09c1-e671-46d2-871a-089c356582df`, at `https://2f3f09c1.plumbline-f50.pages.dev`, from source commit `60aa118cc9554b094546c8b9a97171c588e206d1`; the custom domain is [`plumblines.uk`](https://plumblines.uk/). The preceding production deployment, available as the rollback target, is `402ccf74-21aa-44aa-be65-4f34ed91d2cd`, at `https://402ccf74.plumbline-f50.pages.dev`. Both IDs were recorded from Wrangler's live Pages deployment list after promotion. See the [compact rail deployment receipt](../../docs/zeus/compact-left-rail-deployment-2026-09-27.md) for artifact hashes and hosted verification.

The deployment receipt under `docs/zeus/` records uploaded versions, hash comparisons and actual hosted tests. Local/browser checks do not constitute credentialed account acceptance.

References: [Pages direct upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [SPA serving behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/), [rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/).
