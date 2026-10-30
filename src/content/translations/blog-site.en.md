---
type: projects
slug: blog-site
title: Blog
description: A static technical blog built for reading, with articles, notes, search, and Chinese and English interfaces.
---

This is the site you are reading. It brings technical articles and short notes together, with an emphasis on reading, finding content, and maintaining it over time.

## What it solves

Technical writing should be easy to find and comfortable to read. Article pages include a table of contents and reading progress; lists have tags and pagination. Search shows where a match appears and can link to the relevant section.

## How it works

Astro turns Markdown content into static pages. A search index is generated during the build and queried in the browser. New published content becomes searchable after the next build. The Chinese and English interfaces share the same structure, while untranslated content is clearly labeled.

## Tradeoffs

Static hosting keeps deployment simple on GitHub Pages. Editing happens in Markdown files in the repository, rather than through an online admin panel. This page will continue to reflect the site's actual implementation as it evolves.
