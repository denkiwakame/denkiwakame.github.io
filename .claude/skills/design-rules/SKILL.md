---
name: design-rules
description: Styling rules for this site (Poster Hall design). Use before changing any visual design, adding or editing a component, porting HTML from Claude Design, or touching src/styles/.
---

# Design rules — Poster Hall

The site follows the Claude Design file "Denkiwakame Poster Hall (Light)": a calm, light, editorial single column with burnt-orange accents.

## Tokens (src/styles/tokens.css is the only source)

| Role | Token | Value |
| --- | --- | --- |
| Page background | `--color-bg` | #F7F7F5 |
| Card | `--color-surface` | #FFFFFF |
| Thumbnail / footer | `--color-thumb` / `--color-sunken` | #F2F1EE / #EFEFEC |
| Text | `--color-fg` / `--color-fg-strong` / `--color-body` / `--color-muted` | #18181B / #0E0E0D / #3C3C39 / #6B6B65 |
| Lines | `--color-border` / `--color-border-soft` / `--color-rule` | #E2E2DE / #E4E4E1 / #EAEAE7 |
| Accent | `--color-accent` / `--color-on-accent` | #C2410C / #FFF7F2 |
| Chips | `--color-chip-*` (neutral), `--color-venue-*` (soft orange) | |

- Fonts: Geist (UI/body) and Geist Mono (years, dates, links, meta) via the Astro Fonts API (`astro.config.mjs`). Use `var(--font-mono)` or the `.mono` class.
- Shape: 4px cards, 999px pills, 14px avatar. Only shadow is `--shadow-card`.
- Type: h1 32/600/-0.035em, card h3 16/600, body 14.5/1.7, meta 11.5 mono. Use the `--text-*` tokens.
- Never write a raw hex, px font size outside tokens, or new color in a component. Add a token first.

## Layout and responsiveness

- Page column: wrap in `.page` (max 1180px, gutter `--gutter`).
- Components adapt with **container queries**. The `<section>` on the top page is `container-type: inline-size`; `.pubs` is the container for `PubRow`.
  - Booths: 3 → 2 (<900px) → 1 (<560px) columns. Talks / Background: 2 → 1 (<720px).
- Spacing that varies with width uses `clamp()`, not extra breakpoints.
- No CSS framework. global.css has a minimal reset; everything else is scoped CSS.
- Dark mode: not implemented. Only the placeholder `:root[data-theme='dark']` block exists in tokens.css.

## Components to reuse

`SectionHeader` (icon + h2 + rule + optional meta), `Chip` (neutral | venue | accent), `ExternalLink` (mono label + ↗), `Icon` (all icons from the design), `ProjectCard`, `TalkCard`, `ListRow`, `CareerList`, `PubRow`, `AuthorList`, `BibtexBlock` (inline BibTeX + copy button), `FigureCarousel` (scroll-snap carousel for demo videos / GIFs only; arrows are progressive enhancement), `RelatedBanner`.

## Porting HTML from Claude Design

Claude Design exports a bundle (`*.html` with `__bundler/manifest` and `__bundler/template`). Decode the template, then:

1. Replace DC syntax: `sc-for` → `.map()`, `sc-if` → `cond && (...)`, `{{ x }}` → `{x}`, `style-hover` → a `:hover` rule.
2. Move inline styles into the component's scoped `<style>` using tokens.
3. Replace `<image-slot>` with `<Image>` from `astro:assets` (or `/art/<kind>.svg`).
4. Data in `renderVals()` goes to `src/data/*.yaml`, never into the component.
5. The Rust compiler does not auto-fix HTML: close every tag, and write whitespace between inline elements explicitly with `{' '}`.
6. Check 375 / 768 / 1280px widths; the design has no breakpoints of its own.

## Generated art

`src/lib/art.ts` reproduces the design's seeded SVG thumbnails byte-for-byte (`flow`, `halftone`, `contour`, `ridgeline`, `knn`, `radial`), served at `/art/<kind>.svg`. Do not change their seeds or constants. `neural` (hippocampus-like circuit, PRESTO) was added later. Retired booths live in `archive/projects.yaml`. A `teaser` image in YAML always wins over art.
