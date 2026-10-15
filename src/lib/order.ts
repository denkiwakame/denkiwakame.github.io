import { getCollection, type CollectionKey } from 'astro:content';

type Ordered = 'people' | 'papers' | 'projects' | 'talks' | 'pets' | 'posts' | 'career' | 'press' | 'grants' | 'awards';

/** getCollection() in the order entries are written in the YAML file. */
export async function getOrdered<C extends Ordered & CollectionKey>(collection: C) {
  const entries = await getCollection(collection);
  return entries.sort((a, b) => a.data.order - b.data.order);
}
