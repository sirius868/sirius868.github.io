export const site = {
  name: 'yhblog',
  author: 'yh',
  role: '记录技术问题，也分享解决过程。',
  description: '关于 AI Agent、开发工具和工程实践的技术博客。',
  intro: '这里记录 AI Agent、开发工具和工程实践。遇到有意思的问题，我会动手试一试，再把过程和结论写下来。',
  about: [
    '这个博客用来记录我在学习和做项目时遇到的技术问题。写一篇文章，通常是因为某个问题值得弄明白，也希望能给遇到同样问题的人一点帮助。',
    '内容主要围绕 AI Agent、开发工具和工程实践。我会尽量把思路、代码和踩过的坑写清楚；如果有更好的做法，也欢迎交流。'
  ],
  education: {
    school: '华南师范大学',
    degree: '工学学士-软件工程',
    period: '2024–2028',
    emblem: '/images/scnu-emblem.png',
    url: 'https://www.scnu.edu.cn/'
  },
  experience: [] as { period: string; title: string; detail: string }[],
  links: [{ label: 'GitHub', url: 'https://github.com/sirius868' }] as { label: string; url: string }[]
};

export const siteUrl = import.meta.env.SITE || 'http://localhost:4321';
