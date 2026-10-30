import { getCollection, type CollectionEntry } from 'astro:content';
import { PAGE_SIZE, pageCount } from './articles';

export type Note = CollectionEntry<'notes'>;

export function publishedNotes(entries: Note[]): Note[] {
  const slugs = new Set<string>();
  for (const entry of entries) {
    if (slugs.has(entry.data.slug)) throw new Error(`Duplicate note slug: ${entry.data.slug}`);
    slugs.add(entry.data.slug);
  }
  return entries.filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || a.data.slug.localeCompare(b.data.slug));
}

let cached: Promise<Note[]> | undefined;
export function getPublishedNotes(): Promise<Note[]> {
  cached ??= getCollection('notes').then(publishedNotes);
  return cached;
}

export function noteUrl(note: Note): string {
  return `/notes/${note.data.slug}/`;
}

export const NOTE_PAGE_SIZE = PAGE_SIZE;
export function notePageCount(count: number): number { return pageCount(count); }
export function notePageSlice(notes: Note[], page: number): Note[] {
  return notes.slice((page - 1) * NOTE_PAGE_SIZE, page * NOTE_PAGE_SIZE);
}
