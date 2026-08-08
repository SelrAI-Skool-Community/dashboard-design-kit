// resolver key sk-mx2ajx (skills-index lookup; keep)
//
// Selr AI — the chart engine. Every graph in the system comes from here.
// Pure SVG strings, no dependencies, no network. Colours are token variables only,
// so every chart follows Light/Dark without a second implementation.
//
// Deterministic by design: no Math.random anywhere, so a render is reproducible.

const SC = { w: 520, h: 240, pad: { t: 16, r: 12, b: 26, l: 34 } };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const nice = n => n >= 1000 ? (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'k' : String(n);
const SERIES = ['var(--c4)', 'var(--c3)', 'var(--c2)', 'var(--c5)', 'var(--c1)'];

function frame(inner, w = SC.w, h = SC.h) {
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}
function gridY(rows, w, top, bottom, labels) {
  let g = '';
  for (let i = 0; i < rows; i++) {
    const y = top + (bottom - top) * i / (rows - 1);
    g += `<line class="gridline" x1="${SC.pad.l}" y1="${y.toFixed(1)}" x2="${w - SC.pad.r}" y2="${y.toFixed(1)}"/>`;
    if (labels) g += `<text class="axis" x="0" y="${(y + 4).toFixed(1)}">${esc(labels[i])}</text>`;
  }
  return g;
}
function xLabels(labels, w) {
  const L = SC.pad.l, R = w - SC.pad.r, step = (R - L) / labels.length;
  return labels.map((t, i) =>
    `<text class="axis" text-anchor="middle" x="${(L + step * (i + .5)).toFixed(1)}" y="${SC.h - 6}">${esc(t)}</text>`
  ).join('');
}

/* ── line and area ──────────────────────────────────────────────────── */
function line(data, o = {}) {
  const w = o.w || SC.w, h = o.h || SC.h;
  const top = SC.pad.t, bot = h - SC.pad.b - 14;
  const max = o.max ?? Math.max(...data) * 1.15, min = o.min ?? 0;
  const L = SC.pad.l, R = w - SC.pad.r, step = (R - L) / (data.length - 1);
  const X = i => L + step * i;
  const Y = v => bot - (v - min) / (max - min) * (bot - top);
  const cut = o.forecastFrom ?? data.length - 1;

  const pts = data.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
  const solid = pts.slice(0, cut + 1).join(' L ');
  const dashed = pts.slice(cut).join(' L ');
  const id = 'g' + (o.id || 0);
  const colour = o.colour || 'var(--c4)';

  let s = gridY(4, w, top, bot, o.yLabels);
  if (o.area !== false) {
    s += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${colour}" stop-opacity=".26"/>
      <stop offset="1" stop-color="${colour}" stop-opacity="0"/></linearGradient></defs>
      <path d="M ${solid} L ${X(cut).toFixed(1)},${bot} L ${X(0).toFixed(1)},${bot} Z" fill="url(#${id})"/>`;
  }
  s += `<path d="M ${solid}" fill="none" stroke="${colour}" stroke-width="2.5"
         stroke-linejoin="round" stroke-linecap="round"/>`;
  if (cut < data.length - 1)
    s += `<path d="M ${dashed}" fill="none" stroke="${colour}" stroke-width="2.5"
           stroke-dasharray="2 7" stroke-linecap="round"/>`;
  if (o.dots !== false)
    s += `<circle cx="${X(0).toFixed(1)}" cy="${Y(data[0]).toFixed(1)}" r="5" fill="var(--bg-secondary)" stroke="${colour}" stroke-width="3"/>
          <circle cx="${X(cut).toFixed(1)}" cy="${Y(data[cut]).toFixed(1)}" r="5" fill="var(--bg-secondary)" stroke="${colour}" stroke-width="3"/>`;
  if (o.xLabels) s += xLabels(o.xLabels, w);
  return frame(s, w, h);
}

/* ── multi-line ─────────────────────────────────────────────────────── */
function lines(series, o = {}) {
  const w = o.w || SC.w, h = o.h || SC.h, top = SC.pad.t, bot = h - SC.pad.b - 14;
  const flat = series.flatMap(s => s.data);
  const max = Math.max(...flat) * 1.12, min = 0;
  const n = series[0].data.length, L = SC.pad.l, R = w - SC.pad.r, step = (R - L) / (n - 1);
  let s = gridY(4, w, top, bot, o.yLabels);
  series.forEach((ser, k) => {
    const d = ser.data.map((v, i) =>
      `${(L + step * i).toFixed(1)},${(bot - v / max * (bot - top)).toFixed(1)}`).join(' L ');
    s += `<path d="M ${d}" fill="none" stroke="${ser.colour || SERIES[k % 5]}" stroke-width="2.5"
           stroke-linejoin="round" stroke-linecap="round"${ser.dashed ? ' stroke-dasharray="5 6"' : ''}/>`;
  });
  if (o.xLabels) s += xLabels(o.xLabels, w);
  return frame(s, w, h);
}

/* ── bars ───────────────────────────────────────────────────────────── */
function bars(data, o = {}) {
  const w = o.w || SC.w, h = o.h || SC.h, top = SC.pad.t, bot = h - SC.pad.b - 14;
  const max = Math.max(...data) * 1.12;
  const L = SC.pad.l, R = w - SC.pad.r, slot = (R - L) / data.length, bw = Math.min(o.barWidth || 46, slot * .68);
  let s = gridY(4, w, top, bot, o.yLabels);
  if (o.hatch) s += `<defs><pattern id="hx" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" fill="var(--c-basic)"/>
      <line x1="0" y1="0" x2="0" y2="7" stroke="var(--bg-secondary)" stroke-width="3"/></pattern></defs>`;
  data.forEach((v, i) => {
    const bh = Math.max(3, v / max * (bot - top));
    const x = L + slot * i + (slot - bw) / 2;
    const on = o.highlight === i;
    const fill = on ? 'var(--c4)' : (o.hatch ? 'url(#hx)' : (o.colours ? o.colours[i] : 'var(--c2)'));
    s += `<rect x="${x.toFixed(1)}" y="${(bot - bh).toFixed(1)}" width="${bw.toFixed(1)}"
           height="${bh.toFixed(1)}" rx="8" fill="${fill}"/>`;
    if (on && o.tip) {
      const cx = x + bw / 2;
      s += `<rect x="${(cx - 48).toFixed(1)}" y="${(bot - bh - 34).toFixed(1)}" width="96" height="26" rx="8" fill="var(--bg-inverted)"/>
            <text x="${cx.toFixed(1)}" y="${(bot - bh - 16).toFixed(1)}" text-anchor="middle"
             fill="var(--text-inverted)" style="font:700 13px var(--font)">${esc(o.tip)}</text>`;
    }
  });
  if (o.xLabels) s += xLabels(o.xLabels, w);
  return frame(s, w, h);
}

/* ── stacked bars ───────────────────────────────────────────────────── */
function stacked(rows, o = {}) {
  const w = o.w || SC.w, h = o.h || SC.h, top = SC.pad.t, bot = h - SC.pad.b - 14;
  const totals = rows.map(r => r.reduce((a, b) => a + b, 0));
  const max = Math.max(...totals) * 1.1;
  const L = SC.pad.l, R = w - SC.pad.r, slot = (R - L) / rows.length, bw = Math.min(42, slot * .64);
  let s = gridY(4, w, top, bot, o.yLabels);
  rows.forEach((seg, i) => {
    let y = bot;
    const x = L + slot * i + (slot - bw) / 2;
    seg.forEach((v, k) => {
      const bh = v / max * (bot - top);
      y -= bh;
      const r = k === seg.length - 1 ? 8 : 0;
      s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}"
             height="${bh.toFixed(1)}" rx="${r}" fill="${SERIES[k % 5]}"/>`;
    });
  });
  if (o.xLabels) s += xLabels(o.xLabels, w);
  return frame(s, w, h);
}

/* ── horizontal bars ────────────────────────────────────────────────── */
function hbars(items, o = {}) {
  const w = o.w || SC.w, rowH = o.rowH || 40, h = items.length * rowH + 16;
  const max = Math.max(...items.map(i => i.value)) * 1.05;
  const L = o.labelWidth || 116, R = w - 56;
  let s = '';
  items.forEach((it, i) => {
    const y = 10 + i * rowH;
    const bw = Math.max(4, it.value / max * (R - L));
    s += `<text class="axis" x="0" y="${y + 17}" style="font:500 13px var(--font);fill:var(--text-secondary)">${esc(it.label)}</text>
          <rect x="${L}" y="${y}" width="${(R - L).toFixed(1)}" height="22" rx="8" fill="var(--c-basic)"/>
          <rect x="${L}" y="${y}" width="${bw.toFixed(1)}" height="22" rx="8" fill="${it.colour || SERIES[i % 5]}"/>
          <text class="axis" x="${w - 48}" y="${y + 16}" style="font:600 13px var(--font);fill:var(--text-primary)">${esc(it.display || nice(it.value))}</text>`;
  });
  return frame(s, w, h);
}

/* ── donut and pie ──────────────────────────────────────────────────── */
function arcPath(cx, cy, r, a0, a1, inner) {
  const p = (a, rr) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  const big = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = p(a0, r), [x1, y1] = p(a1, r);
  if (!inner) return `M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${big} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
  const [ix1, iy1] = p(a1, inner), [ix0, iy0] = p(a0, inner);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${big} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}
          L ${ix1.toFixed(1)} ${iy1.toFixed(1)} A ${inner} ${inner} 0 ${big} 0 ${ix0.toFixed(1)} ${iy0.toFixed(1)} Z`;
}
function donut(segs, o = {}) {
  const w = o.w || SC.w, h = o.h || 230, cx = w / 2, cy = h / 2 - 4;
  const r = o.r || 86, inner = o.pie ? 0 : (o.inner || 58);
  const total = segs.reduce((a, s) => a + s.value, 0);
  let a = -Math.PI / 2, s = '';
  segs.forEach((seg, i) => {
    const a1 = a + seg.value / total * Math.PI * 2;
    s += `<path d="${arcPath(cx, cy, r, a + .012, a1 - .012, inner)}" fill="${seg.colour || SERIES[i % 5]}"/>`;
    a = a1;
  });
  if (!o.pie && o.centre)
    s += `<text x="${cx}" y="${cy + 2}" text-anchor="middle" style="font:600 28px var(--font);letter-spacing:-.03em" fill="var(--text-primary)">${esc(o.centre)}</text>
          <text x="${cx}" y="${cy + 24}" text-anchor="middle" class="axis">${esc(o.sub || '')}</text>`;
  return frame(s, w, h);
}

/* ── gauge and radial progress ──────────────────────────────────────── */
function gauge(value, o = {}) {
  const w = o.w || SC.w, h = o.h || 210, cx = w / 2, cy = h - 44, r = o.r || 92;
  const a = Math.PI * (value / 100);
  const p = ang => [cx - r * Math.cos(ang), cy - r * Math.sin(ang)];
  const [sx, sy] = p(0), [ex, ey] = p(Math.PI), [vx, vy] = p(a);
  return frame(`
    <path d="M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}" fill="none"
      stroke="var(--c-basic)" stroke-width="24" stroke-linecap="round"/>
    <path d="M ${sx} ${sy} A ${r} ${r} 0 ${a > Math.PI / 2 ? 1 : 0} 1 ${vx.toFixed(1)} ${vy.toFixed(1)}"
      fill="none" stroke="var(--c4)" stroke-width="24" stroke-linecap="round"/>
    <circle cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="10" fill="var(--bg-secondary)" stroke="var(--c4)" stroke-width="5"/>
    <text x="${cx}" y="${cy - 12}" text-anchor="middle" style="font:600 40px var(--font);letter-spacing:-.03em" fill="var(--text-primary)">${esc(o.label ?? value)}</text>
    <text x="${cx}" y="${cy + 12}" text-anchor="middle" class="axis">${esc(o.sub || '')}</text>`, w, h);
}
function radial(value, o = {}) {
  const w = o.w || SC.w, h = o.h || 220, cx = w / 2, cy = h / 2, r = o.r || 82;
  const c = 2 * Math.PI * r, on = c * value / 100;
  return frame(`
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--c-basic)" stroke-width="20"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--c4)" stroke-width="20"
      stroke-linecap="round" stroke-dasharray="${on.toFixed(1)} ${(c - on).toFixed(1)}"
      transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" style="font:600 36px var(--font);letter-spacing:-.03em" fill="var(--text-primary)">${esc(o.label ?? value + '%')}</text>
    <text x="${cx}" y="${cy + 26}" text-anchor="middle" class="axis">${esc(o.sub || '')}</text>`, w, h);
}

/* ── scatter with trend band ────────────────────────────────────────── */
function scatter(o = {}) {
  const w = o.w || SC.w, h = o.h || SC.h, top = SC.pad.t, bot = h - SC.pad.b - 14;
  const L = SC.pad.l, R = w - SC.pad.r;
  let s = gridY(4, w, top, bot, o.yLabels);
  s += `<path d="M ${L} ${bot - 14} L ${R} ${top + 46} L ${R} ${top + 10} L ${L} ${bot - 54} Z"
         fill="var(--c1)" opacity=".7"/>`;
  s += `<path d="M ${L} ${bot - 34} L ${R} ${top + 28}" stroke="var(--c3)" stroke-width="2" stroke-dasharray="6 6" fill="none"/>`;
  // deterministic pseudo-scatter
  for (let i = 0; i < 54; i++) {
    const t = (i * 37 % 100) / 100, j = (i * 61 % 100) / 100;
    const x = L + t * (R - L - 14);
    const y = bot - (t * .74 + (j - .5) * .42) * (bot - top) - 12;
    if (y < top || y > bot) continue;
    s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="11" height="11" rx="3.5" fill="${SERIES[i % 4]}"/>`;
  }
  if (o.xLabels) s += xLabels(o.xLabels, w);
  return frame(s, w, h);
}

/* ── heatmap ────────────────────────────────────────────────────────── */
function heat(o = {}) {
  const cols = o.cols || 24, rows = o.rows || 7, cell = o.cell || 19, gap = 4;
  const w = o.w || SC.w, h = rows * (cell + gap) + 34;
  const L = 34;
  let s = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = ((r * 7 + c * 13) % 11) / 10;
      const tone = v > .82 ? 'var(--c5)' : v > .62 ? 'var(--c4)' : v > .42 ? 'var(--c3)' : v > .22 ? 'var(--c2)' : 'var(--c1)';
      s += `<rect x="${L + c * (cell + gap)}" y="${8 + r * (cell + gap)}" width="${cell}" height="${cell}" rx="5" fill="${tone}"/>`;
    }
    s += `<text class="axis" x="0" y="${8 + r * (cell + gap) + cell - 4}">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][r]}</text>`;
  }
  return frame(s, w, h);
}

/* ── hexagon density cluster ────────────────────────────────────────── */
function hex(o = {}) {
  const w = o.w || SC.w, h = o.h || 200, R = o.r || 10, W = Math.sqrt(3) * R, H = 1.5 * R;
  const rows = o.rows || [9, 12, 15, 18, 21, 18, 15, 12, 9];
  const cx0 = w / 2, mid = (rows.length - 1) / 2;
  let y = 22, s = '';
  rows.forEach((n, ri) => {
    const startX = cx0 - (n - 1) * W / 2;
    for (let i = 0; i < n; i++) {
      const cx = startX + i * W, cy = y, pts = [];
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 180 * (60 * k - 30);
        pts.push((cx + R * Math.cos(a)).toFixed(1) + ',' + (cy + R * Math.sin(a)).toFixed(1));
      }
      const dx = (cx - cx0) / (w * .29), dy = (cy - (22 + mid * (H + 3))) / (h * .4);
      const d = Math.min(1, Math.hypot(dx, dy));
      const step = ['var(--c4)','var(--c3)','var(--c3)','var(--c2)','var(--c2)','var(--c1)'];
      const centre = ri === Math.round(mid) && i === Math.floor(n / 2);
      s += `<polygon points="${pts.join(' ')}" fill="${centre ? 'var(--c5)' : step[Math.min(5, Math.round(d * 5))]}"/>`;
    }
    y += H + 3;
  });
  return frame(s, w, h);
}

/* ── funnel ─────────────────────────────────────────────────────────── */
function funnel(steps, o = {}) {
  const w = o.w || SC.w, rowH = 44, h = steps.length * rowH + 14;
  const max = steps[0].value;
  let s = '';
  steps.forEach((st, i) => {
    const y = 6 + i * rowH;
    const bw = (st.value / max) * (w - 150);
    s += `<text class="axis" x="0" y="${y + 22}" style="font:500 13px var(--font);fill:var(--text-secondary)">${esc(st.label)}</text>
          <rect x="112" y="${y}" width="${bw.toFixed(1)}" height="30" rx="8" fill="${SERIES[i % 5]}"/>
          <text x="${(120 + bw).toFixed(1)}" y="${y + 20}" style="font:600 13px var(--font)" fill="var(--text-primary)">${esc(nice(st.value))}</text>`;
  });
  return frame(s, w, h);
}

/* ── waterfall ──────────────────────────────────────────────────────── */
function waterfall(steps, o = {}) {
  const w = o.w || SC.w, h = o.h || SC.h, top = SC.pad.t, bot = h - SC.pad.b - 14;
  let run = 0;
  const cum = steps.map(s => { const a = run; run += s.value; return [a, run]; });
  const max = Math.max(...cum.flat()) * 1.15;
  const L = SC.pad.l, R = w - SC.pad.r, slot = (R - L) / steps.length, bw = Math.min(40, slot * .6);
  let s = gridY(4, w, top, bot, o.yLabels);
  steps.forEach((st, i) => {
    const [a, b] = cum[i], lo = Math.min(a, b), hi = Math.max(a, b);
    const y = bot - hi / max * (bot - top), bh = Math.max(3, (hi - lo) / max * (bot - top));
    const x = L + slot * i + (slot - bw) / 2;
    const fill = st.total ? 'var(--c5)' : st.value >= 0 ? 'var(--c4)' : 'var(--c-negative)';
    s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw}" height="${bh.toFixed(1)}" rx="6" fill="${fill}"/>`;
  });
  s += xLabels(steps.map(s => s.label), w);
  return frame(s, w, h);
}

/* ── radar ──────────────────────────────────────────────────────────── */
function radar(axes, o = {}) {
  const w = o.w || SC.w, h = o.h || 250, cx = w / 2, cy = h / 2, R = o.r || 88;
  const n = axes.length, ang = i => -Math.PI / 2 + i * 2 * Math.PI / n;
  let s = '';
  for (let ring = 1; ring <= 4; ring++) {
    const pts = axes.map((_, i) =>
      `${(cx + R * ring / 4 * Math.cos(ang(i))).toFixed(1)},${(cy + R * ring / 4 * Math.sin(ang(i))).toFixed(1)}`);
    s += `<polygon points="${pts.join(' ')}" fill="none" stroke="var(--grid-line)"/>`;
  }
  const pts = axes.map((a, i) =>
    `${(cx + R * a.value / 100 * Math.cos(ang(i))).toFixed(1)},${(cy + R * a.value / 100 * Math.sin(ang(i))).toFixed(1)}`);
  s += `<polygon points="${pts.join(' ')}" fill="var(--c4)" fill-opacity=".26" stroke="var(--c4)" stroke-width="2.5"/>`;
  axes.forEach((a, i) => {
    const x = cx + (R + 20) * Math.cos(ang(i)), y = cy + (R + 20) * Math.sin(ang(i));
    s += `<text class="axis" text-anchor="middle" x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}">${esc(a.label)}</text>`;
  });
  return frame(s, w, h);
}

/* ── bullet ─────────────────────────────────────────────────────────── */
function bullet(items, o = {}) {
  const w = o.w || SC.w, rowH = 46, h = items.length * rowH + 10;
  const L = 106, R = w - 20;
  let s = '';
  items.forEach((it, i) => {
    const y = 8 + i * rowH;
    const pv = it.value / it.max * (R - L), pt = it.target / it.max * (R - L);
    s += `<text class="axis" x="0" y="${y + 18}" style="font:500 13px var(--font);fill:var(--text-secondary)">${esc(it.label)}</text>
          <rect x="${L}" y="${y + 2}" width="${(R - L).toFixed(1)}" height="20" rx="7" fill="var(--c-basic)"/>
          <rect x="${L}" y="${y + 2}" width="${pv.toFixed(1)}" height="20" rx="7" fill="var(--c4)"/>
          <rect x="${(L + pt).toFixed(1)}" y="${y - 2}" width="3" height="28" rx="1.5" fill="var(--text-primary)"/>
          <text class="axis" x="${L}" y="${y + 38}">${esc(it.value)} of ${esc(it.max)} · target ${esc(it.target)}</text>`;
  });
  return frame(s, w, h);
}

/* ── candles ────────────────────────────────────────────────────────── */
function candles(o = {}) {
  const w = o.w || SC.w, h = o.h || SC.h, top = SC.pad.t, bot = h - SC.pad.b - 14;
  const n = o.n || 22, L = SC.pad.l, R = w - SC.pad.r, slot = (R - L) / n;
  let s = gridY(4, w, top, bot, o.yLabels), base = 52;
  for (let i = 0; i < n; i++) {
    const drift = Math.sin(i / 2.6) * 12 + (i % 5) * 2;
    const open = base + drift, close = base + drift + ((i * 7) % 9) - 4;
    const hi = Math.max(open, close) + 5, lo = Math.min(open, close) - 5;
    const Y = v => bot - v / 100 * (bot - top);
    const x = L + slot * i + slot / 2, up = close >= open;
    s += `<line x1="${x.toFixed(1)}" y1="${Y(hi).toFixed(1)}" x2="${x.toFixed(1)}" y2="${Y(lo).toFixed(1)}"
           stroke="${up ? 'var(--c4)' : 'var(--c-negative)'}" stroke-width="1.5"/>
          <rect x="${(x - 5).toFixed(1)}" y="${Y(Math.max(open, close)).toFixed(1)}" width="10"
           height="${Math.max(2, Math.abs(Y(open) - Y(close))).toFixed(1)}" rx="2.5"
           fill="${up ? 'var(--c4)' : 'var(--c-negative)'}"/>`;
    base += 1.1;
  }
  return frame(s, w, h);
}

/* ── treemap ────────────────────────────────────────────────────────── */
function treemap(items, o = {}) {
  const w = o.w || SC.w, h = o.h || 220;
  const total = items.reduce((a, i) => a + i.value, 0);
  let x = 0, s = '', col = 0;
  // simple slice-and-dice: first item full height, rest stacked in a second column
  const bigW = w * items[0].value / total;
  s += `<rect x="2" y="2" width="${(bigW - 4).toFixed(1)}" height="${h - 4}" rx="10" fill="${SERIES[0]}"/>
        <text x="16" y="30" style="font:600 15px var(--font)" fill="#fff">${esc(items[0].label)}</text>
        <text x="16" y="52" style="font:600 22px var(--font);letter-spacing:-.02em" fill="#fff">${esc(nice(items[0].value))}</text>`;
  let y = 0; const restTotal = total - items[0].value;
  items.slice(1).forEach((it, i) => {
    const ih = (h) * it.value / restTotal;
    s += `<rect x="${bigW + 2}" y="${(y + 2).toFixed(1)}" width="${(w - bigW - 4).toFixed(1)}"
           height="${(ih - 4).toFixed(1)}" rx="10" fill="${SERIES[(i + 1) % 5]}"/>
          <text x="${bigW + 16}" y="${(y + 26).toFixed(1)}" style="font:600 13px var(--font)"
           fill="${i < 2 ? '#fff' : 'var(--text-primary)'}">${esc(it.label)} · ${esc(nice(it.value))}</text>`;
    y += ih;
  });
  return frame(s, w, h);
}

/* ── dot-matrix map ─────────────────────────────────────────────────── */
// Coarse landmass mask, 48 columns x 22 rows, '#' = land. Enough for a
// region-tinted dot map without shipping a geo library.
const WORLD = [
  '................................................',
  '.......#####......########################......',
  '....############..########################......',
  '...##############.#####################.........',
  '....############...###################..........',
  '.....##########.....###############.............',
  '......########.......####.####.##...............',
  '.......#####..........###..###..................',
  '........####...........####.....................',
  '.........###...........#####....................',
  '.........####..........######...................',
  '..........###..........######...................',
  '..........####.........#####....................',
  '..........####.........####.....................',
  '...........###.........###...........#####......',
  '...........###.........##...........#######.....',
  '...........###.........#............#######.....',
  '............##......................#####.......',
  '............##..................................',
  '............#...................................',
  '................................................',
  '................................................'
];
const REGIONS = {
  world:        null,
  europe:       { c0: 22, c1: 30, r0: 1, r1: 7 },
  asia:         { c0: 30, c1: 46, r0: 1, r1: 10 },
  'north america': { c0: 2, c1: 16, r0: 1, r1: 8 },
  'south america': { c0: 8, c1: 16, r0: 9, r1: 20 },
  australia:    { c0: 34, c1: 44, r0: 13, r1: 18 }
};
function map(region = 'world', o = {}) {
  const w = o.w || SC.w, cell = o.cell || 9, gap = 2.6;
  const cols = WORLD[0].length, rows = WORLD.length;
  const scale = (w - 8) / (cols * (cell + gap));
  const h = rows * (cell + gap) * scale + 10;
  const R = REGIONS[region.toLowerCase()] ?? null;
  let s = `<g transform="scale(${scale.toFixed(3)})">`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (WORLD[r][c] !== '#') continue;
      const inR = !R || (c >= R.c0 && c <= R.c1 && r >= R.r0 && r <= R.r1);
      const tone = inR ? (((r + c) % 5 > 2) ? 'var(--c4)' : 'var(--c3)') : 'var(--c-basic)';
      s += `<circle cx="${(c * (cell + gap) + cell / 2 + 4).toFixed(1)}"
             cy="${(r * (cell + gap) + cell / 2 + 4).toFixed(1)}" r="${(cell / 2).toFixed(1)}" fill="${tone}"/>`;
    }
  }
  return frame(s + '</g>', w, h);
}

/* ── sparkline ──────────────────────────────────────────────────────── */
function spark(data, o = {}) {
  const w = o.w || 96, h = o.h || 40, max = Math.max(...data), min = Math.min(...data);
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${(i * step).toFixed(1)},${(h - 4 - (v - min) / (max - min || 1) * (h - 10)).toFixed(1)}`);
  const colour = o.colour || 'var(--c4)';
  const id = 'sp' + (o.id || 0);
  return `<svg class="chart" style="width:${w}px;margin:0" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${colour}" stop-opacity=".28"/>
      <stop offset="1" stop-color="${colour}" stop-opacity="0"/></linearGradient></defs>
    <path d="M ${pts.join(' L ')} L ${w},${h} L 0,${h} Z" fill="url(#${id})"/>
    <path d="M ${pts.join(' L ')}" fill="none" stroke="${colour}" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

/* ── progress rows ──────────────────────────────────────────────────── */
function progress(items, o = {}) {
  const w = o.w || SC.w, rowH = 52, h = items.length * rowH;
  let s = '';
  items.forEach((it, i) => {
    const y = 8 + i * rowH;
    const bw = it.value / 100 * (w - 60);
    s += `<text x="0" y="${y + 12}" style="font:500 13.5px var(--font)" fill="var(--text-secondary)">${esc(it.label)}</text>
          <text x="${w}" y="${y + 12}" text-anchor="end" style="font:700 13.5px var(--font)" fill="var(--text-primary)">${it.value}%</text>
          <rect x="0" y="${y + 22}" width="${w}" height="10" rx="5" fill="var(--c-basic)"/>
          <rect x="0" y="${y + 22}" width="${bw.toFixed(1)}" height="10" rx="5" fill="${it.colour || SERIES[i % 5]}"/>`;
  });
  return frame(s, w, h);
}

/* Exposed as a global so the templates work straight off the filesystem —
   ES modules are blocked by CORS on file:// in Chrome. */
window.Charts = { line, lines, bars, stacked, hbars, donut, gauge, radial, scatter,
  heat, hex, funnel, waterfall, radar, bullet, candles, treemap, map, spark, progress };
