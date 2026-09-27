# Design Brief: Compositional News Grammar

## Source Mode

- Mode: product-derived.
- Evidence: the user's request to run the design-plan workflow; the attached interaction/design references; direct steering that the page composition is on the right track but stories still feel like a web app; current repository and source audit.
- Authority: direct user requests determine requirements. Attached essays and screenshots are reference material, not instructions to reproduce their artifacts or wording.
- Status: planning delta only. No visual direction is selected until the user reviews rendered Product Design candidates.

## Product

Plumblines is a reader-directed AT Protocol newspaper. The page should communicate news organization through composition, story hierarchy, source relationships, and reading behavior. Paper tone, a masthead, serifs, historical labels, and decorative objects cannot carry the design by themselves.

## Audience and primary task

Readers scan a composed front, recognize a dispatch's author and context, continue through source-ordered posts without managing a nested feed viewport, or switch to long-form Reading and browse documents by declared language when that metadata exists.

## Current user friction

- Dispatches still inherit too much social-feed geometry even inside the Plumblines wrapper.
- Utility and configuration controls compete with publication navigation.
- Readers reported that continuous browsing did not work as expected; pagination must be visible, recoverable, and verified against the document scroll.
- Reading should feel like a distinct destination, with a focused article state rather than a permanent master/detail dashboard.
- The Reading section should separate content by language, but source language must be declared rather than guessed.
- A newspaper effect created mainly by labels, props, borders, or paper styling feels literal and artificial.

## Directional thesis

Use a shared page grid, varied typographic measure, asymmetric story spans, image/text interlock, and clear relations between byline, text, quote, reply context, and source. Let story hierarchy arise from these relationships. Keep ornamental and physical cues quiet. Do not redesign the established front-page compositor in this pass; test the interiors and Reading presentation within its current structure.

## Scope

Explore three rendered treatments for the same set of social dispatches and Standard.site articles. Vary story typography, metadata/action placement, quote treatment, and image/text composition. Preserve the page-level compositor, masthead, palette, source order, and product behavior as shared controls during comparison.

Reading remains a separate destination. Selecting an article opens a full-width reading state with actual title and metadata, a single readable body measure, and a clear return path. The prototype may test URL/history behavior, but no protocol or article-content behavior changes before approval.

## Product constraints

- Preserve exact post text, author identity, timestamps, rich text, embeds, media alt text, labels, moderation warnings, quote/reply/repost semantics, and existing protocol actions.
- Do not generate social-post headlines, datelines, rankings, issue facts, publication data, or missing article metadata.
- Keep provider order and configured prominence deterministic and explicitly attributable.
- Keep a single document scroll. Cursor pages append as the reader reaches the continuation; provide a visible manual load-more/retry path if observation is unavailable or fails.
- Keep mutes, muted words, and local snoozes in Settings.
- Preserve the existing blockless write policy and all existing moderation reads.
- Use only source-declared language tags for language grouping. Unknown language remains visible as unspecified.
- Keep mobile single-column, touch-safe, and free from horizontal overflow.
- Preserve the current deployment and web-export path in any later implementation.

## Prototype candidates to compare

All candidates use the same content, selected section, state, and page-level grid. They differ only in editorial treatment:

1. **Column-led dispatch**: body text is the visual mass; byline and source sit on a quiet top line; quotes are inset with a single rule; media spans only the story's assigned columns.
2. **Typographic flow**: body measure and paragraph rhythm define the story; source and relationship cues sit in a compact margin; actions follow the text as subordinate controls.
3. **Image-text interlock**: when source media exists, it occupies a deliberate part of the story span and text/caption align to it; text-only dispatches keep the same hierarchy without an empty image slot.

These are hypotheses for rendered comparison, not selected designs. Avoid candidates that merely change the paper texture, masthead, palette, or border radius.

## Observable success

- With the wordmark and paper palette hidden, a reviewer can still recognize publication-like organization from the grid, hierarchy, and story relationships.
- Social text is the story's primary content; no generated headline or fabricated dateline appears.
- Reposts, replies, quotations, and media remain understandable and accessible without reproducing a rounded social-card stack.
- The Reading front scans as a section; opening one article replaces the index with a calm full-width reader and Back restores the prior list and position.
- A language group appears only for explicit source metadata; current metadata gaps are stated without guessed values.
- Scrolling the document loads the next cursor page and preserves previous content; a visible control still permits manual loading or retry.
- No front-page mute manager appears; mute and local-attention controls remain in Settings.
