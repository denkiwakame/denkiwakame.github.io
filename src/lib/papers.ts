import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { getOrdered } from './order';

export type Paper = CollectionEntry<'papers'>;
export type Summary = CollectionEntry<'summaries'>;

export interface Author {
  id: string;
  name: string;
  /** "R. Kotoge" style, as shown in compact lists. */
  short: string;
  url?: string;
  me: boolean;
  /** Marked with † (meaning given by the paper's daggerNote). */
  dagger: boolean;
}

/** "Cristian C. Beltran-Hernandez" → "C. C. Beltran-Hernandez" */
const shorten = (name: string) => {
  const parts = name.split(/\s+/);
  const last = parts.pop()!;
  return [...parts.map((p) => `${p[0]}.`), last].join(' ');
};

/**
 * Resolve author references. Astro only logs broken references, so throw here
 * to make a typo in papers.yaml fail the build.
 */
export async function resolveAuthors(paper: Paper): Promise<Author[]> {
  const marked = new Set(paper.data.dagger.map((r) => r.id));
  return Promise.all(
    paper.data.authors.map(async (ref) => {
      const person = await getEntry(ref);
      if (!person) throw new Error(`papers.yaml: "${paper.id}" references unknown person "${ref.id}"`);
      const { name, url, me } = person.data;
      return { id: ref.id, name, short: shorten(name), url, me, dagger: marked.has(ref.id) };
    }),
  );
}

/** All papers in papers.yaml order (newest first). */
export const getPapers = () => getOrdered('papers');

/**
 * The summary shown for a paper. Unreviewed drafts are visible in `astro dev` only.
 */
export async function getSummary(paperId: string, lang: 'en' | 'ja' = 'en'): Promise<Summary | undefined> {
  const summaries = await getCollection(
    'summaries',
    ({ data }) => data.paper.id === paperId && data.lang === lang && (data.reviewed || import.meta.env.DEV),
  );
  return summaries[0];
}

/** Short venue label with two-digit year, e.g. "ACL 26". */
export const venueLabel = (paper: Paper) => `${paper.data.abbrev} ${String(paper.data.year).slice(2)}`;

/** BibTeX from papers.yaml, unless the entry provides its own. Uses the issue year (`pubYear`) when set. */
export function toBibtex(paper: Paper, authors: Author[]): string {
  if (paper.data.bibtex) return paper.data.bibtex.trim();
  const { title, venue, year, pubYear, type, arxiv, doi, volume, number, pages } = paper.data;
  const citeYear = pubYear ?? year;
  const first = authors[0].name.split(/\s+/).pop()!.toLowerCase().replace(/[^a-z]/g, '');
  const word = title.split(/[\s:]+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const kind = type === 'journal' ? 'article' : type === 'preprint' ? 'misc' : 'inproceedings';
  const opt = (k: string, v?: string): [string, string][] => (v ? [[k, v]] : []);
  const fields: [string, string][] = [
    ['title', `{${title}}`],
    ['author', authors.map((a) => a.name).join(' and ')],
    ...opt('journal', type === 'journal' ? venue : undefined),
    ...opt('booktitle', type === 'conference' || type === 'workshop' ? venue : undefined),
    ...opt('volume', volume),
    ...opt('number', number),
    ...opt('pages', pages?.replace(/-+/g, '--')),
    ['year', String(citeYear)],
    ...opt('doi', doi),
    ...(arxiv && !doi ? ([['eprint', arxiv], ['archivePrefix', 'arXiv']] as [string, string][]) : []),
  ];
  return `@${kind}{${first}${citeYear}${word},\n${fields.map(([k, v]) => `  ${k} = {${v}}`).join(',\n')}\n}`;
}

/** Every summary uses exactly these ## sections, in this order (checked at build time). */
export const SUMMARY_SECTIONS = ['Motivation', 'Approach', 'Key results', 'Conclusion'] as const;

export function assertSummarySections(summary: Summary, headings: { depth: number; text: string }[]) {
  const found = headings.filter((h) => h.depth === 2).map((h) => h.text.trim());
  const ok = found.length === SUMMARY_SECTIONS.length && found.every((t, i) => t === SUMMARY_SECTIONS[i]);
  if (!ok)
    throw new Error(
      `summaries/${summary.id}.md: sections must be ${SUMMARY_SECTIONS.map((s) => `"## ${s}"`).join(', ')} in order; found ${JSON.stringify(found)}`,
    );
}
