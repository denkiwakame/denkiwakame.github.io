---
name: paper-summary
description: Draft a 1-page summary for one of the author's papers, shown on /publications/<id>/. Use after add-paper, or when asked "サマリー作って" / "write a summary for <paper>".
---

# paper-summary

Writes `src/content/summaries/<paper-id>.md` (English) or `<paper-id>.ja.md` (`lang: ja`).

## Rules

1. **Source**: prefer `https://arxiv.org/html/<arxiv-id>`; else the LaTeX source from `https://arxiv.org/e-print/<arxiv-id>`. Do not parse the PDF. If neither exists, ask the user for the source.
2. **Format**: copy `.claude/skills/paper-summary/template.md` to `src/content/summaries/<paper-id>.md` and fill it in. The page layout comes entirely from `src/pages/publications/[id].astro`; the Markdown only carries content, so every summary looks the same.
   - Sections are exactly `## Motivation`, `## Approach`, `## Key results`, `## Conclusion`, in that order. The build fails otherwise (`assertSummarySections` in `src/lib/papers.ts`).
   - Motivation opens with the paper's guiding question as a `>` blockquote (shown as a pull quote).
   - Conclusion states the takeaway as a plain claim that resolves that question by its content. Do not open with "Yes" or refer to the question ("this answers the opening question").
   - Still images go in the text, in the section they explain, as a lone Markdown image with an absolute URL: `![Caption](https://…)` (overview/method in Approach, result plots in Key results). It becomes a captioned figure (`plugins/figure.mjs`). Do not write raw `<figure>` HTML.
   - Only demo videos (`video:`) and GIF rollouts (`url:` to a .gif) go in the `demos` frontmatter; they render as a carousel after the text. A still image in `demos` fails the build.
   - Body ≤ 400 words, not counting figure captions.
3. **Math**: write LaTeX as `$...$` (inline) or a `$$` block on its own lines. It is rendered with KaTeX at build time (`plugins/katex.mjs`); an invalid expression fails the build. Escape a literal dollar sign as `\$`.
3a. **Numbers**: quote numbers exactly as in the paper. Never round, convert, or infer.
4. **Figures**: size every figure with the *Figure size rule* below. Prefer media already published on the project page, linked by URL (images in the text; `video:` / `.gif` in `demos`). Project pages are often SPAs: find file names in the JS bundle and confirm each URL returns 200 with an image/video content type. Only if there is no project page, extract figures from the arXiv LaTeX source and save webp files to `src/assets/papers/<paper-id>/` and reference them from the text. Never use publisher versions. The teaser belongs in `papers.yaml` (`teaserUrl:` or `teaser:`), not in the summary. Mention the size of any GIF over ~5 MB in the report.
5. **Always `reviewed: false`.** Never set it to true; only the author does. Unreviewed summaries appear in `astro dev` with a DRAFT banner and are excluded from production builds.
6. **Verify** with `npm run check && npm run build`.
7. **Report** to the user: the file path, and a list of every numeric claim in the summary with its location in the paper (section / table) so the author can check each one.

## Figure size rule (consistent in-figure text)

Every figure is shown so that its **in-figure label text renders at about 13 px** — the size of the CLAP teaser (labels ≈ 26 px tall in a 1501 px-wide image, shown at 756 px). Full-width display makes small source images look huge, so set an explicit width when needed.

1. Open the image at native resolution and measure the typical label text (ordinary labels, not titles): font size in px, about the height of a capital letter plus descender, e.g. "system msg" in the CLAP teaser ≈ 26 px.
2. Display width = natural width × 13 / label size, rounded to 10 px. The sheet's content column is 756 px wide, so a result ≥ 756 needs no width.
3. Set it:
   - teaser: `teaserWidth: <px>` in `src/data/papers.yaml`
   - figure in a summary: `![Caption](https://… "<px>")` (the numeric title is the max width)
4. Photos or plots with no readable labels: judge by the plot's tick labels; if none, leave full width.
5. Mention the measured label size and the chosen width per figure in the report.
