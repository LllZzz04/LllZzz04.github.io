export const SITE = {
  name: 'Kasugaii',
  title: ' RFIC · 模拟集成电路 · 电子技术',
  description:
    '很普通的博客，记录RFIC学习，以及折腾的一些东西，还有画画或者影视文学内容感悟',
  shortDescription:
    '学习射频与模拟集成电路，在这里记录技术思考、学习过程和项目实践',
  url: 'https://username.github.io',
  language: 'zh-CN',
  locale: 'zh_CN',
  github: 'https://github.com/LllZzz04',
  email: 'hello@example.com',
  role: 'RFIC · 模拟集成电路 · 电子技术',
  author: 'Kasugaii',
} as const;

export const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog/' },
  { label: '绘画', href: '/art/' },
  { label: '关于', href: '/about/' },
] as const;
