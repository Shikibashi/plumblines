# Reading your newspaper

The web front page contains sections. Use **Manage sections** to add Following, a custom feed, a list, or a saved search, then rename, reorder or remove them. Feed/list sources accept a matching AT URI or a Bluesky/Plumblines link. Up to eight sections are saved on this device for the current account; signed-out settings have a separate guest scope. Layout synchronization is not included.

At wide desktop sizes, sections appear in two columns. On smaller screens, select a section tab. Each section has its own replies, reposts and quotes filters, refresh button and cursor pagination. Search returns latest results and does not provide repost attribution. Following uses the account timeline directly, without merged feeds or automatic Discover fallback. Signed-out Following and searches ask for sign-in; public feeds and lists can be added explicitly.

Keyboard shortcuts while reading: **j/k** move story focus, **o** opens the focused thread, **1–8** selects a section. Shortcuts pause in text fields, menus and dialogs. Existing global navigation and composer shortcuts remain.

**Local attention** manages temporary account and literal word/phrase snoozes. Account snoozes are also available from profile and post menus for 24 hours or seven days. Topic snoozes last seven days. Expired rules stop filtering automatically (within 30 seconds for an already-open view). Snoozes affect local feed presentation; they do not publish blocks or modify network preferences. Deliberately opening a profile keeps its posts available. Existing network mute, word/tag filters, repost mute, hide, reporting, bookmarks and removal of existing blocks remain available.

**Reader mode** reduces avatar decoration and numeric engagement counts while retaining actions and warnings. A thread also has **Article mode**, a linear presentation of the same loaded thread and replies. Sorting, pagination and moderation still belong to the original thread components. Translation on web uses the existing Google Translate link.

A post's menu offers **Post information**: supplied record URI/CID, author DID, timestamps, source context where available, label sources, and supplied reply/quote rules. PDS information is a declaration from the matching public DID document, not an independent audit. Unknown metadata stays unknown. **Inspect record** shows literal supplied JSON. Unknown custom record embeds use the generic inspector; this feature neither crawls repositories nor publishes custom records.

**Share as image** creates a preview and downloadable PNG of post text with attribution, date, canonical URL and Plumblines credit. It is explicitly a text-only card; embedded media is not reproduced. Long text spans multiple images. Content warnings must be revealed before image generation, and non-overridable warnings remain enforced.

The web manifest supplies app identity, standalone launch scope and branded icons for browsers that support installing web apps. There is no offline post cache or offline Editions feature in v1.

Implementation: `src/plumblines/{sections,reading,records}` with shared account-local storage/attention modules. Existing social-app authentication and protocol clients remain the integration boundary. Tests distinguish mocked protocol fixtures from real public access; authenticated account operations and OS installation prompts require separate acceptance.
