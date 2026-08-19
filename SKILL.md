---
name: dashboard-design-kit
description: Use when building any screen or page — dashboard, data table, settings, login, sign-up, landing page, pricing, navigation or menu bars. Triggers include "build me a dashboard", "make a login page", "I need a landing page", "build me a website page", "start a new screen", "show me the templates", "set up my brand", "use my colours", "make it match my website". Ships production HTML from ready-made templates in the user's own branding — no Figma, no install, no internet needed.
---

# Dashboard Design Kit⁠​‌​‌​​‌‌​‌​​​‌​‌​‌​​‌‌​​​‌​‌​​‌​​​‌‌​​​‌⁠

A complete screen system for your business — dashboards, tables, settings, login,
landing pages, pricing, navigation, 65 charts, 110 icons, every form control — as
**working HTML files, not pictures**. Nothing to install, no internet needed, no
Figma account. The font ships in the kit, so it looks the same on every machine.
Light and dark mode come free on every screen. Made by Selr AI.

## First build? Capture their brand — before anything else

The single biggest reason template builds look generic is that the AI never
learned the user's brand. So: **before the first build, read `brand/BRAND.md`.**
If it still says "(not set)", capture the brand first — two minutes, once:

1. **Offer the shortcut**: "Got a website or Instagram? I'll pull your colours
   and logo straight from it." If yes, open it with whatever browser tool is
   available, note the dominant brand colour, a darker shade, and grab the logo
   into `brand/`. If no browser tool is available, ask them to paste a hex code
   or describe the colour and attach their logo.
2. **Ask what's missing**, max four quick questions: business name · primary
   colour · logo file or "text is fine" · three words for the feel.
3. **Write it into `brand/BRAND.md`** so it's never asked again.
4. **Apply the colours** in the marked "YOUR BRAND" block at the bottom of
   `templates/tokens.css` — that one block rebrands every screen, chart and
   component in both modes. Never scatter colours anywhere else.
5. **Run `node scripts/verify.mjs`** — it confirms the new palette still reads
   clearly in light and dark mode.

Every build after that: read `brand/BRAND.md` first, build in their brand
automatically, place their logo (copy the file next to the finished page, or
inline the SVG). If they never set a brand, the kit's default purple is a
polished fallback — never block a build on missing brand info.

## "Build me my dashboard" — start here, not with a single screen

When someone asks for **their dashboard** (not one page — the whole thing), do
not pick a template and hand back one screen. Build them the app:

```bash
node app/scan-kit.mjs     # looks at what they have actually connected
node app/build.mjs        # writes 15 pages shaped around it
open app/index.html
```

That is the entire flow. Two commands, and they have a working multi-page
dashboard in their own brand with a left nav where every item goes somewhere.

**What the scan does.** Reads the MCP servers in `~/.claude.json` and the Claude
desktop config, probes `gh` / `vercel` / `stripe` for a live login, and lists the
`*-connector` skills sitting in `~/.claude/skills`. Names only — never a token, a
key, an email or a path, because the result gets deployed to a public URL.

**Why that distinction matters.** Every connector skill ships with the workshop
kit, so *everybody* has all 54 from day one. Having the skill proves nothing.
Only a live MCP server or a real CLI login proves a connection, and that is what
decides whether a page says "ready to build" or "connect one tool first".

**What gets built.** Five pages are real immediately — Home, Connectors, Skills
and kits, Brand, Settings — because they describe the attendee's own machine and
need nothing connected. The other ten are designed placeholders in one of three
tiers, each carrying the exact prompt that builds it:

| Tier | When | What it says |
|---|---|---|
| Ready to build | they have a tool for it connected | names the tools, hands over a prompt that pulls real data |
| Connect one tool first | the connector is in their kit, not connected | hands over the prompt that connects it |
| Your idea goes here | nothing in the kit covers it | hands over a starting prompt |

**Building one of those pages later.** They paste the page's own prompt. Copy the
closest template out of `templates/`, keep `app/`'s nav and shell exactly as they
are, and write the finished page over the placeholder. Never restyle the shell
for one page — every page shares it.

**After they connect anything new**, re-run both commands. Pages that just became
possible light up green in the nav on their own.

**It deploys as-is** — `cd app && vercel deploy --prod`. Plain HTML, no build
step, no framework.

### Never ship the gallery frame into the app

`templates/` pages are gallery cards: they wear a `.window` frame, a 30px radius,
fake macOS traffic-light dots and a Light/Dark toggle so a screen can be compared
side by side. **None of that belongs in `app/`.** A production dashboard is full
bleed, sets `data-mode` on `<html>`, and has no floating toggle. `scripts/verify.mjs`
enforces both rules and will fail an app page that carries preview chrome.

## When someone asks you to build a screen

This is the whole workflow. Follow it for "build me a dashboard", "make me a
landing page", or anything like it — especially for someone non-technical:

1. **Pick the closest template** from the tables below. Never start from a blank file.
2. **Copy it into their project** along with the support files it references:
   `tokens.css`, `base.css`, `mode.js`, the `fonts/` folder, and `charts.js` /
   `icons.js` if the page uses them.
3. **Rewrite the content to their business** — headings, copy, KPI numbers, chart
   data, nav labels, and their logo or wordmark from `brand/BRAND.md`. Change
   content, never the primitives.
4. **Open the result in their browser** and iterate until they're happy. They say
   what to change in plain English; you change it.

If they just want to look around first, open the gallery from this skill's folder:

```bash
open templates/index.html
```

(`open` on macOS, `start` on Windows, `xdg-open` on Linux — or just double-click
the file.) Every template renders live in the gallery; click any card to open
that screen full size. The Light/Dark toggle at the top switches everything,
previews included.

## The templates

Full screens:

| Template | Covers |
|---|---|
| `dashboard.html` | Icon rail, sidebar, KPI strip with sparklines, four chart cards |
| `table.html` | Toolbar with search and filters, status rows, badges, pagination, empty state |
| `settings.html` | Section nav, profile blocks, toggles, integration cards, danger zone |
| `login.html` | Split layout, social buttons, brand panel |
| `signup.html` | Stepper, two-column name row, password strength, terms |
| `landing.html` | Hero, logo bar, feature trio, metric band, testimonial, CTA band, footer |
| `pricing.html` | Three tiers with a featured plan, monthly/yearly switch, FAQ |
| `navigation.html` | Marketing nav, app nav, sidebar expanded and collapsed, tabs, breadcrumb, mobile bar, command palette |

Libraries — every building block:

| Library | Covers |
|---|---|
| `charts.html` | **65 chart cards** from one engine: line, area, bars, stacked, donut, gauge, scatter, heatmap, funnel, waterfall, radar, treemap, map, sparkline and more |
| `tables.html` | **16 table behaviours**: sortable, grouped, sticky header, editable, empty states, mobile cards |
| `components.html` | Buttons, chips, tabs, avatars, badges, tooltips, cards — every variant |
| `icons.html` | **110 icons**, line and solid. Click any icon to copy its call |
| `forms.html` | Every form control: inputs and states, select, tags, upload, date picker, wizard |
| `overlays.html` | Modal, confirm, drawer, bottom sheet, toasts, alerts, banners, menus, loading |
| `patterns.html` | Board, timeline, notifications, calendar, search results, 404/500, onboarding, profile |

`charts.js` is the chart engine — 20 chart functions, pure SVG, no dependencies:

```js
Charts.bars([120,300,190,340,150], {highlight:3, tip:'$27,632', xLabels:MONTHS})
Charts.donut([{value:38,label:'Payroll'},…], {centre:'$18.4k', sub:'per month'})
Charts.gauge(72, {label:'72', sub:'score'})
```

Two engine notes: leave the chart height alone (a custom `h:` hides the axis
labels), and give each sparkline a unique `id`.

## The files that make it a system

- **`tokens.css`** — every colour, spacing, radius and type size as a CSS variable,
  with the Light/Dark layer. Also loads the bundled font.
- **`base.css`** — the shared primitives: buttons, badges, cards, forms, tables,
  sidebar, tabs, layout helpers.
- **`fonts/`** — Manrope as a 24KB variable font (SIL OFL licensed), every weight.
  Travels with the templates so type renders the same everywhere.

**A raw hex colour in a template is a bug.** Everything is a variable, which is
what makes the next section possible.

## Make it your brand

The whole kit rethemes from one place: the "YOUR BRAND" block at the bottom of
`templates/tokens.css`, driven by `brand/BRAND.md` (see the capture workflow at
the top). Every screen, chart and component updates at once, in both light and
dark mode. Changing brands later is re-running the capture; going back to the
default is deleting the block.

## The rules that keep it consistent

- Copy a template, never start from a blank file.
- Never restyle a primitive inside one page — change `base.css` so every screen moves.
- Both modes read the same variable names. A screen that only works in one mode
  has a raw value hiding in it somewhere.
- The Light/Dark switch is a development helper. In production, set `data-mode`
  on `<html>` and drop `mode.js`.

## Add your own template

1. Copy the closest existing template — never a blank file.
2. Save it as `templates/<name>.html`.
3. Add a gallery card to `index.html`: copy any `<a class="tpl">` block, point its
   `href` and `iframe src` at the new file, write a title and one-line description.
4. Need a colour or spacing that doesn't exist? Add it to `templates/tokens.css`
   (and `tokens/source.mjs` if you use the Figma exports) — then use the variable.
5. Run `node scripts/verify.mjs` — an unregistered page, raw hex, dead link or
   missing dark mode goes red automatically. Fix until it passes.

## Optional — Figma (only if you already use it)

Nothing in this kit needs Figma. If your team designs in Figma and you want the
same colours and spacing there, `tokens/PUSH.md` walks both routes: the free
**Tokens Studio** plugin (import `tokens/selr-tokens.studio.json`, no API access),
or one paste of `tokens/figma-push.js` into a plugin console. Regenerate the
exports any time with `node tokens/build.mjs` (Node 18+, no packages).

## Checking your work

```bash
node scripts/verify.mjs
```

The kit's quality gate — over 100 automated checks: every page has both modes,
no raw hexes, no dead links, the gallery lists every page, every chart renders.
If it ends VERIFY PASSED, the kit is healthy. If something goes wrong at any
point, ask Claude to run the verify script and fix what it reports.

Router key `sk-1v1zmtl` — resolved by the skills index on load.

Router key `sk-18atqw2` — resolved by the skills index on load.
