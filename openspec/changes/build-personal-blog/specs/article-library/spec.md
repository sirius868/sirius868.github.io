# Spec Delta

## Purpose

文章库负责把作者维护的文章转换为可浏览、可阅读和可订阅的公开内容，并确保草稿不会出现在任何公开入口中。

## ADDED Requirements

### Requirement: Article metadata and publication
系统 SHALL 支持为文章维护唯一 slug、标题、摘要、发布日期、标签、精选标记和草稿状态；公开页面仅包含非草稿文章。

#### Scenario: Publish valid article
- **WHEN** 作者提供有效元信息和正文，且草稿状态为否
- **THEN** 构建后的站点包含该文章的详情页及相应列表入口

#### Scenario: Keep draft private
- **WHEN** 文章被标记为草稿
- **THEN** 公开列表、标签页、搜索结果、站点地图和 RSS 均不包含该文章，且公开站点不生成其详情页

#### Scenario: Reject invalid content
- **WHEN** 两篇文章使用同一 slug，或必填元信息缺失
- **THEN** 构建失败并指出存在问题的文章

### Requirement: Article listing and pagination
系统 SHALL 提供文章列表，按发布日期从新到旧排列，并在文章数量超过单页容量时提供可导航的分页；每项显示标题、日期、摘要和标签。

#### Scenario: Browse first page
- **WHEN** 访客打开文章列表
- **THEN** 页面展示最新的已发布文章及其详情入口

#### Scenario: Browse later page
- **WHEN** 已发布文章数量超过单页容量，且访客打开下一页
- **THEN** 页面展示下一组文章，并提供返回上一页的入口

#### Scenario: Invalid page
- **WHEN** 访客访问不存在的列表页码
- **THEN** 站点返回未找到页面，而非重复展示第一页

### Requirement: Tag filtering
系统 SHALL 从已发布文章生成可用标签，并允许访客按标签查看对应文章。

#### Scenario: Select tag
- **WHEN** 访客点击文章上的标签
- **THEN** 页面仅展示带该标签的已发布文章，并说明当前标签

### Requirement: Article reading
系统 SHALL 为每篇已发布文章提供独立、可直接访问的详情页，显示标题、发布日期、标签、正文和返回文章列表的入口；正文 SHALL 支持标题、链接、图片、列表、引用与代码块。

#### Scenario: Open article
- **WHEN** 访客从列表或直接地址打开已发布文章
- **THEN** 完整正文和文章元信息可供阅读，页面标题与文章标题一致

#### Scenario: Article missing
- **WHEN** 访客访问不存在的文章 slug
- **THEN** 站点显示未找到页面

### Requirement: Subscription and discovery feeds
系统 SHALL 为已发布文章提供 RSS 订阅和站点地图，条目链接使用配置的正式站点地址。

#### Scenario: Read RSS
- **WHEN** 订阅器请求 RSS 地址
- **THEN** 收到包含已发布文章标题、日期、摘要和绝对链接的有效订阅内容
