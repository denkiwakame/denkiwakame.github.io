---
name: add-paper
description: Add a publication to the site. Use when the user says "論文追加", "add this paper", or pastes an arXiv URL/ID, a project page URL, or a BibTeX entry.
---

# add-paper

Adds one entry to `src/data/papers.yaml` (and new co-authors to `src/data/people.yaml`).

## Steps

1. **Collect metadata.**
   - arXiv: fetch `https://export.arxiv.org/api/query?id_list=<id>` for title and authors.
   - Project page / BibTeX: read title, authors, venue, year, links from it.
   - Ask the user for anything you cannot verify: venue (full name), short `abbrev` for the chip (e.g. `CoRL`, `RA-L`, `NeurIPS WS`), `type`, and authors marked with † in the paper together with what † means (equal contribution, joint last authors, ...).
2. **Resolve authors** against `src/data/people.yaml`.
   - Match by full name, then by last name + first initial. Mind known variants (e.g. "Cristian Camilo" = `cristian-beltran-hernandez`).
   - If a match is uncertain, **ask** instead of creating a near-duplicate id.
   - New people: id = lowercase `first-last` slug, appended to people.yaml.
3. **Write the entry** in `papers.yaml`. The file is ordered newest first and the order is the display order; insert at the top of its year.
   ```yaml
   - id: clap                 # short, lowercase, unique; used in /publications/<id>/
     title: "CLAP: ..."
     authors: [yuri-ishitoya, jeremy-siburian, mai-nishimura]
     dagger: [yuri-ishitoya, jeremy-siburian, mai-nishimura]   # optional: authors marked with †
     daggerNote: equal contribution  # optional: what the mark means (default), e.g. joint last authors
     daggerMark: †                   # optional: † for equal contribution (default), ‡ for joint last authors
     venue: Conference on Robot Learning
     abbrev: CoRL
     year: 2026
     type: conference         # conference | journal | workshop | preprint
     arxiv: "2607.08974"      # optional, quoted
     links:                   # label → URL; labels are shown as-is
       paper: https://arxiv.org/abs/2607.08974
       project: https://omron-sinicx.github.io/clap/
   ```
4. **Teaser and BibTeX (optional).** If the project page has a teaser image, link it: `teaserUrl: https://.../teaser.png` (confirm it returns 200), and set `teaserWidth` by the *Figure size rule* in `.claude/skills/paper-summary/SKILL.md` (in-figure text ≈ 13 px). Otherwise a local file `src/assets/papers/<id>/teaser.webp` (≤1600px wide) can be set as `teaser: ../assets/papers/<id>/teaser.webp`. If the project page publishes an official BibTeX, copy it into `bibtex: |`; otherwise one is generated. Use only arXiv or project-page figures, never publisher PDFs.
5. **Related projects (optional).** If the project page lists related projects, add them as banners:
   ```yaml
     related:
       - title: "..."
         venue: ACL'26                 # shown in the orange tag
         url: https://omron-sinicx.github.io/dgpo/
         image: https://omron-sinicx.github.io/dgpo/acl26_fig2_v3.png   # optional, remote URL
         description: One sentence.    # optional, clamped to 2 lines
   ```
6. **Verify.** `npm run check && npm run build`. A typo in an author id fails the build with `references unknown person`. Confirm `dist/publications/<id>/index.html` exists.
7. Offer to run the `paper-summary` skill next.
