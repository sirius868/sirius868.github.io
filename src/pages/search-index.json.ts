import type { APIRoute } from 'astro';
import { getPublishedArticles } from '../lib/articles';
import { getPublishedNotes } from '../lib/notes';
import { articleSearchItem, noteSearchItem } from '../lib/search';

export const GET: APIRoute = async () => {
  const [articles, notes] = await Promise.all([getPublishedArticles(), getPublishedNotes()]);
  const items = [
    ...articles.map((article) => articleSearchItem(article, article.body || '')),
    ...notes.map((note) => noteSearchItem(note, note.body || ''))
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
