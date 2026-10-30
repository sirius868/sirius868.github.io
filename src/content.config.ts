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

export const collections = { blog, notes };
