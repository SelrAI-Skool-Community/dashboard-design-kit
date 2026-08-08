// resolver key sk-mx2ajx (skills-index lookup; keep)
//
// Selr AI — the icon set. One stroke weight, one grid, one corner treatment.
// 24x24 viewBox, 1.6 stroke, round caps and joins. Drawn to sit on the same
// optical weight as Manrope Medium so an icon never shouts next to its label.
//
// Usage:  Icons.svg('search')            → <svg class="icon">…</svg>
//         Icons.svg('search', 'lg')      → larger size class
//         Icons.list()                   → every name, grouped

const P = {
  /* navigation */
  home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  dashboard:'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  menu:'M4 6h16M4 12h16M4 18h16',
  'menu-left':'M4 6h16M4 12h10M4 18h16',
  close:'M6 6l12 12M18 6L6 18',
  plus:'M12 5v14M5 12h14',
  minus:'M5 12h14',
  'chevron-up':'M6 15l6-6 6 6',
  'chevron-down':'M6 9l6 6 6-6',
  'chevron-left':'M15 6l-6 6 6 6',
  'chevron-right':'M9 6l6 6-6 6',
  'arrow-right':'M5 12h13M13 6l6 6-6 6',
  'arrow-left':'M19 12H6M11 6l-6 6 6 6',
  'arrow-up':'M12 19V6M6 12l6-6 6 6',
  'arrow-down':'M12 5v13M6 12l6 6 6-6',
  'arrow-up-right':'M7 17L17 7M9 7h8v8',
  'external-link':'M14 4h6v6M20 4l-9 9M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6',
  expand:'M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5',
  collapse:'M9 4v5H4M15 20v-5h5M20 9h-5V4M4 15h5v5',
  sidebar:'M3 4h18v16H3zM9 4v16',
  'more-horizontal':'M6 12h.01M12 12h.01M18 12h.01',
  'more-vertical':'M12 6v.01M12 12v.01M12 18v.01',

  /* actions */
  search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5',
  filter:'M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4',
  sort:'M8 9l4-4 4 4M8 15l4 4 4-4',
  edit:'M4 20h4l10-10-4-4L4 16zM14 6l4 4',
  trash:'M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13',
  copy:'M9 9h10v10H9zM5 15V5h10',
  download:'M12 4v11M8 11l4 4 4-4M5 20h14',
  upload:'M12 20V9M8 13l4-4 4 4M5 4h14',
  share:'M17 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM7 15a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM9.2 11.3l5.6-2.6M9.2 12.7l5.6 2.6',
  refresh:'M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5',
  save:'M5 4h11l3 3v13H5zM8 4v5h7M8 14h8v6H8z',
  print:'M7 9V4h10v5M7 17H5V9h14v8h-2M7 14h10v6H7z',
  link:'M10 14a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7L11.5 7M14 10a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7L12.5 17',
  duplicate:'M8 8h11v11H8zM5 16V5h11',
  archive:'M4 7h16v3H4zM6 10v10h12V10M10 14h4',

  /* status */
  check:'M5 12.5l4.5 4.5L19 7',
  'check-circle':'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 12l2.5 2.5 4.5-5',
  'alert-circle':'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v5M12 16.5v.01',
  'alert-triangle':'M12 4L2.5 20h19zM12 10v4M12 17.5v.01',
  info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 7.5v.01',
  help:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .9-1 1.6v.3M12 16.5v.01',
  clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  loader:'M12 3v4M12 17v4M5 12H1M23 12h-4M6.6 6.6L4 4M17.4 6.6L20 4M6.6 17.4L4 20M17.4 17.4L20 20',
  shield:'M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z',
  lock:'M5 10h14v10H5zM8 10V7a4 4 0 0 1 8 0v3',
  unlock:'M5 10h14v10H5zM8 10V7a4 4 0 0 1 7.5-2',
  eye:'M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  'eye-off':'M4 4l16 16M9.5 9.6A2.5 2.5 0 0 0 12 14.5c.7 0 1.3-.3 1.8-.7M6.5 6.9C3.9 8.5 2 12 2 12s3.6 6 10 6c1.8 0 3.4-.5 4.7-1.2M20.4 14.6C21.5 13.4 22 12 22 12s-3.6-6-10-6c-.7 0-1.3.1-2 .2',

  /* data and charts */
  chart:'M4 18V9M10 18V5M16 18v-6M4 21h16',
  'chart-line':'M4 20V4M4 20h16M7 15l4-5 3 3 5-6',
  'chart-pie':'M12 3v9h9a9 9 0 1 1-9-9z',
  'chart-area':'M4 20V4M4 20h16M6 16l4-4 3 2 5-6v8z',
  trending:'M4 16l5-5 3 3 7-7M15 7h5v5',
  'trending-down':'M4 8l5 5 3-3 7 7M15 17h5v-5',
  table:'M3 5h18v14H3zM3 10h18M9 10v9',
  grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  list:'M8 6h12M8 12h12M8 18h12M4 6v.01M4 12v.01M4 18v.01',
  layers:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  target:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 11v2',
  activity:'M3 12h4l3 8 4-16 3 8h4',
  gauge:'M4 18a8 8 0 1 1 16 0M12 18l4-5',

  /* money */
  wallet:'M3 7a2 2 0 0 1 2-2h12v4M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7H5a2 2 0 0 1-2-2zM17 14v.01',
  card:'M3 6h18v12H3zM3 10h18M6.5 14.5h3',
  dollar:'M12 3v18M16 7.5A3.5 3.5 0 0 0 12.5 5h-1a3 3 0 0 0 0 6h1a3 3 0 0 1 0 6h-1A3.5 3.5 0 0 1 8 16.5',
  receipt:'M6 3h12v18l-2-1.5-2 1.5-2-1.5L10 21l-2-1.5L6 21zM9.5 8h5M9.5 12h5',
  bank:'M3 9l9-5 9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18',
  invoice:'M6 3h9l3 3v15H6zM9 10h6M9 14h6M9 18h3',
  percent:'M6 18L18 6M7.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM16.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',

  /* people */
  user:'M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20a7 7 0 0 1 14 0',
  users:'M9 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M18 20a6 6 0 0 0-2-4.5',
  'user-plus':'M9 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM2 20a7 7 0 0 1 14 0M19 8v6M16 11h6',
  team:'M12 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 14a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM18 14a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM12 8v3M12 11H7.5a1.5 1.5 0 0 0-1.5 1.5V14M12 11h4.5a1.5 1.5 0 0 1 1.5 1.5V14',
  building:'M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M15 10h3a2 2 0 0 1 2 2v9M8 8h3M8 12h3M8 16h3M3 21h18',

  /* comms */
  mail:'M3 5h18v14H3zM3 7l9 6 9-6',
  send:'M21 3L3 10.5l7.5 3L14 21z',
  chat:'M4 5h16v11H9l-5 4z',
  bell:'M18 8a6 6 0 1 0-12 0c0 7-2 9-2 9h16s-2-2-2-9M10.5 21h3',
  phone:'M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z',
  megaphone:'M4 10v4a1 1 0 0 0 1 1h3l8 5V4L8 9H5a1 1 0 0 0-1 1zM19 9a4 4 0 0 1 0 6',

  /* files */
  file:'M6 3h8l4 4v14H6zM14 3v4h4',
  folder:'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  image:'M3 5h18v14H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM4 17l5-5 4 3 3-2 4 4',
  video:'M3 6h12v12H3zM15 10l6-3v10l-6-3z',
  attachment:'M17 8l-7.5 7.5a3 3 0 0 0 4.2 4.2L21 12a5 5 0 0 0-7-7l-7 7',
  book:'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13',

  /* settings and system */
  settings:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4',
  sliders:'M4 8h9M17 8h3M4 16h3M11 16h9M15 5v6M9 13v6',
  toggle:'M8 7h8a5 5 0 0 1 0 10H8A5 5 0 0 1 8 7zM8 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  power:'M12 4v8M7.5 7a7 7 0 1 0 9 0',
  logout:'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h9',
  login:'M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M14 8l4 4-4 4M18 12H9',
  key:'M15 4a5 5 0 1 1-4.5 7.2L4 18v3h3l1-1v-2h2v-2h2l1.4-1.4A5 5 0 0 1 15 4z',
  database:'M12 3c4 0 7 1.3 7 3s-3 3-7 3-7-1.3-7-3 3-3 7-3zM5 6v12c0 1.7 3 3 7 3s7-1.3 7-3V6',
  server:'M4 4h16v6H4zM4 14h16v6H4zM7.5 7v.01M7.5 17v.01',
  cloud:'M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 18z',
  code:'M9 8l-4 4 4 4M15 8l4 4-4 4',
  terminal:'M4 4h16v16H4zM8 9l3 3-3 3M13 15h4',
  zap:'M13 3L5 14h6l-1 7 8-11h-6z',
  plug:'M8 3v6M16 3v6M6 9h12v3a6 6 0 0 1-12 0zM12 18v3',
  workflow:'M6 4h5v4H6zM13 16h5v4h-5zM8.5 8v4a2 2 0 0 0 2 2h5',

  /* time and place */
  calendar:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  'calendar-check':'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9.5 14.5l2 2 3.5-4',
  pin:'M12 3a6 6 0 0 1 6 6c0 4.5-6 12-6 12S6 13.5 6 9a6 6 0 0 1 6-6zM12 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  globe:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.6-3.5-9s1-6.5 3.5-9z',
  flag:'M5 21V4h13l-2.5 4L18 12H5',
  star:'M12 4l2.5 5.2 5.5.8-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.5-.8z',
  bookmark:'M6 3h12v18l-6-4-6 4z',
  heart:'M12 20S4 14.7 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 14.7 12 20 12 20z'
};

const GROUPS = {
  Navigation: ['home','dashboard','menu','menu-left','close','plus','minus','chevron-up','chevron-down','chevron-left','chevron-right','arrow-right','arrow-left','arrow-up','arrow-down','arrow-up-right','external-link','expand','collapse','sidebar','more-horizontal','more-vertical'],
  Actions: ['search','filter','sort','edit','trash','copy','download','upload','share','refresh','save','print','link','duplicate','archive'],
  Status: ['check','check-circle','alert-circle','alert-triangle','info','help','clock','loader','shield','lock','unlock','eye','eye-off'],
  'Data and charts': ['chart','chart-line','chart-pie','chart-area','trending','trending-down','table','grid','list','layers','target','activity','gauge'],
  Money: ['wallet','card','dollar','receipt','bank','invoice','percent'],
  People: ['user','users','user-plus','team','building'],
  Communication: ['mail','send','chat','bell','phone','megaphone'],
  Files: ['file','folder','image','video','attachment','book'],
  'Settings and system': ['settings','sliders','toggle','power','logout','login','key','database','server','cloud','code','terminal','zap','plug','workflow'],
  'Time and place': ['calendar','calendar-check','pin','globe','flag','star','bookmark','heart']
};

function path(name) { return P[name] || ''; }

function svg(name, size) {
  const d = path(name);
  if (!d) return '';
  return `<svg class="icon${size ? ' ' + size : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
}
// Solid style: same geometry, thicker stroke and a soft fill. Keeps one source
// of truth instead of a second hand-drawn set that drifts.
function solid(name, size) {
  const d = path(name);
  if (!d) return '';
  return `<svg class="icon${size ? ' ' + size : ''}" viewBox="0 0 24 24" aria-hidden="true"
    style="fill:currentColor;fill-opacity:.18;stroke-width:2"><path d="${d}"/></svg>`;
}
function list() { return GROUPS; }
function names() { return Object.keys(P); }

window.Icons = { svg, solid, path, list, names, GROUPS };
