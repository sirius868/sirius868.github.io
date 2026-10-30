export type Locale = 'zh' | 'en';

export const copy = {
  zh: {
    home: '首页', blog: '文章', notes: '笔记', about: '关于', search: '搜索',
    skip: '跳到正文', theme: '选择主题', light: '浅色', dark: '深色', system: '跟随系统',
    openMenu: '打开导航菜单', mainNav: '主导航', mobileNav: '移动端主导航',
    footer: '记录技术问题与实践过程。', original: '这篇内容暂时只有中文版。',
    backArticles: '← 返回文章', moreArticles: '← 更多文章', backNotes: '← 返回笔记', moreNotes: '← 更多笔记',
    toc: '本文目录', progress: '文章阅读进度', featured: '精选文章',
    filter: '按标签筛选', all: '全部', expandTags: '展开标签', collapseTags: '收起标签',
    previous: '← 上一页', next: '下一页 →', pageTarget: '目标页码', pageJump: '跳转到指定页',
    noArticles: '暂时没有已发布的文章。', noNotes: '暂时没有已发布的笔记。',
  },
  en: {
    home: 'Home', blog: 'Articles', notes: 'Notes', about: 'About', search: 'Search',
    skip: 'Skip to content', theme: 'Choose theme', light: 'Light', dark: 'Dark', system: 'System',
    openMenu: 'Open navigation menu', mainNav: 'Main navigation', mobileNav: 'Mobile navigation',
    footer: 'Notes on technology and building things.', original: 'This post is available in Chinese only.',
    backArticles: '← Back to articles', moreArticles: '← More articles', backNotes: '← Back to notes', moreNotes: '← More notes',
    toc: 'On this page', progress: 'Reading progress', featured: 'Featured',
    filter: 'Filter by tag', all: 'All', expandTags: 'Show tags', collapseTags: 'Hide tags',
    previous: '← Previous', next: 'Next →', pageTarget: 'Page number', pageJump: 'Go to page',
    noArticles: 'No published articles yet.', noNotes: 'No published notes yet.',
  },
} as const;

export function localizedPath(path: string, locale: Locale): string {
  return locale === 'en' ? `/en${path === '/' ? '/' : path}` : path;
}
