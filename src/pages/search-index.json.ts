import type { APIRoute } from 'astro';
import { getPublishedArticles } from '../lib/articles';
import { searchItem } from '../lib/search';

export const GET: APIRoute = async () => {
  const articles = await getPublishedArticles();
  const items = await Promise.all(articles.map(async (article) => {
    return searchItem(article, article.body || '');
  }));
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
