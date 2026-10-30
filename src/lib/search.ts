import type { Article } from './articles';

export type SearchItem = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  url: string;
  body: string;
};

export function stripMarkdown(source: string): string {
  return source
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchItem(article: Article, body: string): SearchItem {
  return {
    title: article.data.title,
    description: article.data.description,
    date: article.data.pubDate.toISOString(),
    tags: article.data.tags,
    url: `/blog/${article.data.slug}/`,
    body: stripMarkdown(body)
  };
}

export function searchArticles(items: SearchItem[], rawQuery: string): SearchItem[] {
  const query = rawQuery.trim().toLocaleLowerCase();
  if (!query) return [];
  return items.filter((item) =>
    [item.title, item.description, item.tags.join(' '), item.body]
      .some((part) => part.toLocaleLowerCase().includes(query))
  );
}
