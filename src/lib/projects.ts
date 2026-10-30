import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  const slugs = new Set<string>();
  for (const project of projects) {
    if (slugs.has(project.data.slug)) throw new Error(`Duplicate project slug: ${project.data.slug}`);
    slugs.add(project.data.slug);
  }
  return projects
    .filter((project) => !project.data.draft)
    .sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || b.data.year - a.data.year || a.data.slug.localeCompare(b.data.slug));
}
