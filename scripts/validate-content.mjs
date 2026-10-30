import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parse } from 'yaml';

const roots = ['blog', 'notes'];
const files = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.mdx?$/.test(entry.name)) files.push(path);
  }
}

for (const section of roots) {
  const root = new URL(`../src/content/${section}/`, import.meta.url);
  await walk(root.pathname.replace(/^\/(?=[A-Za-z]:)/, ''));
}
const slugs = { blog: new Map(), notes: new Map() };
const errors = [];
for (const file of files) {
  const name = relative(process.cwd(), file);
  const section = name.includes('content\\notes\\') || name.includes('content/notes/') ? 'notes' : 'blog';
  const source = await readFile(file, 'utf8');
  const frontmatter = /^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!frontmatter) { errors.push(`${name}: missing YAML frontmatter`); continue; }
  let data;
  try { data = parse(frontmatter[1]); }
  catch (error) { errors.push(`${name}: invalid YAML (${error.message})`); continue; }
  for (const field of ['slug', 'title', 'description', 'pubDate']) {
    if (data?.[field] === undefined || data[field] === null || String(data[field]).trim() === '') errors.push(`${name}: missing ${field}`);
  }
  if (typeof data?.slug === 'string') {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) errors.push(`${name}: invalid slug ${data.slug}`);
    const previous = slugs[section].get(data.slug);
    if (previous) errors.push(`${name}: Duplicate ${section === 'notes' ? 'note' : 'article'} slug ${data.slug} (also in ${previous})`);
    slugs[section].set(data.slug, name);
  }
  if (data?.pubDate && Number.isNaN(Date.parse(String(data.pubDate)))) errors.push(`${name}: invalid pubDate`);
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} content files.`);
}
