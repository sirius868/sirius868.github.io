import type { APIRoute } from 'astro';
import { render } from 'astro:content';
import { getPublishedArticles } from '../lib/articles';
import { getPublishedNotes } from '../lib/notes';
import { getPublishedProjects } from '../lib/projects';
import { articleSearchItem, noteSearchItem, projectSearchItem } from '../lib/search';

export const GET: APIRoute = async () => {
  const [articles, notes, projects] = await Promise.all([getPublishedArticles(), getPublishedNotes(), getPublishedProjects()]);
  const articleItems = await Promise.all(articles.map(async (article) => {
    const { headings } = await render(article);
    return articleSearchItem(article, article.body || '', headings);
  }));
  const items = [
    ...articleItems,
    ...notes.map((note) => noteSearchItem(note, note.body || '')),
    ...await Promise.all(projects.map(async (project) => {
      const { headings } = await render(project);
      return projectSearchItem(project, project.body || '', headings);
    }))
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
