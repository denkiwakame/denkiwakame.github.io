import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';
import { parse } from 'yaml';
import { ART_KINDS } from './lib/art';

/**
 * getCollection() returns entries sorted by id, not file order.
 * Record each entry's position so lists keep the order written in YAML (see src/lib/order.ts).
 */
const ordered = (path: string) =>
  file(path, {
    parser: (text) => (parse(text) as Record<string, unknown>[]).map((entry, order) => ({ ...entry, order })),
  });
const order = z.number().int();

const links = z.record(z.string(), z.url()).default({});

const profile = defineCollection({
  loader: file('src/data/profile.yaml'),
  schema: z.object({
    name: z.string(),
    handle: z.string(),
    role: z.string(),
    degree: z.string(),
    location: z.string(),
    keywords: z.array(z.string()),
    description: z.string(),
    socials: z.array(
      z.object({
        kind: z.enum(['github', 'x', 'linkedin', 'scholar', 'dblp', 'speakerdeck', 'mail']),
        label: z.string(),
        url: z.string().regex(/^(https:\/\/|mailto:)/),
      }),
    ),
    cvDriveId: z.string().regex(/^[\w-]{20,}$/).optional(),
    service: z.string(),
    footer: z.string(),
  }),
});

const people = defineCollection({
  loader: ordered('src/data/people.yaml'),
  schema: z.object({
    order,
    name: z.string(),
    url: z.url().optional(),
    me: z.boolean().default(false),
  }),
});

const papers = defineCollection({
  loader: ordered('src/data/papers.yaml'),
  schema: ({ image }) =>
    z.object({
      order,
      title: z.string(),
      authors: z.array(reference('people')).min(1),
      /** Authors marked with † and what the mark means (equal contribution, joint last authors, ...). */
      dagger: z.array(reference('people')).default([]),
      daggerNote: z.string().default('equal contribution'),
      /** The mark itself: † for equal contribution, ‡ for joint last authors, ... */
      daggerMark: z.string().default('†'),
      venue: z.string(),
      abbrev: z.string(),
      /** Year shown on the site: for journals, the year of first (early-access) publication. */
      year: z.number().int(),
      /** Year of the issue/proceedings for BibTeX, when it differs from `year` (e.g. RA-L early access vs. issue). */
      pubYear: z.number().int().optional(),
      type: z.enum(['conference', 'journal', 'workshop', 'preprint']),
      doi: z.string().regex(/^10\.\d{4,9}\/\S+$/).optional(),
      volume: z.string().optional(),
      number: z.string().optional(),
      pages: z.string().optional(),
      award: z.string().optional(),
      /** Local teaser (optimized at build) or a remote URL, e.g. from the project page. */
      teaser: image().optional(),
      teaserUrl: z.url().optional(),
      /** Max display width in px, chosen so text inside the figure renders at ~13px (see paper-summary skill). */
      teaserWidth: z.number().int().positive().optional(),
      arxiv: z.string().regex(/^\d{4}\.\d{4,5}$/).optional(),
      links,
      bibtex: z.string().optional(),
      /** Related projects shown as banners at the end of the paper page. */
      related: z
        .array(
          z.object({
            title: z.string(),
            url: z.url(),
            venue: z.string(),
            image: z.url().optional(),
            description: z.string().optional(),
          }),
        )
        .default([]),
    }),
});

const projects = defineCollection({
  loader: ordered('src/data/projects.yaml'),
  schema: ({ image }) =>
    z.object({
      order,
      title: z.string(),
      description: z.string(),
      pinned: z.boolean().default(false),
      art: z.enum(ART_KINDS),
      teaser: image().optional(),
      papers: z.array(reference('papers')).default([]),
      press: z.array(reference('press')).default([]),
      tags: z.array(z.string()).default([]),
      venues: z.array(z.string()).default([]),
      links,
    }),
});

const talks = defineCollection({
  loader: ordered('src/data/talks.yaml'),
  schema: z.object({
    order,
    title: z.string(),
    venue: z.string().optional(),
    date: z.string(),
    deckId: z.string().optional(),
    link: z.url(),
    /** Event / lecture page. */
    event: z.url().optional(),
  }),
});

const pets = defineCollection({
  loader: ordered('src/data/pets.yaml'),
  schema: z.object({ order, title: z.string(), techs: z.string(), link: z.url() }),
});

const posts = defineCollection({
  loader: ordered('src/data/posts.yaml'),
  schema: z.object({ order, title: z.string(), tag: z.string(), link: z.url() }),
});

const career = defineCollection({
  loader: ordered('src/data/career.yaml'),
  schema: z.object({
    order,
    kind: z.enum(['experience', 'education', 'break']),
    years: z.string(),
    title: z.string(),
    org: z.string().optional(),
  }),
});

const press = defineCollection({
  loader: ordered('src/data/press.yaml'),
  schema: z.object({ order, title: z.string(), source: z.string(), link: z.url() }),
});

const grants = defineCollection({
  loader: ordered('src/data/grants.yaml'),
  schema: z.object({ order, program: z.string(), role: z.string(), subject: z.string(), years: z.string() }),
});

const awards = defineCollection({
  loader: ordered('src/data/awards.yaml'),
  schema: z.object({ order, title: z.string(), org: z.string(), year: z.string() }),
});

const summaries = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/summaries' }),
  schema: ({ image }) =>
    z.object({
      paper: reference('papers'),
      lang: z.enum(['en', 'ja']).default('en'),
      tldr: z.string().max(200),
      // Demo videos / GIFs only (shown in a carousel). Still images go in the body as ![caption](url).
      demos: z
        .array(
          z
            .object({ video: z.url().optional(), url: z.url().optional(), caption: z.string() })
            .refine((d) => (d.video ? !d.url : !!d.url && /\.gif(\?|$)/i.test(d.url)), {
              message: 'a demo is either `video:` (mp4/webm) or `url:` pointing to a .gif; put still images in the body',
            }),
        )
        .max(4)
        .default([]),
      reviewed: z.boolean().default(false),
    }),
});

export const collections = { profile, people, papers, projects, talks, pets, posts, career, press, grants, awards, summaries };
