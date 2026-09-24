# Newspaper v1 verification

## Requirement trace

| Requirement | Current evidence |
|---|---|
| Sections and account-local persistence | validated versioned model; account/guest switch and subscriber regression tests; browser CRUD at 390/1040/1586px PASS |
| Strict Following | real FollowingFeedAPI tests request getTimeline on initial/cursor fetch despite merge and fallback settings |
| Shape filters and thread gaps | FeedTuner reply/repost/quote matrix and root/gap/parent/reply rendering tests |
| Local attention | literal topic/account rules, expiry, corrupted values, capacity, profile exemption tests |
| Information and custom records | 26 parser/registry/DID/escaped-JSON unit checks; lazy no-credential discovery, supplied-only inspector |
| Reading and image moderation | complete text pagination, Unicode layout tests; 3 actual SDK moderation-boundary regressions |
| PWA | root manifest/icons packaged; Docker MIME correction; local HTTP MIME/dimensions checks PASS |
| Core compatibility | full suite 95 suites, 957 passed, 28 TODO, 21 snapshots; lint PASS; platform types PASS |

## Review corrections

Independent worker review found image generation ahead of moderation reveal and unsafe expiry dates. Both are corrected. CLI review found a missing required test fixture property and omitted thread-gap presentation; both are corrected. Review is single-model, not cross-model consensus. CLI log preserves the original failing findings; subsequent checks supersede their observed state.

## Evidence limits

Protocol tests use controlled fixtures where stated. Prior public blocked-profile/post regression checks continue to pass locally. No authenticated production mutation, native device run or OS-level PWA install prompt was exercised. In-app inspection of plumblines.uk was denied by the unavailable browser policy check; no workaround was attempted. Deployment metadata, local and preview checks must be reported separately.

## Final candidate local execution

- `pnpm test:plumblines:e2e` against Docker at `http://127.0.0.1:8139`: **38/38 PASS**, 1.3 minutes. Includes all 28 previous UI/public-reading regressions, PWA HTTP checks and nine expanded-v1 cases. Evidence: `evidence/newspaper-v1-browser-local.{log,json}`.
- A failed intermediate test counted warning/close SVG icons as post images. The final assertion targets the named post-card preview and the actual `Account Muted` reveal button; no forced clicks, content bypass or application weakening was used.
- The final dialog portal sits above the fixed masthead; real close/reveal/download interactions pass. Earlier masthead-only z-index correction was insufficient and superseded.
- `pnpm lint`, `pnpm prettier`, `pnpm typecheck`, `pnpm test --runInBand`, optimized web export and Docker packaging pass; exact invoked scripts and output remain in `evidence/newspaper-v1-*.log`.
- Packaged artifact has 389 files matching its manifest; 12 selected JS/CSS/PWA resources served by Docker match the artifact. Cloudflare preview passes all 38 checks (1.6 minutes). Production identifiers and evidence boundaries are recorded in the [deployment receipt](newspaper-v1-deployment-2026-09-23.md).


## Preview acceptance

`https://b653ba13.plumbline-f50.pages.dev` passes **38/38** browser checks against the same packaged artifact. Evidence: `evidence/newspaper-v1-browser-preview.{log,json}`. Desktop/mobile screenshots were inspected; the two-column and active-section layouts fit their respective viewports. The suite includes real public blocked-post recovery plus deterministic public-profile, section, moderation and information fixtures. It does not constitute authenticated account acceptance.

A separate Python asset-integrity request returned Cloudflare HTTP 403 / error 1010. Preview browser loading and checks passed without changing security settings; remote byte-for-byte hash verification remains NOT VERIFIED.
