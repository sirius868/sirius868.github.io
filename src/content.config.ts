import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    tags: z.array(z.string().min(1)).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false)
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    year: z.number().int().min(2000),
    stack: z.array(z.string().min(1)).min(1),
    repository: z.string().url().optional(),
    website: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

const translations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/translations' }),
  schema: z.object({
    type: z.enum(['blog', 'notes', 'projects']),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    description: z.string().min(1)
  })
});

export const collections = { blog, notes, projects, translations };
