/**
 * Site-wide Open Graph image (1200×630), generated at build time.
 * Background: the Small Language Models booth art (halftone). Text: satori → SVG paths in Geist.
 */
import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { buildArt } from '../lib/art';

const W = 1200;
const H = 630;
// Same values as src/styles/tokens.css (satori cannot read CSS variables).
const C = { fg: '#0E0E0D', muted: '#6B6B65', accent: '#C2410C', surface: '#FFFFFF', border: '#E2E2DE' };

// Resolved from the project root: import.meta.url points into dist/ after bundling.
const font = (pkg: string, file: string) => readFile(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: (Node | string)[] | Node | string): Node => ({
  type,
  props: { style, children },
});

export const GET: APIRoute = async () => {
  const profile = (await getEntry('profile', 'me'))!.data;

  const background = await sharp(Buffer.from(buildArt('halftone')), { density: 400 })
    .resize(W, H, { fit: 'cover' })
    .png()
    .toBuffer();

  const panel = h(
    'div',
    { width: W, height: H, display: 'flex', alignItems: 'center', paddingLeft: 56 },
    h(
      'div',
      {
        width: 700,
        // satori sizes boxes as content-box: 630 − 2×56 margin − 2×52 padding − 7 border.
        height: H - 112 - 104 - 7,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 56px',
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderTop: `6px solid ${C.accent}`,
        borderRadius: 6,
      },
      [
        h('div', { display: 'flex', flexDirection: 'column' }, [
          h('div', { fontSize: 76, fontWeight: 600, letterSpacing: '-0.035em', color: C.fg, lineHeight: 1 }, profile.name),
          h('div', { marginTop: 22, fontSize: 28, fontWeight: 500, color: C.muted }, profile.role),
          h(
            'div',
            { marginTop: 34, display: 'flex', flexDirection: 'column', fontFamily: 'Geist Mono', fontSize: 21, color: C.fg, lineHeight: 1.6 },
            profile.keywords.map((k) => h('div', { display: 'flex' }, k)),
          ),
        ]),
        h('div', { fontFamily: 'Geist Mono', fontSize: 22, fontWeight: 500, color: C.accent }, `${profile.handle}.github.io`),
      ],
    ),
  );

  const overlay = await satori(panel as never, {
    width: W,
    height: H,
    fonts: [
      { name: 'Geist', data: await font('geist', 'geist-latin-500-normal.woff'), weight: 500 },
      { name: 'Geist', data: await font('geist', 'geist-latin-600-normal.woff'), weight: 600 },
      { name: 'Geist Mono', data: await font('geist-mono', 'geist-mono-latin-500-normal.woff'), weight: 500 },
    ],
  });

  const png = await sharp(background)
    .composite([{ input: Buffer.from(overlay) }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
