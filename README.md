# Blog

基于 Astro 的静态技术博客，支持 Markdown/MDX 文章、笔记、标签、站内搜索、分页和主题切换。

## 本地运行

需要 Node.js 22 或更新版本。

```sh
npm ci
npm run dev
```

构建前可以运行检查：

```sh
npm run check
npm run build
```

## 添加内容

文章放在 `src/content/blog/`，笔记放在 `src/content/notes/`。新增 Markdown 文件并填写元信息，例如：

```md
---
slug: example-post
title: 文章标题
description: 一句话摘要
pubDate: 2026-10-30
tags: [技术]
draft: false
---

正文内容。
```

`slug` 使用小写字母、数字和连字符，并保持唯一。设置 `draft: true` 可让内容不出现在公开页面。笔记可以省略 `tags`。

英文界面位于 `/en/`。文章与笔记的英文稿放在 `src/content/translations/`，元信息填写 `type`（`blog` 或 `notes`）、与中文内容一致的 `slug`、英文 `title` 和 `description`。没有英文稿的内容会在英文界面保留中文并标注原文语言。

## 部署

推送到 `main` 后，GitHub Actions 会自动构建并发布到 GitHub Pages。工作流位于 `.github/workflows/deploy-pages.yml`；站点信息可在 `src/site.config.ts` 中调整。
