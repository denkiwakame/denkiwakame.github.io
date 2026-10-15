# denkiwakame.github.io

Personal research portfolio of Mai Nishimura. Astro 7, static output, deployed to GitHub Pages.

## Rules

- Data source of truth: `src/data/*.yaml` and `src/content/summaries/`. Never hardcode paper, talk, or career info in components.
- Colors, spacing, radii, fonts: only via `src/styles/tokens.css`. No raw hex in components.
- No CSS framework: plain scoped `<style>` in each component, values from tokens. Do not add Tailwind, daisyUI, or similar.
- New components use container queries, not viewport breakpoints.
- Zero client JS by default. Ask before adding any `<script>` or framework island. Approved exceptions: the BibTeX copy button (`BibtexBlock.astro`) and the figure carousel arrows (`FigureCarousel.astro`, CSS scroll-snap does the rest). Both must work without JS.
- Never set `reviewed: true` on a summary. Only the author does that.
- Before finishing any task: `npm run check && npm run build` must pass.
- For design work or new components, follow the `design-rules` skill.
- After editing `plugins/*.mjs`, run `npx astro sync --force` (or `build --force`) and restart the dev server: the content cache does not notice plugin changes.
- Math in summaries: `$...$` / `$$...$$`, rendered by KaTeX at build time (Sätteri hast plugin in `plugins/katex.mjs`). Remote figures: a lone `![caption](https://…)` becomes a captioned figure (`plugins/figure.mjs`).

## Development

Start the dev server in background mode:

```
npx astro dev --background
```

Manage it with `npx astro dev stop`, `npx astro dev status`, and `npx astro dev logs`.

Docs: https://docs.astro.build (content collections, styling, routing).
