export const site = {
  name: 'yhblog',
  author: 'yh',
  role: '记录想法，也认真生活。',
  description: 'yh 的个人博客，记录阅读、创作与日常观察。',
  intro: '你好，我是 yh。这里收集阅读、创作和生活中的小发现，也记录一些值得慢慢想的问题。',
  about: [
    '你好，我是 yh。这个博客是我的公开笔记本：记录认真想过的问题，也保存那些值得回头看的瞬间。',
    '我相信好的文字不必急着给出结论。它可以从一个具体的问题开始，沿着好奇心走得更远。'
  ],
  experience: [] as { period: string; title: string; detail: string }[],
  links: [] as { label: string; url: string }[]
};

export const siteUrl = import.meta.env.SITE || 'http://localhost:4321';
