export const SITE = {
  name: '你的名字',
  title: '你的名字 — RFIC · 模拟集成电路 · 电子技术',
  description:
    '一名 RFIC 与模拟集成电路方向学生的个人主页，记录电路设计、电子技术、工程项目与绘画学习。',
  shortDescription:
    '我正在学习射频与模拟集成电路，并在这里记录技术思考、学习过程和项目实践。',
  url: 'https://username.github.io',
  language: 'zh-CN',
  locale: 'zh_CN',
  github: 'https://github.com/username',
  email: 'hello@example.com',
  role: 'RFIC · 模拟集成电路 · 电子技术',
  author: '你的名字',
} as const;

export const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog/' },
  { label: '项目', href: '/projects/' },
  { label: '绘画', href: '/art/' },
  { label: '关于', href: '/about/' },
] as const;
