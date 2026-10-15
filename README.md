# denkiwakame.github.io

Research portfolio of Mai Nishimura — https://denkiwakame.github.io

Astro 7 static site, deployed to GitHub Pages by `.github/workflows/deploy.yaml` on push to `main`.

## Where things live

| What | Where |
| --- | --- |
| Papers, co-authors | `src/data/papers.yaml`, `src/data/people.yaml` |
| Project booths, talks, pet projects, posts, career, profile | `src/data/*.yaml` |
| 1-page paper summaries | `src/content/summaries/<paper-id>.md` |
| Schemas | `src/content.config.ts` |
| Design tokens | `src/styles/tokens.css` |
| Generated booth art | `src/lib/art.ts` → `/art/<kind>.svg` |

YAML order is display order. Summaries with `reviewed: false` show only in `astro dev`.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run check` | Type and schema check |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the build |

## Working with Claude Code

`CLAUDE.md` holds the rules. Skills in `.claude/skills/`: `add-paper`, `paper-summary`, `add-talk`, `design-rules`. A hook runs `astro check` after edits to `src/data/` or `src/content/`.

Originally based on [astro-portfolio-template](https://github.com/MaeWolff/astro-portfolio-template); rebuilt from scratch in 2026.
