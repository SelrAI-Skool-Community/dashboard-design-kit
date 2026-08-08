// resolver key sk-mx2ajx (skills-index lookup; keep)
//
// Selr AI — generate every token artifact from source.mjs.
//
//   node tokens/build.mjs            write the files
//   node tokens/build.mjs --check    fail if anything on disk is stale (used by verify.sh)
//
// Outputs:
//   tokens/selr-tokens.dtcg.json     W3C Design Tokens — the portable format
//   tokens/selr-tokens.studio.json   Tokens Studio for Figma — free plugin, one-click import
//   tokens/figma-variables.json      flat name/mode/value — for simple variable importers
//   tokens/figma-push.js             Plugin API script — paste into use_figma or a plugin console
//
// tokens.css is NOT regenerated. It is hand-maintained for readability and verified
// against this source by --check, which is the safer contract: a drift is reported,
// never silently rewritten under a working stylesheet.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAMPS, SEMANTIC, SPACING, RADIUS, TYPE, FONT_FAMILY, CSS_MAP } from './source.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TPL = join(HERE, '..', 'templates');
const CHECK = process.argv.includes('--check');

const problems = [];
const wrote = [];

// One computed total, used by both figma-push.js and PUSH.md, so a token added or
// removed can never leave either of them quoting a stale number.
const TOTAL_VARS = Object.keys(RAMPS).length + Object.keys(SEMANTIC).length
                 + SPACING.length + Object.keys(RADIUS).length;

function emit(name, text) {
  const path = join(HERE, name);
  if (CHECK) {
    if (!existsSync(path)) { problems.push(`${name} is missing — run: node tokens/build.mjs`); return; }
    if (readFileSync(path, 'utf8') !== text) problems.push(`${name} is stale — run: node tokens/build.mjs`);
    return;
  }
  writeFileSync(path, text);
  wrote.push(name);
}

/* ── 1. W3C Design Tokens (DTCG) ─────────────────────────────────────── */
const nest = (obj, path, value) => {
  const parts = path.split('/');
  let cur = obj;
  parts.forEach((p, i) => {
    if (i === parts.length - 1) cur[p] = value;
    else cur = (cur[p] ||= {});
  });
};

const dtcg = { $description: 'Selr AI design tokens. Generated from tokens/source.mjs — do not hand-edit.' };
dtcg.global = {};
for (const [name, hex] of Object.entries(RAMPS)) nest(dtcg.global, name, { $type: 'color', $value: hex });

for (const mode of ['Light', 'Dark']) {
  const k = mode.toLowerCase();
  dtcg[k] = {};
  const idx = mode === 'Light' ? 0 : 1;
  for (const [name, pair] of Object.entries(SEMANTIC))
    nest(dtcg[k], name, { $type: 'color', $value: `{global.${pair[idx].split('/').join('.')}}` });
}

dtcg.spacing = {};
for (const n of SPACING) dtcg.spacing[String(n)] = { $type: 'dimension', $value: `${n}px` };
dtcg.radius = {};
for (const [k, v] of Object.entries(RADIUS)) dtcg.radius[k] = { $type: 'dimension', $value: `${v}px` };

dtcg.typography = {};
const WEIGHT = { semibold: 600, medium: 500, regular: 400 };
for (const [name, size, role, track] of TYPE)
  nest(dtcg.typography, name, {
    $type: 'typography',
    $value: { fontFamily: FONT_FAMILY, fontWeight: WEIGHT[role], fontSize: `${size}px`,
              letterSpacing: `${track}em` }
  });

emit('selr-tokens.dtcg.json', JSON.stringify(dtcg, null, 2) + '\n');

/* ── 2. Tokens Studio for Figma ──────────────────────────────────────── */
const studio = { global: {}, light: {}, dark: {}, $themes: [], $metadata: { tokenSetOrder: ['global', 'light', 'dark'] } };
for (const [name, hex] of Object.entries(RAMPS)) nest(studio.global, name, { type: 'color', value: hex });
for (const n of SPACING) nest(studio.global, `spacing/${n}`, { type: 'spacing', value: String(n) });
for (const [k, v] of Object.entries(RADIUS)) nest(studio.global, `radius/${k}`, { type: 'borderRadius', value: String(v) });
for (const [name, size, role, track] of TYPE)
  nest(studio.global, `type/${name}`, {
    type: 'typography',
    value: { fontFamily: FONT_FAMILY, fontWeight: String(WEIGHT[role]),
             fontSize: String(size), letterSpacing: `${track * 100}%` }
  });
for (const [name, pair] of Object.entries(SEMANTIC)) {
  nest(studio.light, name, { type: 'color', value: `{${pair[0]}}` });
  nest(studio.dark,  name, { type: 'color', value: `{${pair[1]}}` });
}
emit('selr-tokens.studio.json', JSON.stringify(studio, null, 2) + '\n');

/* ── 3. Flat variable list for simple importers ──────────────────────── */
const flat = {
  collections: [
    { name: '00 - Global', modes: ['Main'],
      variables: Object.entries(RAMPS).map(([name, hex]) => ({ name, type: 'COLOR', values: { Main: hex } })) },
    { name: '01 - Color Styles', modes: ['Light Mode', 'Dark Mode'],
      variables: Object.entries(SEMANTIC).map(([name, [l, d]]) => ({
        name, type: 'COLOR',
        values: { 'Light Mode': { alias: l, resolved: RAMPS[l] }, 'Dark Mode': { alias: d, resolved: RAMPS[d] } } })) },
    { name: '02 - Spacing', modes: ['Value'],
      variables: SPACING.map(n => ({ name: `Spacing/${n}`, type: 'FLOAT', values: { Value: n } })) },
    { name: '03 - Corner Radius', modes: ['Value'],
      variables: Object.entries(RADIUS).map(([name, v]) => ({ name, type: 'FLOAT', values: { Value: v } })) }
  ],
  textStyles: TYPE.map(([name, size, role, track]) => ({
    name, family: FONT_FAMILY, weight: role, size, letterSpacingEm: track }))
};
emit('figma-variables.json', JSON.stringify(flat, null, 2) + '\n');

/* ── 4. Figma Plugin API script ──────────────────────────────────────── */
const push = `// GENERATED from tokens/source.mjs — do not hand-edit. Run: node tokens/build.mjs
//
// Paste the whole file as the \`code\` argument of use_figma (or into a Figma plugin
// console) with the target fileKey. Idempotent: re-running updates values in place.

const RAMPS = ${JSON.stringify(RAMPS, null, 2)};
const SEMANTIC = ${JSON.stringify(SEMANTIC, null, 2)};
const SPACING = ${JSON.stringify(SPACING)};
const RADIUS = ${JSON.stringify(RADIUS, null, 2)};
const COLOR_SCOPES = ['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];
const rgb = h => ({ r: parseInt(h.slice(1,3),16)/255, g: parseInt(h.slice(3,5),16)/255, b: parseInt(h.slice(5,7),16)/255 });

const existing = await figma.variables.getLocalVariableCollectionsAsync();
const byName = {}; for (const c of existing) byName[c.name] = c;

async function collection(name, modeNames) {
  let c = byName[name];
  if (!c) { c = figma.variables.createVariableCollection(name); byName[name] = c; }
  c.renameMode(c.modes[0].modeId, modeNames[0]);
  for (let i = 1; i < modeNames.length; i++)
    if (!c.modes.some(m => m.name === modeNames[i])) c.addMode(modeNames[i]);
  const modes = {}; for (const m of c.modes) modes[m.name] = m.modeId;
  return { collection: c, modes };
}

const global = await collection('00 - Global', ['Main']);
const styles = await collection('01 - Color Styles', ['Light Mode','Dark Mode']);
const space  = await collection('02 - Spacing', ['Value']);
const radius = await collection('03 - Corner Radius', ['Value']);

const all = await figma.variables.getLocalVariablesAsync();
const index = {}; for (const v of all) index[v.variableCollectionId + '::' + v.name] = v;
function variable(b, name, type, scopes) {
  const key = b.collection.id + '::' + name;
  let v = index[key];
  if (!v) { v = figma.variables.createVariable(name, b.collection, type); index[key] = v; }
  v.scopes = scopes; return v;
}

const created = [], updated = [], globals = {};
for (const [name, hex] of Object.entries(RAMPS)) {
  const before = index[global.collection.id + '::' + name];
  const v = variable(global, name, 'COLOR', COLOR_SCOPES);
  v.setValueForMode(global.modes['Main'], rgb(hex));
  globals[name] = v; (before ? updated : created).push(name);
}
const missingRefs = [];
for (const [name, pair] of Object.entries(SEMANTIC)) {
  const [l, d] = pair;
  if (!globals[l] || !globals[d]) { missingRefs.push(name); continue; }
  const before = index[styles.collection.id + '::' + name];
  const v = variable(styles, name, 'COLOR', COLOR_SCOPES);
  v.setValueForMode(styles.modes['Light Mode'], { type: 'VARIABLE_ALIAS', id: globals[l].id });
  v.setValueForMode(styles.modes['Dark Mode'],  { type: 'VARIABLE_ALIAS', id: globals[d].id });
  (before ? updated : created).push(name);
}
for (const n of SPACING) {
  const name = 'Spacing/' + n, before = index[space.collection.id + '::' + name];
  variable(space, name, 'FLOAT', ['GAP','WIDTH_HEIGHT']).setValueForMode(space.modes['Value'], n);
  (before ? updated : created).push(name);
}
for (const [name, n] of Object.entries(RADIUS)) {
  const before = index[radius.collection.id + '::' + name];
  variable(radius, name, 'FLOAT', ['CORNER_RADIUS']).setValueForMode(radius.modes['Value'], n);
  (before ? updated : created).push(name);
}

return { createdCount: created.length, updatedCount: updated.length, missingRefs,
         expected: ${TOTAL_VARS} };
`;
emit('figma-push.js', push);

/* ── 4b. the one-paste push procedure ────────────────────────────────── */
emit('PUSH.md', `# Pushing the tokens into Figma

Generated from tokens/source.mjs — do not hand-edit. Run: \`node tokens/build.mjs\`

Two ways in. Neither needs a paid Figma plan.

## A · Tokens Studio plugin — the easy one

1. Open the target Figma file.
2. Plugins → **Tokens Studio for Figma** (free).
3. Import \`tokens/selr-tokens.studio.json\`.
4. Push the three sets to Figma variables: \`global\`, \`light\`, \`dark\`.

No API access involved at any point.

## B · One paste — when the Figma API is reachable

Paste the whole of \`tokens/figma-push.js\` into a Figma plugin console (or hand it to
an AI tool that can run Figma Plugin API code) with **your own file open**. Idempotent:
re-running updates values in place.

| | |
|---|---|
| **Target file** | your own Figma file — open it first |
| **Expected variables** | **${TOTAL_VARS}** — ${Object.keys(RAMPS).length} raw ramps, ${Object.keys(SEMANTIC).length} semantic across 2 modes, ${SPACING.length} spacing, ${Object.keys(RADIUS).length} radius |
| **Collections created** | \`00 - Global\` · \`01 - Color Styles\` · \`02 - Spacing\` · \`03 - Corner Radius\` |

The script returns \`createdCount\`, \`updatedCount\` and \`expected\`. First run:
\`createdCount\` equals \`expected\`. Re-run: \`updatedCount\` equals it.

## Fonts in Figma

The kit's web templates ship Manrope with them, so the HTML side needs no install.
Inside Figma, add the free **Manrope** Google Font to your file for matching type.
`);

/* ── 5. Cross-check tokens.css against this source ───────────────────── */
const css = readFileSync(join(TPL, 'tokens.css'), 'utf8');
const cssVar = (block, name) => {
  const seg = css.split(block)[1];
  if (!seg) return null;
  const m = seg.match(new RegExp(`\\${name}\\s*:\\s*([^;]+);`));
  return m ? m[1].trim() : null;
};
// raw ramps must be present with the exact hex
for (const [name, hex] of Object.entries(RAMPS)) {
  if (name === 'White' || name === 'Black') continue;
  const cssName = '--' + name.toLowerCase().replace('/', '-').replace('gray-', '');
  if (!css.toLowerCase().includes(hex.toLowerCase()))
    problems.push(`tokens.css is missing the value ${hex} (${name})`);
}
// semantic vars must exist in both mode blocks
for (const cssName of Object.keys(CSS_MAP)) {
  if (!cssVar('data-mode="light"', cssName)) problems.push(`tokens.css light mode has no ${cssName}`);
  if (!cssVar('data-mode="dark"', cssName))  problems.push(`tokens.css dark mode has no ${cssName}`);
}
for (const n of SPACING) if (!css.includes(`--s${n}:`) && n !== 0) problems.push(`tokens.css has no --s${n}`);

/* ── report ──────────────────────────────────────────────────────────── */
if (CHECK) {
  if (problems.length) { console.error('TOKENS FAIL\n  ' + problems.join('\n  ')); process.exit(1); }
  console.log(`TOKENS OK — ${Object.keys(RAMPS).length} ramps, ${Object.keys(SEMANTIC).length} semantic ` +
              `x2 modes, ${SPACING.length} spacing, ${Object.keys(RADIUS).length} radius, ${TYPE.length} text styles`);
} else {
  console.log('wrote:\n  ' + wrote.join('\n  '));
  if (problems.length) { console.error('\nbut tokens.css drifted:\n  ' + problems.join('\n  ')); process.exit(1); }
  console.log('tokens.css matches the source.');
}
