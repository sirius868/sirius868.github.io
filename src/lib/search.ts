import type { Article } from './articles';
import type { Note } from './notes';

export type SearchItem = {
  type: 'article' | 'note';
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
    .replace(/```[^\n]*\n?/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function articleSearchItem(article: Article, body: string): SearchItem {
  return {
    type: 'article',
    title: article.data.title,
    description: article.data.description,
    date: article.data.pubDate.toISOString(),
    tags: article.data.tags,
    url: `/blog/${article.data.slug}/`,
    body: stripMarkdown(body)
  };
}

export function noteSearchItem(note: Note, body: string): SearchItem {
  return {
    type: 'note',
    title: note.data.title,
    description: note.data.description,
    date: note.data.pubDate.toISOString(),
    tags: [],
    url: `/notes/${note.data.slug}/`,
    body: stripMarkdown(body)
  };
}

export function searchContent(items: SearchItem[], rawQuery: string): SearchItem[] {
  const query = rawQuery.trim().toLocaleLowerCase();
  if (!query) return [];
  return items.filter((item) =>
    [item.title, item.description, item.tags.join(' '), item.body]
      .some((part) => part.toLocaleLowerCase().includes(query))
  );
}
