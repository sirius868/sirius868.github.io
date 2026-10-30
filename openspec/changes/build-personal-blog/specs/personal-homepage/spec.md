# Spec Delta

## Purpose

个人首页帮助首次访问者迅速认识作者和博客主题，并从精选及近期内容进入阅读，同时在内容尚少时保持完整、可信的呈现。

## ADDED Requirements

### Requirement: Author introduction
系统 SHALL 在首页展示可配置的作者名称、简短介绍和通往关于页面的入口。

#### Scenario: Visit homepage
- **WHEN** 访客打开首页
- **THEN** 页面显示作者名称、简介和可用的关于页面链接

### Requirement: Featured and recent articles
系统 SHALL 在首页展示已发布的精选文章和近期文章，并为每篇文章提供标题、发布日期、摘要及详情入口；同一文章不应在两个区域重复。

#### Scenario: Featured content exists
- **WHEN** 内容库中有已发布的精选文章和其他近期文章
- **THEN** 首页先展示精选文章，再按发布日期从新到旧展示近期文章，且文章入口指向对应详情页

#### Scenario: No published articles
- **WHEN** 内容库中没有已发布文章
- **THEN** 首页显示明确的暂无文章提示，且不展示失效的文章链接

### Requirement: Browse all articles
系统 SHALL 在首页提供通往完整文章列表的清晰入口。

#### Scenario: Open article library
- **WHEN** 访客点击首页的全部文章入口
- **THEN** 浏览器打开文章列表页
