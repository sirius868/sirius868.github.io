# 博客操作指南

这份文档说明如何在本地编辑内容、检查页面并发布网站。网站使用 Astro 构建静态页面，内容保存在仓库文件中；线上没有编辑后台。以下命令在仓库根目录执行。

## 1. 本地运行与预览

安装 Node.js 22 或更新版本，然后执行：

```sh
npm ci
npm run dev
```

打开终端显示的本地地址，通常是 `http://127.0.0.1:4321/`。修改 Markdown 或页面文件后，开发服务器会更新页面。发布前执行：

```sh
npm run check
npm run build
npm run preview
```

`check` 检查 Astro 和 TypeScript；`build` 先校验内容元信息，再生成 `dist/`；`preview` 用构建后的文件预览实际发布结果。如果开发服务器仍占用预览端口，先停止开发服务器。`dist/` 是构建产物，不需要手动编辑。

## 2. 写文章

在 `src/content/blog/` 新建一个 `.md` 或 `.mdx` 文件，例如 `my-new-post.md`。文件名便于管理，公开地址由 `slug` 决定：

```md
---
slug: my-new-post
title: 文章标题
description: 一句话介绍文章内容。
pubDate: 2026-10-30
tags: [后端, 工程实践]
featured: false
draft: true
---

这里写开头。

## 第一节

这里写正文。
```

- `slug` 只能使用小写英文字母、数字和连字符，同一类内容中不能重复；这篇文章会出现在 `/blog/my-new-post/`。
- `pubDate` 使用 `YYYY-MM-DD`。文章列表按日期从新到旧排序；同一天的文章再按 `slug` 排序。
- `tags` 用于文章列表中的标签筛选。新增标签会自动生成标签页。
- `featured: true` 让文章参与首页精选；首页最多展示两篇精选文章。
- 写作期间设为 `draft: true`。确认内容可以公开后改为 `draft: false`；草稿不会进入公开页面、RSS 和搜索结果。
- 正文中的 `##`、`###` 标题会生成文章页左侧目录，搜索结果也可定位到相应小节。

保存后先打开文章地址检查标题、段落、图片和链接，再运行 `npm run build`。修改已发布文章时直接编辑原文件；不要随意改动已有 `slug`，否则旧链接会失效。删除已发布文件并重新部署后，原地址也会失效。

## 3. 写笔记

在 `src/content/notes/` 新建 `.md` 或 `.mdx` 文件。笔记不需要标签：

```md
---
slug: a-small-idea
title: 一条小想法
description: 简短摘要。
pubDate: 2026-10-30
draft: true
---

笔记正文。
```

笔记公开后位于 `/notes/a-small-idea/`，按日期排序并自动分页。改为 `draft: false` 后也会进入站内搜索。

## 4. 添加项目

在 `src/content/projects/` 新建 `.md` 文件。项目列表使用卡片切换，项目详情显示 Markdown 正文：

```md
---
slug: example-project
title: 项目名称
description: 项目解决什么问题。
category: 后端项目
year: 2026
stack: [Java, MySQL]
featured: false
draft: true
---

## 背景

介绍项目目标。

## 实现与取舍

说明关键设计和边界。
```

`category`、`year`、`stack` 是必填项；`year` 填数字，不加引号。可选填 `website: https://...` 和 `repository: https://...`；只想展示项目说明时省略这两个字段，页面就不会出现访问网站或查看源码按钮。`featured: true` 将项目排在前面。公开前将 `draft` 改为 `false`，详情地址是 `/projects/example-project/`。

## 5. 添加图片和其他静态文件

把图片放到 `public/images/`，在 Markdown 中使用从网站根目录开始的路径：

```md
![图片说明](/images/example-diagram.png)
```

文件 `public/images/example-diagram.png` 对应线上地址 `/images/example-diagram.png`。不要在链接中写 `public/`。图片文件名建议使用小写英文字母、数字和连字符，并填写能说明内容的替代文字。发布前用本地预览确认图片能打开。页面左上角标识的图片路径可在 `src/layouts/BaseLayout.astro` 中查找，浏览器标签页图标在 `public/favicon.png`；替换同名文件后，浏览器可能需要刷新缓存。

## 6. 英文稿

英文界面位于 `/en/`。英文稿放在 `src/content/translations/`，使用 `.md` 文件；它必须对应一篇已有的中文文章、笔记或项目。例子：

```md
---
type: blog
slug: my-new-post
title: English title
description: A short English summary.
---

English body.
```

`type` 可填 `blog`、`notes` 或 `projects`，`slug` 必须与对应中文内容一致。翻译文章和笔记时，不需要在英文稿里重复日期、标签等字段；这些信息沿用中文稿。文件名可按 `my-new-post.en.md` 命名，方便辨认。同一内容不要放两份英文稿。没有英文稿时，英文页面会保留中文原文并作语言标注。检查 `/en/` 下的列表、详情和搜索结果是否符合预期。

## 7. 修改站点内容与外观

- 站点名称、简介、首页介绍、关于页文字和教育信息：`src/site.config.ts`。
- 导航与页脚的中英文文案：`src/lib/locale.ts`；页面专属文字在对应的 `src/pages/` 文件中。
- 颜色、明暗主题、通用布局：`src/styles/global.css`；页面局部样式在对应的 `.astro` 文件中。
- 首页精选文章数量和最近文章布局：`src/pages/index.astro`、`src/pages/en/index.astro`。
- 每页文章数量：`src/lib/articles.ts` 的 `PAGE_SIZE`；笔记目前沿用这个值。修改后检查分页地址和页码是否正确。
- 搜索范围与结果预览：`src/pages/search-index.json.ts`、`src/pages/en/search-index.json.ts` 和 `src/lib/search.ts`。搜索框外观由 `src/components/SearchForm.astro` 统一管理。

修改后用浏览器分别检查桌面、手机宽度和深色主题。主题切换是访客在浏览器中的设置，不需要为每篇内容单独配置。

## 8. 发布到 GitHub Pages

当前工作流位于 `.github/workflows/deploy-pages.yml`，推送 `main` 会自动运行检查、构建和部署。首次使用一个新的仓库时，先在 GitHub 仓库的 **Settings → Pages** 中把 **Build and deployment → Source** 设为 **GitHub Actions**。确认工作流中的 `PUBLIC_SITE_URL` 是最终站点地址；当前地址为 `https://sirius868.github.io/`。

确认本地检查通过后提交并推送：

```sh
git status
git add src/content/blog/my-new-post.md
git commit -m "Update blog content"
git push origin main
```

`git add` 中的路径只是文章示例，换成这次准备发布的实际文件；提交前用 `git status` 核对暂存内容。推送后在 GitHub 仓库的 **Actions** 查看 **Deploy GitHub Pages** 是否成功，再打开线上页面核对新内容。新增公开文章、笔记或项目会在构建时进入对应列表和搜索索引，不需要手动编辑索引。若修改了仓库名、域名或部署路径，先同步调整 `PUBLIC_SITE_URL` 和相关站内路径，再重新构建验证。

## 9. 常见问题

| 现象 | 检查位置 |
| --- | --- |
| 新内容不在列表或搜索里 | 检查 `draft` 是否为 `false`，再确认提交、推送与 Pages 构建是否成功。 |
| 构建报告缺少字段、日期错误或重复 `slug` | 检查文件顶部两条 `---` 之间的 YAML；`npm run build` 会运行内容校验。 |
| 图片打不开 | 确认文件在 `public/images/`，Markdown 地址以 `/images/` 开头，并核对大小写。 |
| 英文页仍显示中文 | 检查英文稿的 `type`、`slug` 是否与已发布中文内容匹配，且没有重复英文稿。 |
| Pages 页面还是旧版本 | 查看对应提交的 Actions 运行结果；部署成功后刷新页面，图标等静态资源可能受浏览器缓存影响。 |
| 本地依赖或构建异常 | 确认 Node.js 版本，重新执行 `npm ci`、`npm run check`、`npm run build`，根据第一条错误信息定位文件。 |
