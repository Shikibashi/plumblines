# Plumblines artwork

`mark.svg` and `editorial.svg` are original geometric artwork, licensed under
this repository's MIT license. `raster-manifest.json` records every replacement
output path and its preserved dimensions. Theme variants change the paper/ink
colors, not the source geometry. Announcement artwork is deliberately generic
editorial ornament; it does not reproduce upstream commissioned illustrations.

`lucide/` contains the exact source SVGs for runtime glyphs at revision
`f06ac67e33d645c40b8ce19a0419c85c5d7dd751` from
https://github.com/lucide-icons/lucide. Retain `licenses/LUCIDE.txt` when shipping.
`icon-map.json` maps all 267 upstream export names to the replacement artwork.
Filled and outline API variants share an outline design; selected-state color
and accessibility behavior remain controlled by the existing components.

Regeneration (from the repository root):

- `python3 scripts/vendor-plumblines-icons.py /path/to/pinned-lucide-checkout`
- `python3 scripts/generate-plumblines-art.py` (requires Pillow, ImageMagick, and Liberation Serif)

The icon converter supports the SVG primitives found in the pinned source;
unknown primitives or missing semantic mappings fail before writing adapters.
Native SVG metadata remains available to menu image renderers.
