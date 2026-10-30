# yhblog

一个以文章阅读为中心的静态个人博客，使用 Astro、TypeScript 和 Markdown/MDX 构建。当前作者名和站点名已设置为 `yh`、`yhblog`；仓库中的公开文章是经用户同意保留的演示内容。

视觉以白色为主、黑色系为辅。页头显示 `blog` 并使用用户提供的 yh 标识，favicon 也来自该标识；页面标题与站点配置仍使用 `yhblog`。首页图案与“阅读文章”按钮有轻动效，启用系统“减少动态效果”时会保持静态。页头随滚动收成浮动工具栏；主题切换使用站点风格菜单，支持键盘操作。

## 本地运行

需要 Node.js 22 或更新版本。

```sh
npm install
npm run dev
```

打开 `http://127.0.0.1:4321/`。生产构建与检查：

文章列表支持上一页、下一页和输入页码直接跳转。
顶部“笔记”栏目展示简短记录，笔记详情有独立地址。
文章和笔记列表均为每页 **4 条**；超过 4 条时显示上一页、下一页和页码跳转。
文章和笔记列表均为每页 **4 条**；超过 4 条时显示上一页、下一页和页码跳转。

```sh
npm run check
npm run build
npm run preview
```

`npm run build` 会先验证文章元信息与 slug 唯一性，再生成 `dist/`。浏览器回归测试先在一个终端运行 `npm run dev`，再在另一终端运行 `npm run test:e2e`；测试默认使用本机 Chrome。

## 写文章

在 `src/content/blog/` 新增 `.md` 或 `.mdx` 文件。示例：

```md
---
slug: my-first-post
title: 我的第一篇文章
description: 一段适合列表和分享卡片显示的摘要。
pubDate: 2026-10-30
tags: [写作, 日常]
featured: false
draft: false
---

正文从这里开始。
```

- `slug` 必须唯一，只能使用小写英文字母、数字和连字符；文章地址为 `/blog/<slug>/`。
- `title`、`description`、`pubDate` 为必填。日期请使用 `YYYY-MM-DD`。
- `tags`、`featured`、`draft` 可省略。`draft: true` 的文章不会进入公开页面、搜索、RSS 或站点地图。
- 插入图片时写明有意义的替代文本，例如 `![流程图：记录到重写](/images/notes.svg)`。静态图片可放在 `public/images/`。
- 标题按层级使用 `##`、`###`；代码块标明语言。正文支持 Markdown 与 MDX。
- 写完运行 `npm run build`，检查生成的文章页，然后重新部署 `dist/` 才会发布新内容。

## 写笔记

在 `src/content/notes/` 新增 `.md` 或 `.mdx` 文件，格式与文章相近：

```md
---
slug: a-small-thought
title: 一个小想法
description: 用一句话说明这条笔记。
pubDate: 2026-10-30
draft: false
---

写下你的笔记正文。
```

笔记需要唯一的 `slug`，以及 `title`、`description`、`pubDate`。`draft: true` 会将笔记排除在公开页面之外。保存后运行 `npm run build`，预览 `/notes/` 和对应的笔记详情页；重新部署 `dist/` 后内容才会上线。

## 作者资料与部署

编辑 `src/site.config.ts` 中的站点名称、简介、关于页文案、经历与外部链接。未配置的经历或链接栏目自动隐藏。正式域名通过 `PUBLIC_SITE_URL` 提供，它会用于 canonical、RSS 和站点地图中的绝对地址。例如在部署平台设置 `PUBLIC_SITE_URL=https://your-domain.example`，再执行 `npm run build`。不要把这个例子地址直接用于正式站点。

任何能托管静态文件的平台都可以部署 `dist/`。部署配置为：构建命令 `npm run build`，输出目录 `dist`。首次部署和每次改动域名后，检查实际页面的 canonical、`rss.xml` 与 `sitemap-index.xml`。

### 发布前检查清单

- [ ] `src/site.config.ts` 中的 `yh`、`yhblog`、简介与关于页文字符合你的最终资料；如需经历或社交链接，填写真实信息并逐个打开检查。
- [ ] 确认 `public/images/yh-logo.png` 和 `public/favicon.png` 是要发布的标识版本。
- [ ] 决定是否保留演示文章；当前选择是保留为可运行演示，正式展示前可替换为自己的文章。
- [ ] 在部署环境设置你拥有的正式域名 `PUBLIC_SITE_URL`，确保生成产物中不含 `localhost:4321` 或示例域名。
- [ ] 运行 `npm run check`、`npm run build` 和 `npm run test:e2e`；抽查首页、文章分页、标签、详情、关于、搜索与主题切换。
- [ ] 检查 `dist/search-index.json`、`dist/rss.xml` 和站点地图没有草稿内容，文章链接均使用正式域名。

当前没有提供正式域名或社交链接；在这些值配置前，构建产物适合本地预览，发布检查清单中的域名项不会通过。
