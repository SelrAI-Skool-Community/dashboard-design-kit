// GENERATED from tokens/source.mjs — do not hand-edit. Run: node tokens/build.mjs
//
// Paste the whole file as the `code` argument of use_figma (or into a Figma plugin
// console) with the target fileKey. Idempotent: re-running updates values in place.

const RAMPS = {
  "Purple/100": "#F2EDFF",
  "Purple/200": "#D5C4FF",
  "Purple/400": "#9B73FF",
  "Purple/500": "#7E4BFF",
  "Purple/600": "#6736E2",
  "Purple/700": "#5024C0",
  "Purple/800": "#3C159E",
  "Purple/900": "#230670",
  "Gray/Cloud": "#EDEFF7",
  "Gray/Smoke": "#D3D6E0",
  "Gray/Steel": "#BCBFCC",
  "Gray/Space": "#9DA2B3",
  "Gray/Graphite": "#6E7180",
  "Gray/Arsenic": "#40424D",
  "Gray/Phantom": "#1E1E24",
  "Gray/Black": "#0A0A0A",
  "Gray/True": "#000000",
  "Neutral/100": "#F8F8F8",
  "Neutral/200": "#EDEDED",
  "Neutral/400": "#ABABAB",
  "Success/base": "#26B759",
  "Success/mid": "#B5FFCF",
  "Success/tint": "#E0FFEB",
  "Warning/base": "#F39A46",
  "Warning/mid": "#F9BE85",
  "Warning/tint": "#FFE9D4",
  "Danger/base": "#FF1B1B",
  "Danger/mid": "#FF8A8A",
  "Danger/tint": "#FFE0E0",
  "White": "#FFFFFF",
  "Black": "#0A0A0A"
};
const SEMANTIC = {
  "Background/Surface/primary": [
    "Gray/Cloud",
    "Gray/Black"
  ],
  "Background/Surface/secondary": [
    "White",
    "Gray/Phantom"
  ],
  "Background/Surface/tertiary": [
    "Neutral/100",
    "Gray/Arsenic"
  ],
  "Background/Surface/inverted": [
    "Gray/Black",
    "White"
  ],
  "Background/Surface/accent": [
    "Purple/600",
    "Purple/500"
  ],
  "Background/Surface/danger": [
    "Danger/tint",
    "Gray/Phantom"
  ],
  "Background/Button/primary-active": [
    "Purple/600",
    "Purple/600"
  ],
  "Background/Button/primary-hover": [
    "Purple/700",
    "Purple/700"
  ],
  "Background/Button/primary-pressed": [
    "Purple/800",
    "Purple/800"
  ],
  "Background/Button/primary-disabled": [
    "Neutral/200",
    "Gray/Arsenic"
  ],
  "Background/Button/secondary-active": [
    "White",
    "Gray/Phantom"
  ],
  "Background/Button/secondary-hover": [
    "Purple/100",
    "Purple/900"
  ],
  "Background/Button/secondary-pressed": [
    "Purple/200",
    "Purple/800"
  ],
  "Background/Button/secondary-disabled": [
    "Neutral/200",
    "Gray/Arsenic"
  ],
  "Background/Chip/active": [
    "White",
    "Gray/Phantom"
  ],
  "Background/Chip/hover": [
    "Gray/Cloud",
    "Gray/Arsenic"
  ],
  "Background/Chip/pressed": [
    "Gray/Smoke",
    "Gray/Graphite"
  ],
  "Background/Chip/selected": [
    "Gray/Black",
    "White"
  ],
  "Background/Indicator/primary": [
    "Purple/600",
    "Purple/400"
  ],
  "Background/Indicator/black": [
    "Gray/Black",
    "White"
  ],
  "Background/Indicator/white": [
    "White",
    "Gray/Phantom"
  ],
  "Typography/primary": [
    "Gray/Black",
    "White"
  ],
  "Typography/secondary": [
    "Gray/Arsenic",
    "Gray/Steel"
  ],
  "Typography/tertiary": [
    "Gray/Graphite",
    "Gray/Space"
  ],
  "Typography/disabled": [
    "Gray/Steel",
    "Gray/Graphite"
  ],
  "Typography/accent": [
    "Purple/600",
    "Purple/400"
  ],
  "Typography/primary-inverted": [
    "White",
    "Gray/Black"
  ],
  "Typography/secondary-inverted": [
    "Gray/Smoke",
    "Gray/Graphite"
  ],
  "Border/primary": [
    "Gray/Smoke",
    "Gray/Arsenic"
  ],
  "Border/secondary": [
    "Gray/Cloud",
    "Gray/Phantom"
  ],
  "Border/tertiary": [
    "Gray/Steel",
    "Gray/Graphite"
  ],
  "Charts/Context/primary-1": [
    "Purple/100",
    "Purple/900"
  ],
  "Charts/Context/primary-2": [
    "Purple/200",
    "Purple/800"
  ],
  "Charts/Context/primary-3": [
    "Purple/400",
    "Purple/500"
  ],
  "Charts/Context/primary-4": [
    "Purple/600",
    "Purple/600"
  ],
  "Charts/Context/primary-5": [
    "Purple/800",
    "Purple/400"
  ],
  "Charts/Context/primary-alt": [
    "Purple/700",
    "Purple/200"
  ],
  "Charts/Context/secondary": [
    "Success/base",
    "Success/base"
  ],
  "Charts/Context/tertiary": [
    "Warning/base",
    "Warning/base"
  ],
  "Charts/Context/quarterly": [
    "Gray/Space",
    "Gray/Graphite"
  ],
  "Charts/Context/basic": [
    "Gray/Cloud",
    "Gray/Arsenic"
  ],
  "Charts/Context/negative": [
    "Danger/base",
    "Danger/base"
  ]
};
const SPACING = [0,2,4,6,8,10,12,16,20,24,28,32,40,48,56];
const RADIUS = {
  "3XS": 2,
  "2XS": 4,
  "XS": 6,
  "S": 8,
  "M": 12,
  "L": 16,
  "XL": 20,
  "2XL": 24,
  "3XL": 32,
  "4XL": 40,
  "Full": 360
};
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
         expected: 99 };
