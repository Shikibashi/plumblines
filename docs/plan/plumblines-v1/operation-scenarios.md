# Operation scenarios
## RBAC
| Role | Public reads | Own attention writes | New blocks/listblocks | Existing unblock |
|---|---|---|---|---|
| guest | existing | sign-in required | denied | sign-in required |
| member | existing | existing | denied | existing |
No backend role added. Existing server auth remains authoritative.
## Denial behavior
New block/listblock: creation menu absent; mutation throws local error; no request; no blocked optimistic shadow. Guest writes retain sign-in prompt.
## Menu journeys
Home/feed selector retain route and scroll behavior. Search opens existing results. Compose opens original composer. Profile and DM menus retain mute/report/unblock. Moderation list offers mute and existing unblock only. Settings opens existing moderation preferences. Provenance distinguishes active feed and unknown inputs.
