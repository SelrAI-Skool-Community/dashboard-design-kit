/* resolver key sk-1v1zmtl (skills-index lookup; keep)
   Selr AI — builds the dashboard app.

   Reads kit-scan.json (what the attendee actually has connected) and writes a
   complete, deployable, multi-page site into this folder. Every page shares one
   generated nav, so a page built later drops into a shell that already exists.

   Run:  node app/build.mjs        (from the kit root)
         node build.mjs            (from app/)

   Zero dependencies. Node 18+. */

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync, readdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const KIT  = join(HERE, '..');
const TPL  = join(KIT, 'templates');
const OUT  = HERE;
const ASSETS = join(OUT, 'assets');

const { GROUPS, SOON, PAGES, ICONS, TIERS, CONNECT_PROMPT, IDEA_PROMPT } =
  await import('./pages.mjs');

/* ── inputs ────────────────────────────────────────────────────────── */
const EMPTY_SCAN = {
  generatedAt: null,
  counts: { connected: 0, available: 0, skills: 0, kits: 0 },
  connected: [], unmatched: [], pages: {}, kits: [],
  brand: { set: false, name: null, primary: null },
};

function loadScan() {
  const p = join(OUT, 'kit-scan.json');
  if (!existsSync(p)) {
    console.log('  No kit-scan.json yet — building the empty-handed version.');
    console.log('  Run `node app/scan-kit.mjs` first to shape it around your tools.\n');
    return EMPTY_SCAN;
  }
  try { return { ...EMPTY_SCAN, ...JSON.parse(readFileSync(p, 'utf8')) }; }
  catch { console.log('  kit-scan.json could not be read — building the empty-handed version.\n'); return EMPTY_SCAN; }
}

const scan = loadScan();
const BRAND_NAME = scan.brand?.name || 'Your business';
const INITIAL = BRAND_NAME.trim().charAt(0).toUpperCase() || 'Y';

/* ── helpers ───────────────────────────────────────────────────────── */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');

function names(list) {
  const n = list.map(c => c.label);
  if (n.length === 0) return '';
  if (n.length === 1) return n[0];
  if (n.length === 2) return `${n[0]} and ${n[1]}`;
  return `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}`;
}

function icon(key, cls = 'icon') {
  const d = ICONS[key] || ICONS.doc;
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
}

function tierOf(id) {
  const p = PAGES[id];
  if (p.built) return 'built';
  if (!p.scanKey) return 'idea-open';           // page about their own setup, always buildable
  const s = scan.pages?.[p.scanKey];
  if (!s) return 'idea';                        // no scan run yet — promise nothing
  /* A tier of connect-first with nothing available to connect is not a real
     amber state; the nav dot would contradict what the page itself says. */
  if (s.tier === 'connect-first' && !(s.available || []).length) return 'idea';
  return s.tier || 'idea';
}

function connOf(id) {
  const p = PAGES[id];
  if (!p.scanKey) return { connected: [], available: [] };
  const s = scan.pages?.[p.scanKey];
  return { connected: s?.connected || [], available: s?.available || [] };
}

/* ── the nav, identical on every page ──────────────────────────────── */
function nav(currentId) {
  let out = '';
  for (const g of GROUPS) {
    out += `\n      <div class="navgroup">${esc(g.title)}</div>\n      <div class="navlist">\n`;
    for (const id of g.ids) {
      const p = PAGES[id];
      const t = tierOf(id);
      const dot = t === 'ready' ? ' navdot--ready' : t === 'connect-first' ? ' navdot--connect' : '';
      const cur = id === currentId ? ' aria-current="page"' : '';
      const dotEl = p.built ? '' : `<span class="navdot${dot}"></span>`;
      out += `        <a href="${p.file}"${cur}>${icon(p.icon)}${esc(p.label)}${dotEl}</a>\n`;
    }
    out += `      </div>\n`;
  }
  out += `\n      <div class="navgroup">Coming next</div>\n      <div class="navlist">\n`;
  for (const s of SOON) {
    out += `        <span class="navitem">${icon(s.icon)}${esc(s.label)}<span class="navtag">SOON</span></span>\n`;
  }
  out += `      </div>\n`;
  return out;
}

/* ── the page frame — full bleed, no window, no dots, no mode toggle ── */
function shell(id, bodyHtml) {
  const p = PAGES[id];
  return `<!doctype html>
<html lang="en" data-mode="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)} · ${esc(BRAND_NAME)}</title>
<link rel="stylesheet" href="assets/tokens.css">
<link rel="stylesheet" href="assets/base.css">
<link rel="stylesheet" href="assets/app.css">
<script src="assets/mode.js"></script>
</head>
<body>

<div class="app">

  <nav class="app__nav" aria-label="Main">
    <div class="app__brand"><span class="mark">${esc(INITIAL)}</span>${esc(BRAND_NAME)}</div>
    <div class="app__navscroll">
${nav(id)}    </div>
    <div class="app__navfoot">
      A green dot means you have the tool connected and the page is ready to build.
      An amber dot means connect one tool first.
    </div>
  </nav>

  <main class="app__main">
    <header class="app__bar">
      <div class="app__crumb">${esc(BRAND_NAME)} &nbsp;/&nbsp; <b>${esc(p.title)}</b></div>
      <div class="app__baruser"><span class="avatar sm">${esc(INITIAL)}</span></div>
    </header>

    <div class="app__body">
${bodyHtml}
    </div>
  </main>

</div>

<script src="assets/copy.js"></script>
</body>
</html>
`;
}

function head(id) {
  const p = PAGES[id];
  return `      <div class="apphead">
        <div class="eyebrow">${esc(p.eyebrow)}</div>
        <h1>${esc(p.title)}</h1>
        <p class="sub">${esc(p.sub)}</p>
      </div>
`;
}

/* ── the stub — what an unbuilt page looks like ────────────────────── */
function stub(id) {
  const p = PAGES[id];
  const t = tierOf(id);
  const { connected, available } = connOf(id);

  let tier, line, prompt, cta;

  if (t === 'ready') {
    tier = TIERS.ready;
    line = tier.line(p, names(connected), connected.length > 1);
    prompt = p.prompt(names(connected));
    cta = tier.cta;
  } else if (t === 'connect-first' && available.length) {
    tier = TIERS['connect-first'];
    const pick = available.slice(0, 2);
    line = tier.line(p, names(pick));
    prompt = CONNECT_PROMPT(names(pick), pick.map(c => c.id));
    cta = tier.cta;
  } else {
    tier = TIERS.idea;
    line = tier.line(p);
    prompt = p.prompt ? p.prompt('whatever I have connected') : IDEA_PROMPT(p.title);
    cta = tier.cta;
  }

  const cls = t === 'ready' ? 'stub--ready' : (t === 'connect-first' && available.length) ? 'stub--connect' : 'stub--idea';

  const chips = [
    ...connected.map(c => `<span class="conn conn--on"><i></i>${esc(c.label)}</span>`),
    ...available.slice(0, 6).map(c => `<span class="conn conn--off"><i></i>${esc(c.label)}</span>`),
  ].join('');

  const will = (p.willShow || []).map(w => `<span>${esc(w)}</span>`).join('');

  return `      <section class="stub ${cls}">
        <div class="stub__tier">${esc(tier.label)}</div>
        <h2>${esc(p.title)}</h2>
        <p class="say">${line}</p>
${chips ? `        <div class="stub__logos">${chips}</div>\n` : ''}${will ? `        <div class="willshow">${will}</div>\n` : ''}
        <div class="prompt">
          <div class="prompt__box" id="p-${esc(id)}">${esc(prompt)}</div>
          <div class="prompt__row">
            <button class="btn btn--primary btn--sm" data-copy="p-${esc(id)}">${esc(cta)}</button>
            <span class="prompt__hint">Paste it into Claude Code</span>
            <span class="copied">Copied</span>
          </div>
        </div>

        <div class="stub__ask">
          Not sure this is the right page for you? Ask Claude:
          <b>&ldquo;${esc(p.ask || `what should go on my ${p.title} page?`)}&rdquo;</b>
        </div>
      </section>
`;
}

/* ── built pages ───────────────────────────────────────────────────── */

function homeBody() {
  const unbuilt = Object.keys(PAGES).filter(id => !PAGES[id].built);
  const ready = unbuilt.filter(id => tierOf(id) === 'ready');
  const c = scan.counts;

  const kpi = (lab, val, sub) =>
    `          <div class="kpi"><div class="lab">${esc(lab)}</div><div class="val">${esc(val)}</div><div class="sub">${esc(sub)}</div></div>\n`;

  const cards = unbuilt.map(id => {
    const p = PAGES[id], t = tierOf(id);
    const tag = t === 'ready' ? '<span class="badge badge--soft">Ready</span>'
      : t === 'connect-first' ? '<span class="badge badge--warn">Connect first</span>'
      : '<span class="badge badge--soft">Idea</span>';
    return `          <a class="tile" href="${p.file}">${icon(p.icon)}<div><div class="tl">${esc(p.label)} ${tag}</div><div class="td">${esc(p.sub)}</div></div></a>\n`;
  }).join('');

  const brandWarn = scan.brand?.set ? '' :
    `      <section class="card col-12" style="border-color:var(--warning)">
        <h3>This dashboard is still in the kit's colours, not yours</h3>
        <p class="desc">Nothing here is branded to you yet. Ask Claude: <b>&ldquo;set up my brand from my website&rdquo;</b> — it pulls your colours and logo and every page follows.</p>
      </section>
`;

  return head('home') + `
      <div class="kpirow">
${kpi('Tools connected', String(c.connected), c.connected ? 'pulling live data' : 'connect one to begin')}${kpi('Waiting in your kit', String(c.available), 'ready when you are')}${kpi('Skills installed', String(c.skills), 'things Claude can do for you')}${kpi('Pages ready to build', String(ready.length), ready.length ? 'you have the tools already' : 'connect a tool to unlock')}      </div>

      <div class="appgrid" style="margin-top:var(--s32)">

${brandWarn}        <section class="card col-12">
          <div class="card__head"><h3>Your AI, right now</h3></div>
          <p class="desc">This is the one page that is true on day one — it is built from your own machine, not from a tool you have to connect first.</p>
          <div class="kpirow" style="border:0;padding:var(--s16) 0 0">
${kpi('Connectors live', String(c.connected), scan.connected.length ? names(scan.connected.slice(0, 3)) + (scan.connected.length > 3 ? ' and more' : '') : 'none yet')}${kpi('Kits installed', String(c.kits), scan.kits.length ? scan.kits.slice(0, 2).map(k => k.label).join(', ') : 'dashboard kit only')}${kpi('Skills', String(c.skills), 'in ~/.claude/skills')}          </div>
        </section>

        <section class="card col-12">
          <div class="card__head"><h3>What you could build next</h3></div>
          <p class="desc">Every page in your left nav that is still empty. Open one and it hands you the words that build it.</p>
          <div class="nextband" style="margin-top:var(--s20)">
${cards}          </div>
        </section>

      </div>

      <p class="caption" style="margin-top:var(--s32);text-align:center">
        Built from your own Claude setup${scan.generatedAt ? ' on ' + esc(String(scan.generatedAt).slice(0, 10)) : ''}.
        Re-run <b>node app/scan-kit.mjs</b> then <b>node app/build.mjs</b> any time you connect something new.
      </p>
`;
}

function connectorsBody() {
  const on = scan.connected || [];
  const off = [];
  for (const k of Object.keys(scan.pages || {})) for (const c of scan.pages[k].available || []) off.push(c);

  const row = (c, live) =>
    `          <tr><td><b>${esc(c.label)}</b></td><td>${live
      ? '<span class="badge badge--ok">Connected</span>'
      : '<span class="badge badge--soft">In your kit</span>'}</td><td class="muted">${live
      ? 'Pulling live data' : 'Ask Claude to connect it'}</td></tr>\n`;

  return head('connectors') + `
      <div class="kpirow">
        <div class="kpi"><div class="lab">Connected</div><div class="val">${on.length}</div><div class="sub">live right now</div></div>
        <div class="kpi"><div class="lab">In your kit</div><div class="val">${off.length}</div><div class="sub">ready to connect</div></div>
      </div>

      <section class="card" style="margin-top:var(--s24);padding:0;overflow:hidden">
        <table class="table">
          <thead><tr><th>Tool</th><th>Status</th><th>What it means</th></tr></thead>
          <tbody>
${on.map(c => row(c, true)).join('')}${off.map(c => row(c, false)).join('')}          </tbody>
        </table>
      </section>

      <p class="caption" style="margin-top:var(--s20)">
        Every tool listed here has a connector skill that shipped in your workshop kit.
        Connecting one is a prompt, not a project.
      </p>
`;
}

function skillsBody() {
  const c = scan.counts;
  const kits = (scan.kits || []).map(k =>
    `          <div class="tile"><div><div class="tl">${esc(k.label)}</div><div class="td">Installed</div></div></div>\n`).join('');
  return head('skills') + `
      <div class="kpirow">
        <div class="kpi"><div class="lab">Skills installed</div><div class="val">${c.skills}</div><div class="sub">things Claude can do without being told twice</div></div>
        <div class="kpi"><div class="lab">Kits installed</div><div class="val">${c.kits}</div><div class="sub">from the workshop</div></div>
      </div>

      <section class="card" style="margin-top:var(--s24)">
        <div class="card__head"><h3>Kits on this machine</h3></div>
        <div class="nextband" style="margin-top:var(--s20)">
${kits || '          <div class="tile"><div><div class="tl">Dashboard Design Kit</div><div class="td">The one that built this</div></div></div>\n'}        </div>
      </section>
`;
}

function brandBody() {
  const b = scan.brand || {};
  return head('brand') + `
      <section class="card">
        <div class="card__head"><h3>${b.set ? 'Your brand' : 'Not set up yet'}</h3></div>
        <p class="desc">${b.set
          ? `Every page here is built from these values. Change them in <b>brand/BRAND.md</b> and rebuild — the whole dashboard follows.`
          : `This dashboard is still in the kit's default colours. Ask Claude: <b>&ldquo;set up my brand from my website&rdquo;</b> and it pulls your colours and logo, then rebuilds every page in them.`}</p>
${b.set ? `        <div class="kpirow" style="border:0;padding:var(--s20) 0 0">
          <div class="kpi"><div class="lab">Business</div><div class="val" style="font-size:22px">${esc(b.name || '—')}</div></div>
          <div class="kpi"><div class="lab">Main colour</div><div class="val" style="font-size:22px">${esc(b.primary || '—')}</div></div>
        </div>\n` : ''}      </section>
`;
}

function settingsBody() {
  return head('settings') + `
      <section class="card">
        <div class="card__head"><h3>How this is put together</h3></div>
        <p class="desc">Plain HTML files in one folder. No build pipeline, no framework, nothing to keep up to date. You own every file.</p>
        <div class="nextband" style="margin-top:var(--s20)">
          <div class="tile"><div><div class="tl">scan-kit.mjs</div><div class="td">Looks at what you have connected. Names only — never a password or a key.</div></div></div>
          <div class="tile"><div><div class="tl">build.mjs</div><div class="td">Rebuilds every page from that scan.</div></div></div>
          <div class="tile"><div><div class="tl">assets/</div><div class="td">Your colours, the shared styles and the font.</div></div></div>
        </div>
      </section>

      <section class="card" style="margin-top:var(--s20)">
        <div class="card__head"><h3>After you connect something new</h3></div>
        <p class="desc">Two commands, and the whole dashboard catches up:</p>
        <div class="prompt" style="margin-top:var(--s16)">
          <div class="prompt__box" id="p-refresh">node app/scan-kit.mjs
node app/build.mjs</div>
          <div class="prompt__row">
            <button class="btn btn--primary btn--sm" data-copy="p-refresh">Copy both</button>
            <span class="copied">Copied</span>
          </div>
        </div>
      </section>

      <section class="card" style="margin-top:var(--s20)">
        <div class="card__head"><h3>Put it online</h3></div>
        <p class="desc">This folder deploys as-is. From the kit root:</p>
        <div class="prompt" style="margin-top:var(--s16)">
          <div class="prompt__box" id="p-deploy">cd app &amp;&amp; vercel deploy --prod</div>
          <div class="prompt__row">
            <button class="btn btn--primary btn--sm" data-copy="p-deploy">Copy</button>
            <span class="copied">Copied</span>
          </div>
        </div>
      </section>
`;
}

const BUILT = { home: homeBody, connectors: connectorsBody, skills: skillsBody, brand: brandBody, settings: settingsBody };

/* ── assets ────────────────────────────────────────────────────────── */
function copyAssets() {
  mkdirSync(ASSETS, { recursive: true });
  for (const f of ['tokens.css', 'base.css', 'charts.js', 'icons.js']) {
    const src = join(TPL, f);
    if (existsSync(src)) cpSync(src, join(ASSETS, f));
  }
  const fonts = join(TPL, 'fonts');
  if (existsSync(fonts)) cpSync(fonts, join(ASSETS, 'fonts'), { recursive: true });

  /* The production counterpart to templates/mode.js. Same job — decide light or
     dark — but with no buttons on the page. The gallery needs a visible toggle
     so you can compare the two; a real dashboard just follows the machine. */
  writeFileSync(join(ASSETS, 'mode.js'),
`/* Sets data-mode from the operating system, and remembers a manual override if
   one was ever set. No visible control — a production app follows the machine. */
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('mode'); } catch (e) {}
  var apply = function (m) { root.setAttribute('data-mode', m); };
  if (saved === 'light' || saved === 'dark') { apply(saved); return; }
  var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  apply(mq && mq.matches ? 'dark' : 'light');
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function (e) { apply(e.matches ? 'dark' : 'light'); });
  }
})();
`);

  writeFileSync(join(ASSETS, 'copy.js'),
`/* One job: put a prompt on the clipboard. No framework, no dependency.

   The async clipboard API is blocked in more places than you would think —
   an iframe, a page opened straight off the filesystem, a browser that has
   not been granted permission. Every one of those paths falls through to the
   old textarea trick, and the button tells the truth either way. A silent
   no-op here would break the one interaction this whole dashboard is built
   around. */
(function () {
  function flash(btn, ok) {
    var row = btn.closest('.prompt__row') || btn.parentNode;
    var note = row.querySelector('.copied');
    if (note) note.textContent = ok ? 'Copied' : 'Press Cmd+C to copy';
    row.classList.add('is-copied');
    setTimeout(function () { row.classList.remove('is-copied'); }, 2400);
  }

  function fallback(text) {
    var t = document.createElement('textarea');
    t.value = text;
    t.setAttribute('readonly', '');
    t.style.position = 'fixed';
    t.style.top = '-1000px';
    document.body.appendChild(t);
    t.select();
    t.setSelectionRange(0, t.value.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(t);
    return ok;
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var el = document.getElementById(b.getAttribute('data-copy'));
    if (!el) return;
    var text = el.innerText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { flash(b, true); },
        function () { flash(b, fallback(text)); }
      );
      return;
    }
    flash(b, fallback(text));
  });
})();
`);
}

/* ── go ────────────────────────────────────────────────────────────── */
console.log('\nBuilding your dashboard...\n');
copyAssets();

let built = 0, stubs = 0;
for (const id of Object.keys(PAGES)) {
  const p = PAGES[id];
  const body = BUILT[id] ? BUILT[id]() : stub(id);
  writeFileSync(join(OUT, p.file), shell(id, body));
  BUILT[id] ? built++ : stubs++;
}

/* Anything the scan says is ready gets called out, because that is the bit an
   attendee can act on in the next five minutes. */
const ready = Object.keys(PAGES).filter(id => !PAGES[id].built && tierOf(id) === 'ready');

console.log(`  ${built + stubs} pages written into app/`);
console.log(`  ${built} built, ${stubs} waiting for you`);
if (ready.length) console.log(`  Ready to build right now: ${ready.map(i => PAGES[i].label).join(', ')}`);
if (!scan.brand?.set) console.log(`  Heads up: your brand is not set, so this is still in the kit's colours.`);
console.log(`\n  Open it:  open app/index.html`);
console.log(`  Put it online:  cd app && vercel deploy --prod\n`);
