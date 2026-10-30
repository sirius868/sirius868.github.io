import type { APIRoute } from 'astro';
import { render } from 'astro:content';
import { getPublishedArticles } from '../lib/articles';
import { getPublishedNotes } from '../lib/notes';
import { articleSearchItem, noteSearchItem } from '../lib/search';

export const GET: APIRoute = async () => {
  const [articles, notes] = await Promise.all([getPublishedArticles(), getPublishedNotes()]);
  const articleItems = await Promise.all(articles.map(async (article) => {
    const { headings } = await render(article);
    return articleSearchItem(article, article.body || '', headings);
  }));
  const items = [
    ...articleItems,
    ...notes.map((note) => noteSearchItem(note, note.body || ''))
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
