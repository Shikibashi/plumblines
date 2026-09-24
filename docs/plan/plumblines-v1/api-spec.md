# API contracts
No new endpoint, auth scope or Lexicon.
| Operation | Role | Caller | Policy |
|---|---|---|---|
| Existing public feed/profile reads | guest, member | existing query hooks | unchanged |
| Create app.bsky.graph.block | member | profile.ts block mutation | deny before write |
| blockActorList | member | list.ts block=true | deny before call |
| Delete existing block | member | profile.ts unblock mutation | existing behavior |
| unblockActorList | member | list.ts block=false | existing behavior |
| Mute/report/label preferences | member | existing query hooks/dialogs | unchanged |
Errors: new forbidden operations return local policy error; do not issue request or optimistically mark blocked. Existing network failure handling remains.
Provenance consumes actual active feed identity/metadata. No API returns universal verified algorithm inputs; omit claims or label unknown.
