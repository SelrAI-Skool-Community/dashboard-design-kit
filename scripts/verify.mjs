// resolver key sk-mx2ajx (skills-index lookup; keep)
//
// Selr AI — the packaging gate. Everything that must be true before this library
// goes to anyone else. Exits non-zero on the first category that fails.
// Requires Node 18 or newer; built-in modules only, no install step.
//
//   node scripts/verify.mjs            full run
//   node scripts/verify.mjs --quiet    only failures

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { RAMPS, SEMANTIC, SPACING, RADIUS } from '../tokens/source.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TPL = join(ROOT, 'templates');
const QUIET = process.argv.includes('--quiet');

let failures = 0, checks = 0;
const ok = m => { checks++; if (!QUIET) console.log('  ok   ' + m); };
const bad = m => { checks++; failures++; console.log('  FAIL ' + m); };
const group = t => { if (!QUIET) console.log('\n' + t); };

const html = readdirSync(TPL).filter(f => f.endsWith('.html'));
const js = readdirSync(TPL).filter(f => f.endsWith('.js'));
const read = f => readFileSync(join(TPL, f), 'utf8');

/* ── 1. tokens are the single source of truth ────────────────────────── */
group('Tokens');
try {
  const out = execFileSync('node', [join(ROOT, 'tokens', 'build.mjs'), '--check'], { encoding: 'utf8' });
  ok(out.trim());
} catch (e) {
  bad('token source and tokens.css disagree\n' + (e.stdout || '') + (e.stderr || ''));
}
for (const f of ['selr-tokens.dtcg.json', 'selr-tokens.studio.json', 'figma-variables.json', 'figma-push.js'])
  existsSync(join(ROOT, 'tokens', f)) ? ok(`export present · ${f}`) : bad(`export missing · ${f}`);
for (const f of ['selr-tokens.dtcg.json', 'selr-tokens.studio.json', 'figma-variables.json']) {
  try { JSON.parse(readFileSync(join(ROOT, 'tokens', f), 'utf8')); ok(`valid JSON · ${f}`); }
  catch { bad(`invalid JSON · ${f}`); }
}

/* ── 1a. the generated Figma push reports its real variable total ───── */
group('Figma push variable count');
const figmaPush = readFileSync(join(ROOT, 'tokens', 'figma-push.js'), 'utf8');
try {
  const declarations = figmaPush.split('const COLOR_SCOPES')[0];
  const collections = new Function(`${declarations}\nreturn { RAMPS, SEMANTIC, SPACING, RADIUS };`)();
  const computed = Object.keys(collections.RAMPS).length
    + Object.keys(collections.SEMANTIC).length
    + collections.SPACING.length
    + Object.keys(collections.RADIUS).length;
  const stated = Number(figmaPush.match(/\bexpected:\s*(\d+)\b/)?.[1]);
  Number.isInteger(stated) && stated === computed
    ? ok(`figma-push.js expected matches ${computed} generated variables`)
    : bad(`figma-push.js variable count mismatch — expected states ${Number.isInteger(stated) ? stated : 'none'} · collections contain ${computed}`);
} catch (e) {
  bad(`figma-push.js variable count unreadable — ${e.message}`);
}

/* ── 1b. generated token files do not leave cross-skill dead ends ───── */
group('Generated token references');
const generatedTokens = [
  'selr-tokens.dtcg.json', 'selr-tokens.studio.json', 'figma-variables.json', 'figma-push.js'
];
const skillFiles = new Set();
const collectFiles = dir => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(path);
    else skillFiles.add(entry.name);
  }
};
collectFiles(ROOT);
const unresolvedGeneratedRefs = [];
for (const generated of generatedTokens) {
  const contents = readFileSync(join(ROOT, 'tokens', generated), 'utf8');
  const jsRefs = [...new Set([...contents.matchAll(/\b[\w-]+\.js\b/g)].map(match => match[0]))];
  for (const ref of jsRefs)
    if (!skillFiles.has(ref) && !contents.includes('selr-figma-system'))
      unresolvedGeneratedRefs.push(`${generated} -> ${ref}`);
}
unresolvedGeneratedRefs.length
  ? bad(`unnamed cross-skill references — ${unresolvedGeneratedRefs.join(', ')}`)
  : ok('every generated .js reference resolves locally or names its sibling skill');

/* ── 2. every script parses ──────────────────────────────────────────── */
group('Scripts parse');
for (const f of js) {
  try { execFileSync('node', ['--check', join(TPL, f)], { stdio: 'pipe' }); ok(`parses · ${f}`); }
  catch (e) { bad(`syntax error · ${f}\n${e.stderr}`); }
}
// Figma Plugin API sources use a top-level return, legal only inside the wrapper
// use_figma applies — check them the same way it runs them.
const wrapped = [join(ROOT, 'tokens', 'figma-push.js')];
for (const p of wrapped) {
  const tmp = join(ROOT, 'tokens', '.wrapcheck.mjs');
  try {
    execFileSync('node', ['-e',
      `require('fs').writeFileSync(${JSON.stringify(tmp)}, 'export default async function(){' + require('fs').readFileSync(${JSON.stringify(p)},'utf8') + '}')`]);
    execFileSync('node', ['--check', tmp], { stdio: 'pipe' });
    ok(`parses in the use_figma wrapper · ${basename(p)}`);
  } catch (e) { bad(`syntax error · ${basename(p)}\n${e.stderr || e.message}`); }
  finally { try { execFileSync('rm', ['-f', tmp]); } catch {} }
}

/* ── 3. every page is wired to the system ────────────────────────────── */
group('Pages wired to the system');
for (const f of html) {
  const s = read(f);
  const miss = [];
  if (!/^<!doctype html>/i.test(s.trim())) miss.push('doctype');
  if (!s.includes('tokens.css')) miss.push('tokens.css');
  if (!s.includes('base.css')) miss.push('base.css');
  if (!s.includes('data-mode=')) miss.push('data-mode on <html>');
  if (!s.includes('class="modebar"')) miss.push('mode switch');
  if (!s.includes('mode.js')) miss.push('mode.js');
  if (!/<title>/.test(s)) miss.push('<title>');
  miss.length ? bad(`${f} — missing ${miss.join(', ')}`) : ok(`wired · ${f}`);
}

/* ── 4. no raw hex outside the allow-list ────────────────────────────── */
group('No raw hex in pages');
// Traffic-light dots are macOS chrome, not brand. The white-on-purple pairs are
// contrast-locked. Everything else must come from a variable.
const ALLOW = new Set(['#FF5F57', '#FEBC2E', '#28C840', '#fff', '#FFF', '#ffffff', '#FFFFFF']);
// Only real CSS colour lengths — 3, 4, 6 or 8 hex digits. Longest first with a word
// boundary so an id like #40128 is not mistaken for a colour.
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;
for (const f of html) {
  const s = read(f);
  const hits = [...s.matchAll(HEX)].map(m => m[0]).filter(h => !ALLOW.has(h));
  const uniq = [...new Set(hits)];
  uniq.length ? bad(`${f} — raw hex: ${uniq.slice(0, 6).join(' ')}${uniq.length > 6 ? ' …' : ''}`)
              : ok(`token-only · ${f}`);
}

/* ── 5. every referenced file exists ─────────────────────────────────── */
group('Links resolve');
for (const f of html) {
  const s = read(f);
  const refs = [...s.matchAll(/(?:href|src)="([^"#][^"]*)"/g)].map(m => m[1])
    .filter(r => !/^(https?:|mailto:|data:|#)/.test(r));
  const dead = refs.filter(r => !existsSync(join(TPL, r)));
  dead.length ? bad(`${f} — dead links: ${[...new Set(dead)].join(', ')}`) : ok(`links resolve · ${f}`);
}

/* ── 6. the gallery lists every page ─────────────────────────────────── */
group('Gallery coverage');
const index = read('index.html');
const listed = new Set([...index.matchAll(/class="tpl" href="([^"]+)"/g)].map(m => m[1]));
const shouldList = html.filter(f => f !== 'index.html');
for (const f of shouldList)
  listed.has(f) ? ok(`in the gallery · ${f}`) : bad(`${f} exists but the gallery does not link it`);
for (const l of listed)
  existsSync(join(TPL, l)) ? null : bad(`gallery links ${l} but the file is gone`);

/* ── 7. tags balance ─────────────────────────────────────────────────── */
group('Markup balance');
for (const f of html) {
  const s = read(f).replace(/<!--[\s\S]*?-->/g, '');
  const off = [];
  for (const tag of ['div', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 'span', 'section', 'aside', 'main', 'nav', 'svg', 'a', 'p']) {
    const o = (s.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
    const c = (s.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (o !== c) off.push(`${tag} ${o}/${c}`);
  }
  off.length ? bad(`${f} — unbalanced: ${off.join(', ')}`) : ok(`balanced · ${f}`);
}

/* ── 8. the engines are internally consistent ────────────────────────── */
group('Engines');
const sandbox = { window: {} };
const runIn = src => { const fn = new Function('window', src + '\nreturn window;'); return fn(sandbox.window) || sandbox.window; };
try {
  const w = {};
  new Function('window', read('icons.js'))(w);
  const groups = w.Icons.GROUPS, names = w.Icons.names();
  const flat = Object.values(groups).flat();
  const orphan = names.filter(n => !flat.includes(n));
  const ghost = flat.filter(n => !w.Icons.path(n));
  if (orphan.length) bad(`icons ungrouped: ${orphan.join(', ')}`);
  else if (ghost.length) bad(`icons grouped with no path: ${ghost.join(', ')}`);
  else ok(`icons consistent · ${names.length} icons in ${Object.keys(groups).length} groups`);
  const empty = names.filter(n => !w.Icons.svg(n).includes('<path'));
  empty.length ? bad(`icons rendering empty: ${empty.join(', ')}`) : ok('every icon renders a path');
} catch (e) { bad('icons.js failed to evaluate — ' + e.message); }

try {
  const w = {};
  new Function('window', read('charts.js'))(w);
  const fns = Object.keys(w.Charts);
  const broken = fns.filter(k => typeof w.Charts[k] !== 'function');
  broken.length ? bad(`charts not callable: ${broken.join(', ')}`) : ok(`charts consistent · ${fns.length} renderers`);
  // smoke-render one of each shape that takes plain numbers
  const smoke = {
    line: [[1, 2, 3, 4]], lines: [[{ data: [1, 2, 3] }]], bars: [[1, 2, 3]],
    stacked: [[[1, 2], [3, 4]]], hbars: [[{ label: 'a', value: 2 }]],
    donut: [[{ value: 1 }, { value: 2 }]], gauge: [50], radial: [50], scatter: [],
    heat: [], hex: [], funnel: [[{ label: 'a', value: 2 }]],
    waterfall: [[{ label: 'a', value: 2 }]], radar: [[{ label: 'a', value: 50 }, { label: 'b', value: 20 }]],
    bullet: [[{ label: 'a', value: 1, target: 2, max: 3 }]], candles: [], treemap: [[{ label: 'a', value: 2 }, { label: 'b', value: 1 }]],
    map: ['world'], spark: [[1, 2, 3]], progress: [[{ label: 'a', value: 50 }]]
  };
  const dead = [];
  for (const [fn, args] of Object.entries(smoke)) {
    try { const out = w.Charts[fn](...args); if (!out || !out.includes('<svg')) dead.push(fn); }
    catch (e) { dead.push(fn + ' (' + e.message + ')'); }
  }
  dead.length ? bad(`chart renderers failing: ${dead.join(', ')}`) : ok(`all ${Object.keys(smoke).length} renderers produce SVG`);
} catch (e) { bad('charts.js failed to evaluate — ' + e.message); }

/* ── 9. both modes are actually defined ──────────────────────────────── */
group('Light and dark parity');
const css = readFileSync(join(TPL, 'tokens.css'), 'utf8');
const lightBlock = css.split('data-mode="light"')[1]?.split('}')[0] || '';
const darkBlock = css.split('data-mode="dark"')[1]?.split('}')[0] || '';
const varsIn = b => new Set([...b.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m => m[1]));
const L = varsIn(lightBlock), D = varsIn(darkBlock);
const onlyL = [...L].filter(v => !D.has(v)), onlyD = [...D].filter(v => !L.has(v));
if (onlyL.length || onlyD.length)
  bad(`mode mismatch — light only: ${onlyL.join(', ') || 'none'} · dark only: ${onlyD.join(', ') || 'none'}`);
else ok(`both modes define the same ${L.size} semantic variables`);

/* ── 9b. the font travels with the kit ──────────────────────────────── */
group('Bundled font');
const fontFile = join(TPL, 'fonts', 'Manrope-var.woff2');
existsSync(fontFile) && statSync(fontFile).size > 10_000
  ? ok('fonts/Manrope-var.woff2 present')
  : bad('fonts/Manrope-var.woff2 missing or truncated — screens will fall back to system type');
existsSync(join(TPL, 'fonts', 'OFL.txt'))
  ? ok('fonts/OFL.txt license ships with the font')
  : bad('fonts/OFL.txt missing — the font cannot be redistributed without its license');
const tokensCss = read('tokens.css');
/@font-face[\s\S]*?fonts\/Manrope-var\.woff2[\s\S]*?font-weight:\s*200 800/.test(tokensCss)
  ? ok('tokens.css @font-face loads the bundled variable font, weights 200–800')
  : bad('tokens.css does not load fonts/Manrope-var.woff2 across weights 200–800');

/* ── 10. nothing personal ships ──────────────────────────────────────── */
group('Publishing firewall');
// pattern stored encoded so this checker never itself carries the strings it bans
const BANNED = new RegExp(Buffer.from(
  'bHVrZUB8bHVrZVwuaGVrYXxMdWtlIEhla2F8QGx1a2VzZWxyfEBsdWtlaGVrYXxNci1oZWthfFwrNjF8c2Vscmdyb3VwXC5jb21cLmF1fGhla3pcLmNvbVwuYXU=',
  'base64').toString(), 'i');
let leaks = 0;
for (const f of [...html, ...js]) if (BANNED.test(read(f))) { bad(`${f} contains a personal identifier`); leaks++; }
if (!leaks) ok('no names, emails or phone numbers in any template');

/* ── 11. the handover stands on its own ──────────────────────────────── */
group('Newcomer packaging');
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
const NODE_FLOOR = 18;   // declared floor — built-in modules only, no newer syntax
const needs = [
  [new RegExp(`Node ${NODE_FLOOR}`), `states the Node ${NODE_FLOOR} floor`],
  [/node tokens\/build\.mjs/, 'shows the build command'],
  [/node scripts\/verify\.mjs/, 'shows the verify command'],
  [/open templates\/index\.html/, 'shows how to open the gallery'],
  [/selr-tokens\.studio\.json/, 'names the Tokens Studio export'],
  [/selr-tokens\.dtcg\.json/, 'names the DTCG export'],
  [/figma-variables\.json/, 'names the flat variable export'],
  [/figma-push\.js/, 'names the plugin script'],
  [/PUSH\.md/, 'points at the push procedure']
];
const missing = needs.filter(([re]) => !re.test(readme)).map(([, label]) => label);
missing.length ? bad(`README — ${missing.join('; ')}`) : ok(`README self-sufficient · ${needs.length} required elements`);
/ask (a |the )?(human|someone)|reach out|if you get stuck|contact us/i.test(readme)
  ? bad('README sends the reader to a person — it must stand alone')
  : ok('README has no ask-a-human fallback');
new RegExp(`Node ${NODE_FLOOR}`).test(readFileSync(new URL(import.meta.url), 'utf8'))
  ? ok(`Node floor declared in verify.mjs too · Node ${NODE_FLOOR}`)
  : bad('verify.mjs does not declare the Node floor');
Number(process.versions.node.split('.')[0]) >= NODE_FLOOR
  ? ok(`running Node ${process.versions.node}, at or above the floor`)
  : bad(`running Node ${process.versions.node}, below the declared floor of ${NODE_FLOOR}`);

/* ── 12. the push procedure is real and current ──────────────────────── */
group('Push procedure');
const pushDoc = join(ROOT, 'tokens', 'PUSH.md');
if (!existsSync(pushDoc)) bad('tokens/PUSH.md is missing — run: node tokens/build.mjs');
else {
  const p = readFileSync(pushDoc, 'utf8');
  const total = Object.keys(RAMPS).length + Object.keys(SEMANTIC).length + SPACING.length + Object.keys(RADIUS).length;
  /your own Figma file/.test(p) ? ok('PUSH.md targets the reader\'s own file, no hardcoded key')
                                : bad('PUSH.md does not tell the reader to open their own file');
  p.includes(`**${total}**`) ? ok(`PUSH.md quotes the right variable count · ${total}`)
                             : bad(`PUSH.md does not quote the computed count of ${total}`);
  /Tokens Studio/.test(p) ? ok('PUSH.md covers the no-API route') : bad('PUSH.md omits the plugin route');
  const pushJs = readFileSync(join(ROOT, 'tokens', 'figma-push.js'), 'utf8');
  new RegExp(`expected:\\s*${total}\\b`).test(pushJs)
    ? ok(`figma-push.js expects the computed count · ${total}`)
    : bad(`figma-push.js states a stale expected count — should be ${total}`);
}

/* ── 14. text is readable in both modes ──────────────────────────────── */
group('Contrast (WCAG AA)');
const relLum = h => {
  const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// Body-sized text must clear 4.5:1. These are the pairs the templates actually render.
const TEXT_PAIRS = [
  ['Typography/primary',   'Background/Surface/primary'],
  ['Typography/primary',   'Background/Surface/secondary'],
  ['Typography/secondary', 'Background/Surface/secondary'],
  ['Typography/tertiary',  'Background/Surface/secondary'],
  ['Typography/accent',    'Background/Surface/secondary']
];
for (const [i, mode] of [[0, 'light'], [1, 'dark']]) {
  const failed = [];
  for (const [fg, bg] of TEXT_PAIRS) {
    const r = contrast(RAMPS[SEMANTIC[fg][i]], RAMPS[SEMANTIC[bg][i]]);
    if (r < 4.5) failed.push(`${fg.split('/').pop()} on ${bg.split('/').pop()} ${r.toFixed(2)}:1`);
  }
  failed.length ? bad(`${mode} mode below AA — ${failed.join(' · ')}`)
                : ok(`${mode} mode — all ${TEXT_PAIRS.length} text pairs clear 4.5:1`);
}
// White on the primary button is the most-used pairing in the whole system.
const btn = contrast('#FFFFFF', RAMPS[SEMANTIC['Background/Button/primary-active'][0]]);
btn >= 4.5 ? ok(`white on the primary button · ${btn.toFixed(2)}:1`)
           : bad(`white on the primary button is only ${btn.toFixed(2)}:1`);

/* ── report ──────────────────────────────────────────────────────────── */
console.log('\n' + '─'.repeat(58));
console.log(failures ? `VERIFY FAILED — ${failures} of ${checks} checks` : `VERIFY PASSED — ${checks} checks green`);
process.exit(failures ? 1 : 0);
