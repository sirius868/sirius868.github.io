import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  integrations: [mdx(), sitemap()]
});
