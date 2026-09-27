# Benchmark Notes: Compositional News Grammar

## Purpose

The references below inform composition and interaction only. They are not templates to copy. The current question is how to make stories and Reading feel editorial without adding literal historical props.

## Liberty archive: historical composition

The early Liberty scan shows a strong nameplate and folio furniture above a dense multi-column field, with variable story lengths and a few interruptions to the text. Later pages use running headers and folios while returning long prose to a readable continuous measure. Useful principles are column rhythm, scale contrast, and a stable place on the page. Do not copy political content, exact labels, tiny type, volume/issue conventions, or nineteenth-century density.

- IAPSOP archive: https://iapsop.com/archive/materials/liberty/index.html
- Libertarian Labyrinth scan archive: https://www.libertarian-labyrinth.org/periodicals/liberty-1881-1908/

## BBC News: contemporary section and format architecture

The BBC's own help page distinguishes its homepage mix from deeper section pages and calls out both subject sections and formats such as Video and Live. This supports clear destinations and recognizable content types. It does not authorize editorial ranking in Plumblines: BBC editorial curation and Plumblines reader-selected source order are different product systems.

- BBC content and sections: https://help.bbc.com/hc/en-us/articles/39027623773331-What-types-of-news-content-will-be-available

## Not Boring Camera: interaction reference, not visual style

The attached camera reference and official App Store description emphasize controls whose physical-feeling interaction maps to a real task. Adapt that principle only where Plumblines has a meaningful action, such as arranging a section or clipping a story. Avoid its 3D camera simulation, dynamic lighting, sound, haptics, colorful skins, and decorative physical-control metaphors; they would distract from reading and cannot improve comprehension here.

- Official App Store description: https://apps.apple.com/us/app/not-boring-camera/id6737783441?platform=ipad
- User-supplied video/screenshot reference: see the original attachment in this task.

## Research informing the design

- Golovchinsky and Chignell describe newspapers as suited to multiple short, loosely related items and report better performance when more articles are visible simultaneously in one exploration task. Use that to justify simultaneous browse visibility, not multiple independent scrollports. https://doi.org/10.1016/S0306-4573(97)00024-1
- Vaughan and Dillon found better comprehension, usability, and navigation for a web newspaper that followed familiar news-genre structure in their study with novice readers. Use recognizable section/story relationships, not a literal print replica. https://doi.org/10.1016/j.ijhcs.2005.11.002
- Stroud, Curry, and Peacock compared contemporary grid layouts with classic text-heavy hierarchy across three experiments. Their results support testing a modern modular grid, while avoiding a claim that one layout is universally superior. https://doi.org/10.1080/17512786.2020.1836997
- Hou, Rashid, and Lee found page-equivalent digital presentation closer to print than a spatially disrupted view in one lab study; stable spatial cues matter more to this plan than paper texture. https://doi.org/10.1016/j.chb.2016.10.014
- Dyson and Haselgrove found medium line length useful in their screen-reading experiment; use a flexible measure near 55–65 characters for sustained article prose, not a rigid threshold. https://doi.org/10.1006/ijhc.2001.0458
- Dyson and Kipping did not find a general reading-rate advantage for three columns; multi-column browsing and narrow-column long-form prose are separate decisions. https://doi.org/10.1016/S0097-8493(97)00048-4

## AT Protocol language metadata

The official Bluesky post lexicon includes `langs`, a list of language tags for the primary post text. The current Standard.site document lexicon does not define a language field among its required or optional properties, and the current Plumblines Standard Reader adapter does not parse one. Therefore Reading language grouping is available only when an index or document renderer supplies a declared language tag; until then, content belongs under an explicit “Language not supplied” state. Never infer language from article text or browser locale.

- Bluesky post lexicon: https://github.com/bluesky-social/atproto/blob/main/lexicons/app/bsky/feed/post.json
- Standard.site document lexicon: https://standard.site/docs/lexicons/document

## Adopt / Adapt / Avoid

### Adopt

- Shared grid and meaningful differences in story span.
- Visible source and authorship cues before engagement counts.
- Stable spatial relations and a distinct article-reading state.
- Direct-manipulation controls only when they correspond to a user-chosen operation.

### Adapt

- Newspaper column logic becomes a responsive web grid; long-form reading remains a single measure.
- Camera-style tactile feedback becomes ordinary, accessible control feedback with no simulated sound or hardware.
- Language filtering uses explicit protocol/index metadata and keeps an unspecified group.

### Avoid

- Historical labels or object props used only to signal “newspaper.”
- Distressed textures, fake print defects, page-curl effects, novelty sounds, or 3D paper simulation.
- Hidden ranking, generated social headlines, inferred language, or metadata invented by Plumblines.
- Recreating a social-media action bar or nesting independent feed scroll areas.
