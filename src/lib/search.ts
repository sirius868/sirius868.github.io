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
  sections: SearchSection[];
};

export type SearchSection = { title: string; slug: string; body: string };
export type SearchPreview = { location: string; excerpt: string; url: string };

type Heading = { depth: number; slug: string; text: string };

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

export function contentSections(source: string, headings: Heading[] = []): SearchSection[] {
  const sections: SearchSection[] = [{ title: '开头', slug: '', body: '' }];
  const matchingHeadings = headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
  let headingIndex = 0;
  let fenced = false;
  for (const line of source.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) fenced = !fenced;
    const heading = !fenced && /^#{2,3}\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) {
      const rendered = matchingHeadings[headingIndex++];
      sections.push({ title: rendered?.text || stripMarkdown(heading[1]), slug: rendered?.slug || '', body: '' });
    } else {
      sections[sections.length - 1].body += `${line}\n`;
    }
  }
  return sections.map((section) => ({ ...section, body: stripMarkdown(section.body) }));
}

export function articleSearchItem(article: Article, body: string, headings: Heading[] = []): SearchItem {
  return {
    type: 'article',
    title: article.data.title,
    description: article.data.description,
    date: article.data.pubDate.toISOString(),
    tags: article.data.tags,
    url: `/blog/${article.data.slug}/`,
    body: stripMarkdown(body),
    sections: contentSections(body, headings)
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
    body: stripMarkdown(body),
    sections: [{ title: '正文', slug: '', body: stripMarkdown(body) }]
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

export function searchPreview(item: SearchItem, rawQuery: string): SearchPreview {
  const query = rawQuery.trim();
  const lowerQuery = query.toLocaleLowerCase();
  const section = item.sections.find((part) => part.body.toLocaleLowerCase().includes(lowerQuery))
    || item.sections.find((part) => part.title.toLocaleLowerCase().includes(lowerQuery));
  const source = section?.body || item.description;
  const matchAt = source.toLocaleLowerCase().indexOf(lowerQuery);
  const start = Math.max(0, matchAt - 55);
  const end = Math.min(source.length, (matchAt < 0 ? 0 : matchAt) + Math.max(query.length, 70));
  const excerpt = `${start > 0 ? '…' : ''}${source.slice(start, end)}${end < source.length ? '…' : ''}`;
  return {
    location: section ? section.title : item.title.toLocaleLowerCase().includes(lowerQuery) ? '标题' : '摘要或标签',
    excerpt: excerpt || item.description,
    url: section?.slug ? `${item.url}#${encodeURIComponent(section.slug)}` : item.url
  };
}
