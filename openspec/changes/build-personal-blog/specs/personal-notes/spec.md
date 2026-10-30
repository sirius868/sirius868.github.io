# Spec Delta

## Purpose

笔记栏目用于发布比博客文章更简短的想法和记录，让访客按时间浏览并打开完整内容，同时让作者保留尚未准备公开的草稿。

## ADDED Requirements

### Requirement: Notes listing
系统 SHALL 提供可直接访问的笔记列表，按发布日期从新到旧展示已发布笔记的标题、日期、摘要和详情入口；每页展示最多 4 条，并提供与文章列表一致的翻页和页码跳转。

#### Scenario: Browse notes
- **WHEN** 访客打开笔记列表页
- **THEN** 页面展示已发布笔记及其详情链接

#### Scenario: No notes
- **WHEN** 没有已发布笔记
- **THEN** 页面显示明确的暂无笔记提示

#### Scenario: More than one page
- **WHEN** 已发布笔记超过 4 条
- **THEN** 页面提供下一页入口和页码跳转，直接打开第二页可看到后续笔记

### Requirement: Note detail
系统 SHALL 为已发布笔记提供独立详情页，显示标题、日期和 Markdown/MDX 正文，并提供返回笔记列表的入口。

#### Scenario: Open note
- **WHEN** 访客从列表或直接地址打开笔记
- **THEN** 页面显示完整笔记内容和返回入口

### Requirement: Note publication
系统 SHALL 校验笔记的唯一 slug、标题、摘要和发布日期；草稿笔记 SHALL 不生成公开详情，也不出现在列表或站点地图中。

#### Scenario: Draft note
- **WHEN** 笔记标记为草稿
- **THEN** 公开站点不展示该笔记，也不生成其详情页

#### Scenario: Invalid note
- **WHEN** 笔记缺少必填元信息或与另一笔记使用相同 slug
- **THEN** 构建失败并指出问题文件
