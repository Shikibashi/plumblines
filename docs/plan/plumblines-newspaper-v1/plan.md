# Newspaper v1 expansion

The latest attached brief extends the deployed blockless fork. Its final V1/V2 hierarchy controls scope. This plan builds on the completed original plan and removal-only capabilities; it does not restart them.

## Requirements

| ID | Contract | Implementation owner |
|---|---|---|
| N1 | Account-local persistent sections: Following, custom feeds, lists, latest searches; add/rename/reorder/remove, bounded to eight | Sections worker |
| N2 | Following uses getTimeline without Discover fallback or merged feeds; per-section reply/repost/quote filters preserve moderation | Sections worker |
| N3 | Responsive wide columns and narrow active section; manual refresh, paging, clear errors, keyboard navigation | Sections worker/main |
| N4 | Local account/topic snoozes expire, remain account scoped, and can be ended; network mutes/hide/bookmarks/unblock retained | Main |
| N5 | Post information exposes supplied identifiers, timestamps, feed/label provenance and interaction rules; declared PDS discovery validates DID | Records worker |
| N6 | Supplied custom records retain their type and JSON, static renderer registry, no new record fetching/publishing | Records worker |
| N7 | Reader mode and linear article presentation preserve original thread order, warnings, actions and pagination | Reading worker |
| N8 | Text-only PNG sharing includes complete text, author, time, canonical URL and branding; respects content moderation | Reading worker |
| N9 | PWA install metadata and correct root asset packaging; no offline record cache | Records worker |
| N10 | Existing public block readers and PDS no-block write boundary remain covered | Main |

## Boundaries

No new backend, protocol or dependency. Existing Docker PDS remains unchanged. V2 items (Editions, synchronized layout, annotations, folders, attention exceptions by section, alternate AppViews, publishing and custom-record profile tabs) are deferred as the brief requests. Existing web translation opens Google Translate; it is not advertised as in-client translation. Multi-account capability remains upstream; this phase adds no new account model.

## Execution and evidence

Zeus resumes the existing pipeline. Exclusive worker files are records, sections/query tuning, and reading/thread presentation. Main owns shared storage, menu/shell integration, ledger, tests and deployment. Package scripts run formatting, lint, platform types, complete Jest suite and web export. Docker serves the completed export. Minos uses declared deterministic fixtures plus real public routes at local, preview and production stages. No authenticated network mutation acceptance is inferred from fixture tests.

## Decisions

- [ZEUS-AUTO:taste] Local versioned account storage in v1; no custom repository writes. Reason: final brief defers synchronization. Reverse by adding an explicit opt-in persistence adapter later.
- [ZEUS-AUTO:taste] Maximum eight live sections, manual refresh and cursor paging. Reason: bounded requests and readable columns. Revisit with virtualization and measured load.
- [ZEUS-AUTO:mechanical] Keep supplied ordering and mark provider claims accurately; never invent ranking explanations.
- [ZEUS-AUTO:taste] Share explicit text-only cards rather than silently omitting media from a full-post image claim. Complete text may span several PNG pages.
- [ZEUS-AUTO:mechanical] Reuse existing branded PWA images byte-for-byte; no offline content claims.
- [ZEUS-AUTO:taste] Keyboard j/k/o and 1–8 cover section reading; existing global navigation/composer shortcuts stay. Mutation shortcuts are not added in this bounded tranche.

## Rollback

Current production bc9995ac-5efc-4616-a021-7815bb6677a3 is the rollback target. Build and preview verification precede the already-authorized production replacement.
