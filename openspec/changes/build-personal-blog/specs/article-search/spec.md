# Spec Delta

## Purpose

站内搜索帮助访客在已发布文章中定位相关内容，支持中文和英文关键词，并对空查询或无结果的情况给出清楚反馈。

## ADDED Requirements

### Requirement: Search published articles
系统 SHALL 提供搜索页面，按关键词匹配已发布文章的标题、摘要、标签和正文；查询 SHALL 支持中文连续字符与不区分大小写的英文匹配。

#### Scenario: Matching query
- **WHEN** 访客输入与已发布文章内容相符的中文或英文关键词并提交
- **THEN** 搜索结果显示匹配文章的标题、摘要、日期和详情入口

#### Scenario: Draft excluded
- **WHEN** 查询词仅存在于草稿文章
- **THEN** 搜索结果不包含该草稿

### Requirement: Search state feedback
系统 SHALL 在未输入查询和查询无结果时显示明确、可理解的状态，并保留搜索输入以便修改。

#### Scenario: Empty query
- **WHEN** 访客打开搜索页但尚未输入关键词
- **THEN** 页面提示输入关键词，不显示误导性的结果列表

#### Scenario: No results
- **WHEN** 访客提交没有匹配文章的关键词
- **THEN** 页面显示无结果提示和原查询词，允许访客立即修改后重试

### Requirement: Shareable search query
系统 SHALL 使已提交的搜索词反映在页面地址中，直接打开该地址可复现相同查询。

#### Scenario: Open search URL
- **WHEN** 访客直接打开含查询参数的搜索页地址
- **THEN** 页面恢复该查询词并显示对应结果或无结果状态
