---
slug: blog-site
title: Blog
description: 一个以阅读体验为中心的静态技术博客，支持文章、笔记、搜索和中英文界面。
category: 个人网站
year: 2026
stack: [Astro, TypeScript, Markdown, GitHub Pages]
repository: https://github.com/sirius868/sirius868.github.io
website: https://sirius868.github.io/
featured: true
draft: false
---

这个项目就是你正在浏览的网站。它用来整理技术文章和随手笔记，也持续打磨阅读、检索和内容维护的体验。

## 想解决什么

技术文章需要能被找到，也要适合持续阅读。因此页面把正文放在中心，提供文章目录、阅读进度、标签和分页；搜索会展示命中内容的位置，方便直接跳到相关小节。

## 如何实现

网站基于 Astro 构建，文章和笔记用 Markdown 管理，构建时生成静态页面。搜索索引也在构建时生成，由浏览器在本地完成查询；新增公开内容后重新构建，就能进入搜索结果。中英文界面共用页面结构，未翻译的内容会明确标注原文语言。

## 取舍

静态站点适合当前以内容展示为主的需求：部署简单，页面可以直接托管在 GitHub Pages。它没有在线编辑后台；更新内容需要修改仓库里的 Markdown 文件并重新发布。随着项目继续演进，这一页也会记录真实的实现变化。
