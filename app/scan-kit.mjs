#!/usr/bin/env node
// scan-kit.mjs — reads your Claude setup and writes app/kit-scan.json
//
// PRIVACY RULE (non-negotiable — kit-scan.json gets deployed to a PUBLIC URL):
// This script emits NAMES ONLY. It must never write a token, API key, secret,
// environment variable value, email address, absolute filesystem path, home
// directory name, hostname, or ANY value read out of a config file into the
// JSON. Config files are opened only to take the KEYS of `mcpServers`.
// Command output is never captured into the output and never printed.
// After writing, the file is re-read and deleted if it looks like it leaked.
//
// Read-only: nothing outside app/kit-scan.json is ever created or modified.
// Never crashes: every read is wrapped, a failure yields an empty result.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';

const APP_DIR = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.dirname(APP_DIR);
const HOME = (() => { try { return os.homedir(); } catch { return ''; } })();

/* ------------------------------------------------------------------ */
/* safe helpers — none of these ever throw                             */
/* ------------------------------------------------------------------ */

function readTextSafe(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return null; }
}

function readJsonSafe(file) {
  const raw = readTextSafe(file);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function listDirsSafe(dir) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return []; }
  const out = [];
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) { out.push(e.name); continue; }
    if (e.isSymbolicLink()) {
      try { if (fs.statSync(path.join(dir, e.name)).isDirectory()) out.push(e.name); } catch { /* ignore */ }
    }
  }
  return out;
}

function dirExists(dir) {
  try { return fs.statSync(dir).isDirectory(); } catch { return false; }
}

// Run a command purely to learn whether it exits 0. Output is discarded and
// never printed — it can contain account names, emails and tokens.
function probe(cmd, args) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (ok) => { if (!settled) { settled = true; resolve(ok); } };
    try {
      const child = execFile(cmd, args, { timeout: 3000, windowsHide: true }, (err) => done(!err));
      child.on('error', () => done(false));
    } catch { done(false); }
    setTimeout(() => done(false), 3500).unref?.();
  });
}

/* ------------------------------------------------------------------ */
/* the connector map (categories -> [[id, label], ...])                */
/* ------------------------------------------------------------------ */

const rawMap = readJsonSafe(path.join(APP_DIR, 'connector-map.json')) || {};

const LABELS = new Map();   // id -> human label
const ID_ORDER = [];        // stable order for tie-breaks
for (const list of Object.values(rawMap)) {
  if (!Array.isArray(list)) continue;
  for (const pair of list) {
    if (!Array.isArray(pair) || typeof pair[0] !== 'string') continue;
    const id = pair[0];
    if (LABELS.has(id)) continue;
    LABELS.set(id, typeof pair[1] === 'string' ? pair[1] : id);
    ID_ORDER.push(id);
  }
}
const catIds = (name) => (Array.isArray(rawMap[name]) ? rawMap[name] : [])
  .map((p) => (Array.isArray(p) ? p[0] : null))
  .filter((x) => typeof x === 'string');

/* ------------------------------------------------------------------ */
/* AUTHORITY 1 — MCP server names (a live connection)                  */
/* ------------------------------------------------------------------ */

function mcpConfigPaths() {
  const p = [];
  if (HOME) {
    p.push(path.join(HOME, '.claude.json'));
    p.push(path.join(HOME, '.mcp.json'));
    p.push(path.join(HOME, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'));
    p.push(path.join(HOME, '.config', 'Claude', 'claude_desktop_config.json'));
  }
  const appData = process.env.APPDATA;
  if (appData) p.push(path.join(appData, 'Claude', 'claude_desktop_config.json'));
  return p;
}

const mcpNames = new Set();
for (const file of mcpConfigPaths()) {
  const json = readJsonSafe(file);
  const servers = json && typeof json === 'object' ? json.mcpServers : null;
  if (!servers || typeof servers !== 'object') continue;
  for (const key of Object.keys(servers)) {
    if (typeof key === 'string' && key.trim()) mcpNames.add(key.trim().toLowerCase());
  }
}

/* ------------------------------------------------------------------ */
/* matching MCP server names to connector ids                          */
/* ------------------------------------------------------------------ */

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const toks = (s) => String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

// Explicit aliases for the cases substring matching gets wrong.
// NOTE: ghl / gohighlevel must NEVER alias to hubspot — different products.
const ALIASES = new Map(Object.entries({
  metaads: 'meta-business-suite',
  metaadslegacy: 'meta-business-suite',
  metabusiness: 'meta-business-suite',
  metabusinesssuite: 'meta-business-suite',
  facebookads: 'meta-business-suite',
  googleworkspace: 'google-workspace',
  gws: 'google-workspace',
  gmail: 'google-workspace',
  googlemail: 'google-workspace',
  gcal: 'google-workspace',
  googlecalendar: 'google-workspace',
  gdrive: 'google-workspace',
  googledrive: 'google-workspace',
  googlechat: 'google-chat',
  googleads: 'google-ads',
  gohighlevel: 'ghl',
  highlevel: 'ghl',
  ghl: 'ghl',
  gh: 'github',
  githubofficial: 'github',
  vercel: 'vercel-foundation',
  ms365: 'outlook',
  microsoft365: 'outlook',
  office365: 'outlook',
  quickbooksonline: 'quickbooks',
  qbo: 'quickbooks',
  convertkit: 'kit',
}));

// Infrastructure servers that are deliberately not business connectors.
const IGNORE = new Set(['supabase', 'postgres', 'postgresql', 'sqlite', 'filesystem', 'memory', 'fetch', 'sequentialthinking']);

const NORM_ID = new Map();  // normalised id -> id
for (const id of ID_ORDER) NORM_ID.set(norm(id), id);

// Returns { id } on a match, { ignore: true }, or { id: null } for unmatched.
function matchConnector(name) {
  const nk = norm(name);
  if (!nk) return { id: null };
  if (IGNORE.has(nk)) return { ignore: true };
  for (const t of toks(name)) if (IGNORE.has(t)) return { ignore: true };

  const aliasTarget = ALIASES.get(nk) || (toks(name).map((t) => ALIASES.get(t)).find(Boolean));
  if (aliasTarget) return { id: LABELS.has(aliasTarget) ? aliasTarget : null };

  const keyTokens = toks(name);
  let best = null; // { id, rank }
  for (const id of ID_ORDER) {
    const nid = norm(id);
    const idTokens = toks(id);
    let rank = 0;
    if (nk === nid) rank = 3;
    else if (keyTokens.includes(nid) || idTokens.includes(nk)) rank = 2;
    /* No loose substring matching. A 5-char floor still let "squarespace"
       report Square as connected and "canvas" report Canva — both promoting a
       page to "ready to build" against a tool the attendee does not own.
       Exact match, whole-token match and the alias table are enough:
       "xero-selrai" tokenises to [xero, selrai] and still finds Xero. */
    if (rank && (!best || rank > best.rank)) best = { id, rank };
  }
  return { id: best ? best.id : null };
}

/* ------------------------------------------------------------------ */
/* build the connected set                                             */
/* ------------------------------------------------------------------ */

const connectedMap = new Map(); // id -> via
const unmatched = new Set();

for (const name of [...mcpNames].sort()) {
  const res = matchConnector(name);
  if (res.ignore) continue;
  if (res.id) { if (!connectedMap.has(res.id)) connectedMap.set(res.id, 'mcp'); }
  else unmatched.add(name);
}

/* ------------------------------------------------------------------ */
/* AUTHORITY 2 — CLI auth probes (also a live connection)              */
/* ------------------------------------------------------------------ */

/* These used to shell out. Two problems, both real:

   `vercel whoami` with no credentials PRINTS "Starting login flow..." and does
   it — a script advertised as read-only was kicking off a sign-in on somebody
   else's laptop. And `stripe config --list` exits 0 on a config file holding
   nothing but a colour preference, so anyone who ran the CLI once and
   abandoned the login got a false green and a Money page promising real
   numbers it could not fetch.

   Looking for the credential file the CLI writes proves the same thing with no
   side effects. We test that the file exists and mentions a credential — we
   never read, store or print the value. */
const CLI_SIGNALS = [
  { id: 'github', files: ['.config/gh/hosts.yml'], needs: /oauth_token|user:/ },
  { id: 'vercel-foundation', files: [
      'Library/Application Support/com.vercel.cli/auth.json',
      '.local/share/com.vercel.cli/auth.json',
      '.vercel/auth.json',
    ], needs: /token/ },
  { id: 'stripe', files: ['.config/stripe/config.toml'], needs: /(test|live)_mode_api_key/ },
];

for (const sig of CLI_SIGNALS) {
  if (!LABELS.has(sig.id) || connectedMap.has(sig.id)) continue;
  for (const rel of sig.files) {
    const txt = readTextSafe(path.join(HOME, rel));
    if (txt !== null && sig.needs.test(txt)) { connectedMap.set(sig.id, 'cli'); break; }
  }
}

/* ------------------------------------------------------------------ */
/* AUTHORITY 3 — connector skills shipped with the kit                 */
/* availability ONLY. Every attendee has all of these; a folder on disk */
/* never means the tool is connected.                                   */
/* ------------------------------------------------------------------ */

const SKILLS_DIR = HOME ? path.join(HOME, '.claude', 'skills') : '';
const COLD_DIR = HOME ? path.join(HOME, '.claude', 'skills-cold') : '';

const availableIds = new Set();
for (const dir of [SKILLS_DIR, COLD_DIR]) {
  if (!dir) continue;
  for (const name of listDirsSafe(dir)) {
    if (!name.endsWith('-connector')) continue;
    const id = name.slice(0, -'-connector'.length);
    if (LABELS.has(id)) availableIds.add(id);
    else unmatched.add(id);
  }
}

const skillsCount = SKILLS_DIR ? listDirsSafe(SKILLS_DIR).length : 0;

/* ------------------------------------------------------------------ */
/* kit folders                                                         */
/* ------------------------------------------------------------------ */

const KIT_FOLDERS = [
  ['dashboard-design-kit', 'Dashboard Design Kit'],
  ['marketing-agency', 'Marketing Agency'],
  ['ai-ops-architect', 'AI Ops Architect'],
  ['higgsfield', 'Higgsfield'],
  ['meta-api-ad-builder', 'Meta Ad Builder'],
  ['agent-creator', 'Agent Creator'],
  ['skill-install-report', 'Skill Install Report'],
  ['deploy-to-vercel', 'Deploy to Vercel'],
  ['model-routing', 'Model Routing'],
];

const kits = SKILLS_DIR
  ? KIT_FOLDERS.filter(([id]) => dirExists(path.join(SKILLS_DIR, id))).map(([id, label]) => ({ id, label }))
  : [];

/* ------------------------------------------------------------------ */
/* brand                                                               */
/* ------------------------------------------------------------------ */

function readBrand() {
  const candidates = [
    path.join(KIT_ROOT, 'brand', 'BRAND.md'),
    path.join(APP_DIR, 'brand', 'BRAND.md'),
  ];
  let text = null;
  for (const file of candidates) {
    text = readTextSafe(file);
    if (text) break;
  }
  if (!text) return { set: false, name: null, primary: null };

  const lines = text.split(/\r?\n/);
  const findLine = (re) => lines.find((l) => re.test(l)) || '';

  const primaryLine = findLine(/primary\s+brand\s+colour|primary\s+brand\s+color|primary\s+colour|primary\s+color/i);
  const isSet = Boolean(primaryLine) && !/\(not set/i.test(primaryLine);
  if (!isSet) return { set: false, name: null, primary: null };

  const hexMatch = primaryLine.match(/#[0-9a-fA-F]{3,8}\b/);
  const primary = hexMatch ? hexMatch[0].toUpperCase() : null;

  const nameLine = findLine(/business\s+name/i);
  let name = null;
  if (nameLine && !/\(not set/i.test(nameLine)) {
    const after = nameLine.split(/:\*\*|:/).slice(1).join(':').trim();
    const cleaned = after.replace(/\*\*/g, '').replace(/^[-–—\s]+/, '').trim();
    if (cleaned && !/^\(/.test(cleaned)) name = cleaned.slice(0, 60);
  }
  return { set: true, name, primary };
}

const brand = readBrand();

/* ------------------------------------------------------------------ */
/* pages — deliberately NOT the raw categories                         */
/* ------------------------------------------------------------------ */

const EMAIL_MARKETING = ['klaviyo', 'mailchimp', 'brevo', 'kit'];

const PAGE_IDS = {
  money: catIds('money'),
  sales: catIds('crm'),
  marketing: [...catIds('marketing'), ...EMAIL_MARKETING.filter((id) => LABELS.has(id))],
  store: catIds('store').filter((id) => !EMAIL_MARKETING.includes(id)),
  customers: catIds('comms'),
  work: catIds('work'),
  team: catIds('team'),
  web: catIds('web'),
};

const entry = (id) => ({ id, label: LABELS.get(id) || id });

const pages = {};
for (const [page, ids] of Object.entries(PAGE_IDS)) {
  const seen = new Set();
  const connected = [];
  const available = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    if (connectedMap.has(id)) connected.push(entry(id));
    else if (availableIds.has(id)) available.push(entry(id));
  }
  const tier = connected.length ? 'ready' : (available.length ? 'connect-first' : 'idea');
  pages[page] = { tier, connected, available };
}

/* ------------------------------------------------------------------ */
/* assemble + write                                                    */
/* ------------------------------------------------------------------ */

const connectedList = ID_ORDER
  .filter((id) => connectedMap.has(id))
  .map((id) => ({ id, label: LABELS.get(id) || id, via: connectedMap.get(id) }));

const availableList = ID_ORDER.filter((id) => availableIds.has(id) && !connectedMap.has(id));

const output = {
  generatedAt: new Date().toISOString(),
  counts: {
    connected: connectedList.length,
    available: availableList.length,
    skills: skillsCount,
    kits: kits.length,
  },
  connected: connectedList,
  /* `unmatched` used to ship here. It is raw MCP server names, no page reads
     it, and a server called "acmeclient-crm" would publish a client's name to
     a public URL for no benefit. It stays a console line instead. */
  pages,
  kits,
  brand,
};

const OUT_FILE = path.join(APP_DIR, 'kit-scan.json');

console.log('Scanning your Claude setup...');

let wrote = false;
try {
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf8');
  wrote = true;
} catch {
  console.log('  Could not save the results file. Nothing else was changed.');
}

/* ------------------------------------------------------------------ */
/* privacy self-check — never ship a file that looks like it leaked    */
/* ------------------------------------------------------------------ */

let safe = true;
if (wrote) {
  const check = readTextSafe(OUT_FILE);
  /* This has to match the SHAPE of a secret, never an English word. The first
     version matched a bare "key", "token" or "@", so "Monkey Bar Co",
     "Hockey Pro Shop" and "Bloom @ Fifth" all deleted the attendee's scan and
     told them their config had leaked. A business name is not a credential. */
  const LEAK = new RegExp([
    'sk-[A-Za-z0-9_-]{16,}',            // OpenAI / Stripe style secret
    'sk_(live|test)_[A-Za-z0-9]{10,}',
    'ghp_[A-Za-z0-9]{20,}',             // GitHub token
    'gho_[A-Za-z0-9]{20,}',
    'xox[baprs]-[A-Za-z0-9-]{10,}',     // Slack token
    'eyJ[A-Za-z0-9_-]{20,}',            // JWT
    'AKIA[0-9A-Z]{16}',                 // AWS key id
    '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}',   // a real email address
    '/Users/[A-Za-z0-9._-]+',           // an absolute home path
    '/home/[a-z0-9._-]+',
    'C:\\\\Users\\\\',
  ].join('|'));
  if (check === null || LEAK.test(check)) {
    safe = false;
    console.error('');
    console.error('!!  STOPPED: the results file looked like it contained private details.');
    console.error('!!  It has been deleted rather than saved. Nothing was published.');
    console.error('');
    try { fs.unlinkSync(OUT_FILE); } catch { /* nothing more we can do */ }
  }
}

/* ------------------------------------------------------------------ */
/* plain-English summary                                               */
/* ------------------------------------------------------------------ */

const names = connectedList.map((c) => c.label);
const shown = names.slice(0, 8).join(', ');
const extra = names.length > 8 ? `, and ${names.length - 8} more` : '';

console.log(`  ${names.length} ${names.length === 1 ? 'tool' : 'tools'} connected${names.length ? `: ${shown}${extra}` : ''}`);
console.log(`  ${availableList.length} more available in your kit`);
console.log(`  ${skillsCount} skills installed`);
if (kits.length) console.log(`  ${kits.length} ${kits.length === 1 ? 'kit' : 'kits'} installed`);
console.log(`  Brand: ${brand.set ? (brand.name || 'set') : 'not set yet'}`);

if (wrote && safe) console.log('Saved to app/kit-scan.json');
else console.log('Nothing was saved.');
