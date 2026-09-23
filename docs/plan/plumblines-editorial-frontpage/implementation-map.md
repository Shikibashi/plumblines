# Audit and implementation map

Audit date: 2026-09-23. Repository: `/var/home/tcs/Code/plumblines`, branch `codex/plumblines-v1`. The implementation began from the existing branch and retained the upstream baseline on `main` and `develop`.

## Before the redesign

- `src/plumblines/NewspaperHome.tsx` mounted the web Home experience and enabled the full front-page masthead.
- `src/plumblines/sections/index.tsx` owned configurable Following/feed/list/search sections and queried them through the existing feed and search hooks. All were rendered as equal bordered boxes, controls/source descriptions competed with stories, and feed bodies used local scrolling in the desktop branch.
- `src/plumblines/sections/model.ts` owned account-local source definitions, source validation, section order and filter behavior.
- Every social story delegated to upstream `PostFeedItem`/`Post` and `ViewFullThread`, preserving actions, labels, moderation, reply gaps and source objects.
- `src/components/Post/Embed/StandardSiteEmbed/`, the external-view lexicon and link metadata resolver already displayed genuine Standard.site title/deck/publication fields inside social posts. There was no long-form Reading index or dedicated article reader.
- `src/style.css` defined a full-height fixed masthead (184px wide, 148px midsize, 88px phone) and shell offsets. The Home branch already removed the right context rail.
- Existing storage in `src/plumblines/local-preferences.ts`, local snooze/attention, social Thread/Article mode, generic record inspector, PWA and a serialized PDS write guard were reused.

## What is now wired

- `src/plumblines/frontpage/model.ts` owns a pure, deterministic composition model; its tests assert source/item preservation, explicit reader-selected lead, stable slot order, templates and numbered sheets. The selected lead moves to the first page position; its source order remains unchanged.
- `src/plumblines/sections/index.tsx` consumes the composition for all configured section fronts. It uses the existing query hooks and rendering components, moves per-section controls into settings, labels provenance disclosures, adds page anchors/folios and removes the nested scroller. The first dispatch, next three briefs and first secondary feature receive distinct type treatments. An actual image affects presentation without changing rank.
- `src/plumblines/reading/standard/` owns strict public API parsing, latest-index pagination, click-to-fetch article reading, safe links/media and `@standard-reader/renderer-react` integration. The renderer normalizes supported document formats. Native receives an explicit empty stub; social `StandardSiteEmbed` remains intact.
- `src/plumblines/NewspaperHome.tsx` adds a compact reading-tools toolbar and retains local attention/preferences. `src/storage/schema.ts` adds only the account-local preference key needed for front-page layout.
- `src/style.css` gives interior routes a compact masthead and front page a responsive masthead, paper/surface, narrow utility rail, section rail, editorial grid, mobile single column, dark/dim paper and visible focus rules. `src/view/screens/Home.tsx` and the Standard.site embed internals were not changed.
- `tests/plumblines/newspaper.spec.ts` adds browser checks for one-document scrolling, Reading navigation and template changes. Policy tests assert block and list-block creates/puts/batch writes are rejected while deletion is allowed.

## Reused / upstream touch surface

| Surface | Ownership | Role |
|---|---|---|
| `src/plumblines/frontpage/`, `src/plumblines/reading/standard/` | Plumblines | Layout model, public Reading adapter and article presentation |
| `src/plumblines/sections/`, `NewspaperHome.tsx` | Plumblines | Configurable source flows, front-page integration, user controls |
| `PostFeedItem`, `Post`, `ViewFullThread`, existing feed/search hooks | Upstream reused | Post actions, thread relationships, queries, moderation and labels |
| `StandardSiteEmbed`, resolver, external-view metadata | Upstream reused | Standard.site cards embedded in social posts |
| `src/style.css`, `src/storage/schema.ts` | Shared upstream files, narrow additions | Global shell styling/offsets and typed local account-storage key |
| `src/view/screens/Home.tsx` | Upstream integration already present | Web Home route remains the mount point; untouched in this redesign |

The diff is intentionally concentrated in Plumblines-owned components. The shared CSS and account-schema edits are the unavoidable merge-conflict surface; no upstream query/protocol/moderation implementation was rewritten.

## Invariants retained

- `main`/`develop` remain the upstream baseline; all work is on `codex/plumblines-v1`.
- No PDS, AppView, Relay, deployment or upstream baseline changes were part of the local UI implementation.
- No social post headline/dateline, engagement score, proprietary lexicon or article body is synthesized.
- Block state is read/respected and existing blocks can be deleted. Block/listblock creation stays unavailable and is rejected before network I/O.
- Following/search/custom-source query behavior, moderation, labels, authored source data and feed order are preserved.

## Not claimed complete

- Standard Reader publication search/follows/bookmarks/read-state, private/indexed discovery, personalized ranking, offline caching and article publishing.
- Article share-as-image for Standard documents or full rendered media reproduction in current post image cards.
- Keyboard previous/next sheet shortcuts, a persistent visual page navigator, native tablet spread and full reading-edit layout controls for per-section width/placement.
- Authenticated real-account acceptance, production promotion, and deployment verification; local build/browser acceptance must precede any release claim.
