# Newspaper v1 verification

## Requirement trace

| Requirement | Current evidence |
|---|---|
| Sections and account-local persistence | validated versioned model; account/guest switch and subscriber regression tests; browser CRUD pending final run |
| Strict Following | real FollowingFeedAPI tests request getTimeline on initial/cursor fetch despite merge and fallback settings |
| Shape filters and thread gaps | FeedTuner reply/repost/quote matrix and root/gap/parent/reply rendering tests |
| Local attention | literal topic/account rules, expiry, corrupted values, capacity, profile exemption tests |
| Information and custom records | 26 parser/registry/DID/escaped-JSON unit checks; lazy no-credential discovery, supplied-only inspector |
| Reading and image moderation | complete text pagination, Unicode layout tests; 3 actual SDK moderation-boundary regressions |
| PWA | root manifest/icons packaged; Docker MIME correction; final HTTP test pending |
| Core compatibility | full suite 95 suites, 957 passed, 28 TODO, 21 snapshots; lint PASS; platform types PASS |

## Review corrections

Independent worker review found image generation ahead of moderation reveal and unsafe expiry dates. Both are corrected. CLI review found a missing required test fixture property and omitted thread-gap presentation; both are corrected. Review is single-model, not cross-model consensus. CLI log preserves the original failing findings; subsequent checks supersede their observed state.

## Evidence limits

Protocol tests use controlled fixtures where stated. Prior public blocked-profile/post regression checks continue to pass locally. No authenticated production mutation, native device run or OS-level PWA install prompt was exercised. In-app inspection of plumblines.uk was denied by the unavailable browser policy check; no workaround was attempted. Deployment metadata, local and preview checks must be reported separately.

Final browser and deployment evidence will be appended after execution.
