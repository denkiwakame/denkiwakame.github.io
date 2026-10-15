/**
 * Deterministic generative thumbnails for project booths.
 * flow…radial are ported from the Claude Design "Poster Hall" prototype (_buildArt); same seeds → same images.
 */

export const ART_KINDS = ['flow', 'halftone', 'contour', 'ridgeline', 'knn', 'radial', 'neural'] as const;
export type ArtKind = (typeof ART_KINDS)[number];

const INK = '#18181B';
const BG = '#F2F1EE';
const W = 320;
const H = 200;

/** mulberry32 PRNG. */
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** 2D value noise with smoothstep interpolation. */
const noiseF = (seed: number) => {
  const r = rng(seed);
  const grid = new Map<string, number>();
  const v = (i: number, j: number) => {
    const k = `${i},${j}`;
    let value = grid.get(k);
    if (value === undefined) grid.set(k, (value = r()));
    return value;
  };
  const s = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = s(x - i);
    const fy = s(y - j);
    const a = v(i, j);
    const b = v(i + 1, j);
    const c = v(i, j + 1);
    const d = v(i + 1, j + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
};

const f = (n: number) => n.toFixed(1);

const wrap = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><rect width="100%" height="100%" fill="${BG}"/>${body}</svg>`;

const builders: Record<ArtKind, () => string> = {
  // Flow-field lines (PRESTO).
  flow() {
    const r = rng(11);
    const n = noiseF(3);
    let p = '';
    for (let k = 0; k < 220; k++) {
      let x = r() * W;
      let y = r() * H;
      let d = `M${f(x)} ${f(y)}`;
      for (let s = 0; s < 34; s++) {
        const a = n(x * 0.012, y * 0.012) * Math.PI * 4;
        x += Math.cos(a) * 3;
        y += Math.sin(a) * 3;
        d += `L${f(x)} ${f(y)}`;
      }
      p += `<path d="${d}"/>`;
    }
    return wrap(`<g fill="none" stroke="${INK}" stroke-width="0.6" stroke-opacity="0.55" stroke-linecap="round">${p}</g>`);
  },
  // Dot halftone (SLM).
  halftone() {
    const n = noiseF(7);
    const cols = 32;
    const rows = 20;
    const cw = W / cols;
    const ch = H / rows;
    let c = '';
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const q = Math.floor(n(i * 0.18, j * 0.18) * 5) / 4;
        if (q <= 0) continue;
        c += `<circle cx="${f(i * cw + cw / 2)}" cy="${f(j * ch + ch / 2)}" r="${f(q * cw * 0.42)}"/>`;
      }
    return wrap(`<g fill="${INK}" fill-opacity="0.8">${c}</g>`);
  },
  // Noisy contour rings (tactile).
  contour() {
    const n = noiseF(19);
    const cx = 205;
    const cy = 112;
    let p = '';
    for (let r0 = 5; r0 < 260; r0 += 4.2) {
      let d = '';
      for (let a = 0; a <= 64; a++) {
        const t = (a / 64) * Math.PI * 2;
        const rr = r0 + (n(Math.cos(t) * 1.6 + r0 * 0.02, Math.sin(t) * 1.6) - 0.5) * r0 * 0.35;
        d += `${a ? 'L' : 'M'}${f(cx + Math.cos(t) * rr * 1.15)} ${f(cy + Math.sin(t) * rr * 0.85)}`;
      }
      p += `<path d="${d}Z"/>`;
    }
    return wrap(`<g fill="none" stroke="${INK}" stroke-width="0.7" stroke-opacity="0.6">${p}</g>`);
  },
  // Ridgeline plot (anchoring).
  ridgeline() {
    const n = noiseF(23);
    const r = rng(5);
    let p = '';
    for (let k = 0; k < 26; k++) {
      const y0 = 28 + k * 6.4;
      const mu = 120 + r() * 80;
      let d = `M0 ${f(y0)}`;
      for (let x = 0; x <= W; x += 3) {
        const g = Math.exp(-Math.pow((x - mu) / 34, 2));
        const h = g * (18 + n(x * 0.05, k * 0.7) * 36) + n(x * 0.2, k) * 2.5;
        d += `L${x} ${f(y0 - h)}`;
      }
      p += `<path d="${d}L${W} ${H}L0 ${H}Z" fill="${BG}"/><path d="${d}" fill="none"/>`;
    }
    return wrap(`<g stroke="${INK}" stroke-width="0.9" stroke-opacity="0.8">${p}</g>`);
  },
  // k-nearest-neighbour graph (social).
  knn() {
    const r = rng(31);
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 46; i++) pts.push([14 + r() * (W - 28), 14 + r() * (H - 28), r()]);
    let e = '';
    let c = '';
    pts.forEach((a, i) => {
      pts
        .map((b, j) => [j, (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2] as const)
        .sort((x, y) => x[1] - y[1])
        .slice(1, 4)
        .forEach(([j]) => {
          if (j > i) e += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(pts[j][0])}" y2="${f(pts[j][1])}"/>`;
        });
      c += `<circle cx="${f(a[0])}" cy="${f(a[1])}" r="${f(1.4 + a[2] * a[2] * 5)}"/>`;
    });
    return wrap(
      `<g stroke="${INK}" stroke-width="0.6" stroke-opacity="0.45">${e}</g><g fill="${INK}" fill-opacity="0.85">${c}</g>`,
    );
  },
  // Radial fan (DSI).
  radial() {
    const n = noiseF(41);
    const ox = -30;
    const oy = 230;
    let p = '';
    let c = '';
    for (let k = 0; k < 180; k++) {
      const a = -Math.PI / 2 + (k / 180) * (Math.PI / 2) * 1.02;
      const len = 120 + n(k * 0.09, 0.5) * 260;
      const x2 = ox + Math.cos(a) * len;
      const y2 = oy + Math.sin(a) * len;
      p += `<line x1="${ox}" y1="${oy}" x2="${f(x2)}" y2="${f(y2)}"/>`;
      if (k % 3 === 0) c += `<circle cx="${f(x2)}" cy="${f(y2)}" r="1.3"/>`;
    }
    return wrap(`<g stroke="${INK}" stroke-width="0.5" stroke-opacity="0.5">${p}</g><g fill="${INK}">${c}</g>`);
  },
  // Hippocampus-like neural circuit (PRESTO: self-evolving memory). Not from the design file.
  // Pyramidal neurons sit along a C-shaped band; fractal dendrites grow out of each soma and
  // axons (Schaffer-collateral-like curves) end in synaptic boutons on other neurons' dendrites.
  neural() {
    const r = rng(83);
    const n = noiseF(89);
    const DEPTH = 5;
    const dendrites: string[] = Array.from({ length: DEPTH + 1 }, () => '');
    let spines = '';
    let somas = '';
    let axons = '';
    let boutons = '';
    const targets: [number, number][] = [];

    const dendrite = (x: number, y: number, a: number, len: number, depth: number) => {
      const heading = a + (n(x * 0.05, y * 0.05) - 0.5) * 0.5;
      const ex = x + Math.cos(heading) * len;
      const ey = y + Math.sin(heading) * len;
      const bend = (r() - 0.5) * len * 0.4;
      const cx = (x + ex) / 2 - Math.sin(heading) * bend;
      const cy = (y + ey) / 2 + Math.cos(heading) * bend;
      dendrites[depth] += `<path d="M${f(x)} ${f(y)}Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}"/>`;
      if (depth === 0) {
        if (r() < 0.5) spines += `<circle cx="${f(ex)}" cy="${f(ey)}" r="0.55"/>`;
        if (r() < 0.25) targets.push([ex, ey]);
        return;
      }
      const spread = 0.32 + r() * 0.3;
      dendrite(ex, ey, heading - spread, len * (0.66 + r() * 0.1), depth - 1);
      dendrite(ex, ey, heading + spread, len * (0.66 + r() * 0.1), depth - 1);
    };

    // C-shaped band, opening to the lower right like a seahorse.
    const cx0 = 168;
    const cy0 = 96;
    const somaPts: { x: number; y: number; out: number }[] = [];
    const COUNT = 15;
    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1);
      const ang = Math.PI * (0.35 + t * 1.45); // from lower right, over the top, to the left and down
      const rad = 54 - t * 14 + (r() - 0.5) * 5;
      const x = cx0 + Math.cos(ang) * rad * 1.5;
      const y = cy0 + Math.sin(ang) * rad;
      somaPts.push({ x, y, out: ang });
    }
    for (const { x, y, out } of somaPts) {
      // Apical dendrite outward, basal dendrites inward.
      dendrite(x, y, out + (r() - 0.5) * 0.3, 12 + r() * 5, DEPTH);
      dendrite(x, y, out + Math.PI - 0.5, 5 + r() * 2, 2);
      dendrite(x, y, out + Math.PI + 0.5, 5 + r() * 2, 2);
      const s = 1.8 + r() * 0.8;
      // Pyramidal soma: a small triangle pointing along the apical dendrite.
      const p = (da: number, rr: number) => `${f(x + Math.cos(out + da) * rr)} ${f(y + Math.sin(out + da) * rr)}`;
      somas += `<path d="M${p(0, s * 1.6)}L${p(2.3, s)}L${p(-2.3, s)}Z"/>`;
    }
    // Axons: from a soma, sweep through the inside of the band, end on another neuron's dendrite.
    for (let k = 0; k < 9; k++) {
      const from = somaPts[Math.floor(r() * COUNT)];
      const to = targets[Math.floor(r() * targets.length)];
      if (!to) break;
      const c1x = from.x + (cx0 - from.x) * 0.9 + (r() - 0.5) * 40;
      const c1y = from.y + (cy0 - from.y) * 0.9 + (r() - 0.5) * 30;
      const c2x = (c1x + to[0]) / 2 + (r() - 0.5) * 50;
      const c2y = (c1y + to[1]) / 2 + (r() - 0.5) * 40;
      axons += `<path d="M${f(from.x)} ${f(from.y)}C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(to[0])} ${f(to[1])}"/>`;
      boutons += `<circle cx="${f(to[0])}" cy="${f(to[1])}" r="1.5"/>`;
    }

    const dendriteGroups = dendrites
      .map((d, depth) => (d ? `<g stroke-width="${f(0.3 + depth * 0.18)}">${d}</g>` : ''))
      .join('');
    return wrap(
      `<g fill="none" stroke="${INK}" stroke-width="0.45" stroke-opacity="0.4" stroke-dasharray="1.6 1.4">${axons}</g>` +
        `<g fill="none" stroke="${INK}" stroke-opacity="0.7" stroke-linecap="round">${dendriteGroups}</g>` +
        `<g fill="${INK}" fill-opacity="0.6">${spines}</g>` +
        `<g fill="${INK}">${somas}</g>` +
        `<g fill="${BG}" stroke="${INK}" stroke-width="0.7">${boutons}</g>`,
    );
  },
};

export const buildArt = (kind: ArtKind): string => builders[kind]();

/** Pick a stable art kind for an arbitrary id (used for papers without a teaser). */
export const artFor = (id: string): ArtKind => {
  let h = 0;
  for (const ch of id) h = (Math.imul(h, 31) + ch.charCodeAt(0)) | 0;
  return ART_KINDS[Math.abs(h) % ART_KINDS.length];
};

