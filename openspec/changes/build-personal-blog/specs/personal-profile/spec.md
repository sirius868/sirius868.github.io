# Spec Delta

## Purpose

个人资料页面集中呈现作者背景、经历和公开联系方式，让访客了解网站背后的人，并通过作者主动配置的渠道建立联系。

## ADDED Requirements

### Requirement: About page
系统 SHALL 提供可直接访问的关于页面，展示可配置的个人介绍和经历；未提供的可选栏目 SHALL 隐藏，不显示占位文案。

#### Scenario: Read author profile
- **WHEN** 访客打开关于页面
- **THEN** 页面显示作者名称、个人介绍及已配置的经历内容

#### Scenario: Optional experience absent
- **WHEN** 作者没有配置经历内容
- **THEN** 关于页面保留个人介绍并隐藏经历栏目

### Requirement: External profile links
系统 SHALL 仅展示作者配置的外部社交或联系链接，并为每个链接提供可理解的名称。

#### Scenario: Open configured link
- **WHEN** 访客点击已配置的外部链接
- **THEN** 浏览器打开对应地址，链接文字能识别目标平台或联系方式

#### Scenario: No links configured
- **WHEN** 作者未配置任何外部链接
- **THEN** 页面不显示空的链接列表或失效入口
