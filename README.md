# Screen Design Kit

Every screen your business needs — dashboard, data table, settings, login, sign-up,
landing page, pricing, navigation — plus 65 charts, 110 icons, every form control and
overlay. All as **working HTML files, not pictures**. Light and dark mode built in.
Made by Selr AI.

## Install (60 seconds)

Put this folder where Claude can see it as a skill:

```bash
git clone <this-repo-url> ~/.claude/skills/screen-design-kit
```

(Or download the ZIP and unzip it to the same place. For a single project, use
`<your-project>/.claude/skills/screen-design-kit` instead.)

Then just ask Claude: **"build me a dashboard for my business"** — the skill does
the rest. You never touch the code unless you want to.

## See everything first

```bash
open templates/index.html
```

(`open` on macOS; `start` on Windows; `xdg-open` on Linux — or double-click the file.)

That's the gallery. Every template renders live; click one to open it full size.
No build step, no install, no server, no internet, no Figma account.

## What's in the box

| | |
|---|---|
| **8 full screens** | dashboard · data table · settings · login · sign-up · landing · pricing · navigation |
| **65 charts** | one engine, pure SVG, no dependencies |
| **16 table patterns** | basic → sortable, grouped, sticky, editable, empty, mobile |
| **110 icons** | line and solid, click to copy |
| **Every form control** | inputs and states, select, tags, upload, date picker, wizard |
| **Overlays** | modal · confirm · drawer · sheet · toasts · alerts · banners · menus · loading |
| **9 page patterns** | board · timeline · notifications · calendar · search · 404 and 500 · onboarding · profile · comments |

## Start a new screen

1. Copy the closest template out of `templates/`.
2. Take `tokens.css`, `base.css`, `mode.js`, the `fonts/` folder and, if you use
   them, `charts.js` and `icons.js`.
3. Change the content. Don't change the primitives.

**A raw hex colour in a template is a bug.** Everything is a variable, so a theme
change is one file and dark mode comes free.

## Make it your brand

Swap the colour values at the top of `templates/tokens.css` for your own — every
screen, chart and component updates at once, both modes. Or just tell Claude:
"retheme the kit to my brand colours."

## Type

Manrope ships with the kit — `templates/fonts/`, a 24KB variable font under the
SIL Open Font License (`fonts/OFL.txt`). No font install needed; every machine
renders the same.

## Optional extras (skip unless you want them)

Everything below needs **Node 18** or newer — no packages, built-in modules only.

```bash
node tokens/build.mjs      # regenerate the design-token exports
node scripts/verify.mjs    # the quality gate — 100+ automated checks
```

The build writes Figma-ready token exports, **only useful if your team already
designs in Figma** (the kit itself never needs Figma):

| File | Use it with |
|---|---|
| `tokens/selr-tokens.studio.json` | **Tokens Studio for Figma** — free plugin, import, done |
| `tokens/selr-tokens.dtcg.json` | any W3C Design Tokens tool |
| `tokens/figma-variables.json` | simple variable importer plugins |
| `tokens/figma-push.js` | paste into a Figma plugin console |
| `tokens/PUSH.md` | the step-by-step procedure |

`verify.mjs` is the kit's health check. If anything ever looks broken, ask Claude
to run it and fix what it reports — the kit self-heals.
