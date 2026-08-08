# Pushing the tokens into Figma

Generated from tokens/source.mjs — do not hand-edit. Run: `node tokens/build.mjs`

Two ways in. Neither needs a paid Figma plan.

## A · Tokens Studio plugin — the easy one

1. Open the target Figma file.
2. Plugins → **Tokens Studio for Figma** (free).
3. Import `tokens/selr-tokens.studio.json`.
4. Push the three sets to Figma variables: `global`, `light`, `dark`.

No API access involved at any point.

## B · One paste — when the Figma API is reachable

Paste the whole of `tokens/figma-push.js` into a Figma plugin console (or hand it to
an AI tool that can run Figma Plugin API code) with **your own file open**. Idempotent:
re-running updates values in place.

| | |
|---|---|
| **Target file** | your own Figma file — open it first |
| **Expected variables** | **99** — 31 raw ramps, 42 semantic across 2 modes, 15 spacing, 11 radius |
| **Collections created** | `00 - Global` · `01 - Color Styles` · `02 - Spacing` · `03 - Corner Radius` |

The script returns `createdCount`, `updatedCount` and `expected`. First run:
`createdCount` equals `expected`. Re-run: `updatedCount` equals it.

## Fonts in Figma

The kit's web templates ship Manrope with them, so the HTML side needs no install.
Inside Figma, add the free **Manrope** Google Font to your file for matching type.
