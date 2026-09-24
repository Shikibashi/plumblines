# Plumblines v1 specification
Existing: upstream social-app query/session/navigation core. Modify product configuration, web presentation and block-creation capability without changing protocol semantics.

## Problem Statement
| ID | Problem | Acceptance | Resolution section |
|---|---|---|---|
| P1 | Stock identity and collectors identify upstream | Fork identity and inactive upstream telemetry; asset audit explicit | section-01-brand |
| P2 | Stock web layout does not match reference | Newspaper masthead, paper/ink, rules, desktop columns, usable narrow view | section-03-newspaper |
| P3 | Block actions violate product policy | Direct/list creation rejected before network/shadow changes; removal preserved | section-02-policy |
| P4 | Feed algorithms opaque | Supplied vs verified vs unknown information distinguished | section-03-newspaper |

## Context Map
Goal: usable AT Protocol client with individual attention controls and newspaper identity.
| System | Responsibility | Related section |
|---|---|---|
| Web/native client | Existing routes and state, fork identity | 01,02,03 |
| PDS/AppView/feed generators | Existing remote protocol authority; no modifications | 02,03 integration only |
| Analytics/error collectors | Disable upstream sinks by default | 01 |
| Domain hosting | Deployment outside source proof; main records availability | main verification |

## Role Inventory
| ID | Actor | Permission |
|---|---|---|
| guest | Signed-out reader | Existing public reads and sign-in only |
| member | Signed-in account | Existing own-account actions except new blocks/listblocks |
No new application role or backend authorization layer.

## Requirements
R1 Central config provides name, public domain, safe support destination and explicit telemetry defaults.
R2 Original fork artwork and identity for shipped entry points; retain MIT and redistributable notices. Unreplaced restricted asset classes block release acceptance.
R3 Central capability disables initiating direct account blocks and blocking list subscriptions; retain unblocking, muting, word/thread filters, reporting and labels.
R4 Web masthead plus three-column desktop view matching supplied reference; responsive single-column small viewport. Current data remains real.
R5 Feed provenance must reflect active route/feed. Do not claim newest-first, counts, algorithm inputs or exclusions without evidence. Unknown provider inputs are clearly unknown.
R6 Preserve auth/session/protocol namespaces, native compatibility and query error/loading/empty behavior.
R7 Verify desktop and 390px viewport, keyboard focus, dark/dim contrast, reduced motion and real text rendering.
R8 Report baseline build, changed build/tests, browser evidence and live-account/production checks separately.

Out of scope: new backend, custom Lexicons, rankings, fabricated sample timeline, rewrites of auth or feed retrieval, native store publication. Deployment requires actual available configuration and separate acceptance.
