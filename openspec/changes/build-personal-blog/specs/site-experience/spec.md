# Spec Delta

## Purpose

全站体验保证访客在桌面与移动设备上都能稳定导航、阅读和切换主题，同时让页面具备基本的可访问性与可分享性。

## ADDED Requirements

### Requirement: Core navigation
系统 SHALL 在所有主要页面提供首页、文章、关于和搜索入口，并清楚指示当前页面；移动端导航 SHALL 可用且不遮挡正文。

#### Scenario: Navigate between sections
- **WHEN** 访客使用桌面或移动端导航选择一个核心栏目
- **THEN** 浏览器打开目标页面，当前栏目有可辨认的状态

### Requirement: Responsive reading layout
系统 SHALL 在常见手机和桌面视口下保持可阅读的文字宽度、足够的操作空间，且页面不出现横向溢出。

#### Scenario: Read on narrow viewport
- **WHEN** 访客在宽度约 320 像素的视口打开文章页
- **THEN** 标题、正文和导航无需横向滚动即可阅读和操作

### Requirement: Theme preference
系统 SHALL 提供浅色、深色和跟随系统三种主题模式，首次访问默认使用白色为主的浅色主题，并在后续访问恢复用户选择。

#### Scenario: Choose dark mode
- **WHEN** 访客选择深色模式并刷新或打开另一页面
- **THEN** 页面继续使用深色主题

#### Scenario: Follow system mode
- **WHEN** 访客选择跟随系统，且系统主题发生变化
- **THEN** 页面主题随系统变化

#### Scenario: Preference storage unavailable
- **WHEN** 浏览器无法保存主题偏好
- **THEN** 主题切换仍在当前页面生效，且页面不出现错误

### Requirement: Accessible interaction
系统 SHALL 使用语义化页面结构，并确保导航、搜索及主题控件可通过键盘操作，具有可见焦点与可理解的名称；动效 SHALL 尊重减少动态效果的系统偏好。

#### Scenario: Keyboard navigation
- **WHEN** 访客只使用键盘浏览核心页面
- **THEN** 可访问所有主要链接和控件，并看见当前焦点位置

#### Scenario: Reduced motion
- **WHEN** 系统启用减少动态效果
- **THEN** 非必要动画停止或显著减弱，内容与操作仍可用

### Requirement: Page metadata and fallback
系统 SHALL 为主要页面输出准确的标题、描述、规范地址和分享元信息，并提供可导航的未找到页面。

#### Scenario: Share article
- **WHEN** 访客分享一篇已发布文章的地址
- **THEN** 页面元信息反映该文章的标题、摘要和规范地址

#### Scenario: Unknown route
- **WHEN** 访客打开不存在的页面地址
- **THEN** 站点显示未找到状态及返回首页或文章列表的入口
