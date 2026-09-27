# Layout Blueprint: Story Interiors and Reading Sheets

## Front-page dispatch package

```text
┌────────────────────────── configured paper region ─────────────────────────┐
│ DISPATCH · section/source label                                             │
│ Byline: actual display name / @handle · source timestamp                    │
│ Exact post text, with lead/feature/brief measure                            │
│ Optional image/video or external embed, preserving moderation and alt text  │
│ Repost / reply annotation; quoted record inset as clipping                  │
│ Reply · Repost · Like · Save · Share · More (quiet, accessible controls)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

Only a minimal data attribute is added at the upstream feed integration seam. Plumblines owns the editorial styles and wrapper; the upstream renderer continues to own content safety and protocol actions.

## Reading section front

Desktop uses one asymmetric 12-column story grid. The first source-ordered entry spans seven columns and two rows; the next two form a five-column rail; later entries fill two-column rows. The component displays actual titles, publication/source, date, and labels. Selecting an article replaces the grid with its article sheet; selection is not held in a side inspector.

```text
READING / LONG-FORM
Source: Standard Reader public index · service order

┌─────────────────────────────────┬──────────────────────┐
│ Article 1: actual title         │ Article 2            │
│ source · date · labels          ├──────────────────────┤
│ actual description              │ Article 3            │
├────────────────────────┬────────┴──────────────────────┤
│ Article 4               │ Article 5                     │
└────────────────────────┴───────────────────────────────┘
```

Phone changes this to one ordered column. Article state includes a visible “Back to Reading” action, actual metadata, optional cover, and one ~60ch body.

## Utility and edit furniture

Reader display and authentication remain at the top edge in small, typographic actions. `Edit edition` and `Manage sections` are visibly secondary to section names. Edit controls appear only while their disclosure is open. No muting control enters the front-page UI.

## Story anatomy

| Element | Position | Treatment | Integrity/accessibility |
|---|---|---|---|
| Repost reason | Before byline | Small editorial attribution line | Keep explicit “Reposted by” meaning |
| Author/time | Byline | Compact sans-serif identity/time | Actual profile link, timestamp and labels |
| Post body | Main measure | Serif; scale by package | Exact rich text, links and text expansion |
| Reply context | Before body | Small “Replied to” annotation | Preserve blocked/missing-parent states |
| Quote post | Beneath body | Left-ruled clipping | Keep moderation, identity and source content |
| Media | After body | Visual package or in-line gallery | Existing embed controls, warnings, alt text |
| Actions | End of dispatch | Quiet labels/icons | Existing names, hit area and action behavior |
