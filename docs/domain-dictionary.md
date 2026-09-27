# Domain Dictionary — v3, 2026-09-23
Canonical project dictionary, authorized by lead; all planning documents consume these v3 terms.
| Term | Korean | Definition | Mapping |
|---|---|---|---|
| Member | 회원 | Current authenticated account | useSession |
| Guest | 비로그인 사용자 | No current account | hasSession false |
| Block creation | 차단 생성 | New direct account block record | app.bsky.graph.block create |
| Blocking subscription | 차단 목록 구독 | Subscribe to block actors from a list | blockActorList / listblock |
| Unblock | 차단 해제 | Remove existing account/list blocking state | delete block / unblockActorList |
| Mute | 뮤트 | Existing attention filtering, distinct from block | mute actor/list calls |
| Feed provenance | 피드 출처 | Feed source and known/declared/unknown behavior | active feed metadata |
| Fork identity | 포크 정체성 | Plumblines branding distinct from upstream | fork config |
Do not call mute “block”; do not call provider-supplied inputs “verified”. Existing network restrictions remain distinct from client-initiated writes.
