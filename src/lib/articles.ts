import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'blog'>;
export const PAGE_SIZE = 4;

export function publishedArticles(entries: Article[]): Article[] {
  const slugs = new Set<string>();
  for (const entry of entries) {
    if (slugs.has(entry.data.slug)) throw new Error(`Duplicate article slug: ${entry.data.slug}`);
    slugs.add(entry.data.slug);
  }
  return entries
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || a.data.slug.localeCompare(b.data.slug));
}

let cached: Promise<Article[]> | undefined;
export function getPublishedArticles(): Promise<Article[]> {
  cached ??= getCollection('blog').then(publishedArticles);
  return cached;
}

export function articleUrl(article: Article): string {
  return `/blog/${article.data.slug}/`;
}

export function dateText(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}

export function pageCount(count: number): number {
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
}

export function pageSlice(articles: Article[], page: number): Article[] {
  return articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}
