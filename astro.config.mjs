// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { figurePlugin } from './plugins/figure.mjs';
import { katexPlugin } from './plugins/katex.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://denkiwakame.github.io',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({
      features: { math: true },
      mdastPlugins: [figurePlugin],
      hastPlugins: [katexPlugin],
    }),
  },
  fonts: [
    {
      name: 'Geist',
      cssVariable: '--font-geist',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 700],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
});
