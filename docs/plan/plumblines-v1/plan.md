# Plumblines v1 implementation plan

## Strategy Decision
Scores are 1–5, higher is better.
| Candidate | Requirements | Domain fit | Low risk | Reversible | Effort | Total |
|---|---:|---:|---:|---:|---:|---:|
| Existing client + narrow fork composition layer | 5 | 5 | 4 | 5 | 4 | 23 |
| New standalone newspaper client | 3 | 2 | 2 | 3 | 1 | 11 |
| Global replacement / CSS-only skin | 2 | 3 | 2 | 2 | 5 | 14 |
Select narrow composition changes: preserves working protocol core and permits isolated tests. Standalone rewrite loses upstream behavior; global replacement misses behavioral policy and semantic provenance.

## Execution
0. Main verifies pristine upstream install/build before source edits and records any baseline failure separately.
1. section-01-brand, section-02-policy and section-03-newspaper can run independently after main assigns exclusive files. Identity strings in shell belong UI owner; canonical config belongs brand owner.
2. Main integrates and reviews diff, runs package-script formatting/typecheck/lint/tests/build, distinguishing upstream errors.
3. Argos checks all R1–R8 and flow branches; user-provided screenshot is visual target.
4. Docker module attempted by main; if unavailable use local dev server and record exact limitation.
5. Minos browser tests use real app routes; fixtures only where declared. Account writes require available user-authorized test context.
6. Report local and production outcomes separately. No automatic success from merely generating documentation.

## Scope and rollback
No new dependency expected for theme/policy. New icon dependency requires a demonstrated asset replacement need and verified permissive license. Roll back one section via scoped diff reversal; no bulk reset. Preserve protocol dependencies.

## Completion gates
Baseline build evidence; changed build; policy negative tests and unblock tests; no fabricated provenance; real browser desktop/mobile inspection; asset/telemetry scan; exact remaining release blockers. Plans are not evidence these gates passed.
