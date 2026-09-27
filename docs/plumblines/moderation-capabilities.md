# Moderation capabilities

Plumblines reads existing AT Protocol block state and can remove blocks created through other clients. Its account and list action interfaces do not expose block creation. This is a client product rule; it does not change AT Protocol, prevent another client from creating blocks, or override network interaction restrictions.

## Supported actions

| Action | Support |
|---|---|
| Create account or list blocks | No capability; defensive write rejection |
| Read existing block state | Preserved, including incoming and list blocks |
| Remove an existing account or list block | Supported |
| Mute/unmute accounts, reposts, lists, conversations | Supported |
| Hide posts, report content, delete/leave conversations | Preserved |
| Public blocked-content reader | Preserved; explicit read-only public requests |

## Composition and data flow

`useAccountActions(profile)` composes existing mute hooks and offers `unblock` only when the profile has a direct blocking URI. `useProfileUnblockMutationQueue` performs removal only, deduplicates overlapping calls, restores optimistic block state on failure, and refreshes block/feed/conversation caches after success. `useListUnblockMutation` accepts only a list URI, with no block/unblock boolean.

Profile, post, conversation and member menus use one `useUnblockAccountMenuItem` builder. It returns a direct `Menu.Item`, because native menu groups filter out wrapper components. Its shared confirmation dialog is rendered outside `Menu.Outer` so closing the menu cannot unmount the confirmation. List blocks retain the separate list-removal path. The settings route remains compatible and is presented as **Existing Blocks**.

Chat reporting has no block checkbox or queued block action. Deletion/leaving remains an explicit separate action. Request rejection has independent delete, report and conversation-mute controls. Public-reader query keys, account block-state reads, lexicons, composer/DM interaction checks and network error handling are preserved.

Authenticated PDS, AppView and chat clients share an Agent wrapper. After SDK serialization and before session authentication/network I/O, it inspects `createRecord`, `putRecord`, and each `applyWrites` entry for `app.bsky.graph.block` or `app.bsky.graph.listblock`. A mixed batch containing a forbidden write is rejected before any I/O. Direct deletes and deletion-only batches pass. The AppView/chat wrappers matter because SDK record helpers can target the PDS regardless of their default proxy service.

This guard covers the application's standard authenticated clients, not arbitrary third-party code or direct calls made outside Plumblines. It is not a server-side access-control boundary. No PDS or protocol schema changes are required.

## Reference and maintenance

The supplied comparison was checked against [Graysky's account-actions source](https://github.com/mozzius/graysky/blob/main/apps/expo/src/lib/account-actions.ts): it separates account operations, but still includes a block capability. Plumblines adopts the separation while omitting creation. The pasted assertions about other clients are not treated as verified facts or copied implementation requirements.

After upstream updates, run the block-policy hook suite, serialized client-write suite, native menu regression suite, all platform typechecks and browser suite. Keep block/listblock lexicons and existing-state reads. Never restore a toggle whose other branch creates a block.

## Verification boundaries

Transport tests use real SDK serialization with a controlled Agent transport. Menu tests execute the native Menu.Group filter with mocked presentation dependencies. These prove local behavior, not successful authenticated writes against a live account. Public-reader browser cases include real public content and deterministic blocked-profile fixtures. Exact deployment versions and run results are recorded separately in the deployment receipt.
