# Reading Plumblines as a newspaper

The Home screen is a composed newspaper page: a flowing masthead, compact section rail, lead and dispatch packages, secondary fronts, folio marks and a separate Reading sheet inside one normal document scroll. Configured sections are sources; page regions are presentation packages. Social posts remain the author’s exact dispatch text; the UI never invents a headline or dateline.

## Front page

The web masthead is large in normal document flow on the front page and compacts to a short fixed nameplate on interior routes. The section rail selects the Front Page, an individual configured section front, or Reading. **Edit edition** sets the lead section and one of three local templates: **Broadsheet**, **Compact**, or **Reading**. These preferences stay on the device in the current account/guest scope; no new AT Protocol records are written.

The configured lead source provides the lead dispatch and the separate Dispatches rail, which shows its next three timeline items. The lead can be changed in **Edit edition**; if no lead is stored yet, the first configured source supplies it. The next two configured sources fill the secondary-left and secondary-right fronts. Remaining configured sections stay available in the rail and open one at a time; they do not become extra columns. An actual image can change the visual treatment to **Visual** without changing item order or source data. The page does not score or silently infer importance. The front page and long-form index are distinct sheets in one document scroll. The Reading index follows as the next sheet.

Section settings hold reply/repost/quote filters and source details. Feed queries, moderation, hidden-post filtering, incomplete-thread context, refresh and cursor pagination continue through the existing social-app query components. Refresh is a compact, labeled icon rather than a full-width control ahead of every section. Following uses actual timeline semantics without a Discover merge. Custom feed/list source order is attributed to its provider; saved searches use the supported latest-results query and disclose its limits.

The main page has no nested section scrollbars. On phones the front-page regions flatten to one column, with section labels, editorial rules and at least 44px section controls retained. A slim desktop utility rail preserves the established app navigation.

## Reading long-form work

The **Reading** sheet reads the public Standard Reader latest-document index in newest-first order. Article bodies are fetched only after selection. Article title, deck, author/publication, published date, labels, cover and reading time appear only when supplied. Supported Standard.site and compatible document formats are rendered with the open `@standard-reader/renderer-react` component package; unsupported formats and missing bodies receive explicit fallbacks. External destinations are URL-validated and opened with safe link attributes. The source/index order is shown as such; it is not personalized or ranked by Plumblines.

This first public Reading surface is a latest-document index. Publication search, reader follows/bookmarks/read state, discovery ranking, offline article caching and article publishing remain future work. The normal Bluesky `StandardSiteEmbed` continues to handle document links inside posts. The social Thread/Article reader continues to use loaded posts and existing moderation/interactions.

## Sections and attention

Use **Manage sections** to add Following, a custom feed, a list or a saved search, then rename, reorder or remove them. Up to eight are supported. These section source settings and the front-page template are local to the device/account. Keyboard shortcuts: **j/k** move between stories, **o** opens the focused story, **1–8** select configured sections; shortcuts pause in editable controls, menus and dialogs.

**Local attention** provides temporary account/topic/item snoozing without publishing a social-graph relationship. Network account/list mutes, hide, report, labels and removal of existing blocks remain separate capabilities. Plumblines never creates account or list blocks; the authenticated PDS write guard and moderation details are documented in [moderation-capabilities.md](moderation-capabilities.md).

Reader mode reduces avatar decoration and numeric engagement counts while retaining actions, provenance and moderation warnings. Article mode presents the loaded social thread as a linear discussion; it does not rewrite a conversation as a single author’s prose. Post information and record inspection show supplied identifiers and provenance without inventing unavailable facts.

## Implementation and verification

- Compositor and local preferences: `src/plumblines/frontpage/model.ts` and `src/plumblines/local-preferences.ts`.
- Front-page and source/query integration: `src/plumblines/sections/` and `src/plumblines/NewspaperHome.tsx`.
- Standard Reader index, fetch validation and rendering: `src/plumblines/reading/standard/`.
- Shared shell and responsive/editorial type: `src/style.css` and the owned masthead component; the only unavoidable shared shell additions are data-driven offsets, visual tokens and the new local storage key in `src/storage/schema.ts`.
- Design decisions, audit and QA cases: [editorial front-page plan](../plan/plumblines-editorial-frontpage/).

Verify web and native typechecks, focused tests, lint, web export, and browser screenshots at wide, laptop/tablet and phone widths in light, dim and dark themes. Browser/API requests are read-only; a local export or screenshot does not establish production deployment or authenticated-account acceptance. The main reference direction is the *Liberty* newspaper grammar; its history is not imitated as tiny print or fabricated issue data.
