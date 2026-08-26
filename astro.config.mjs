import mdx from '@astrojs/mdx';
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { rehypeAccessibleHeadingLinks } from './src/utils/rehype-accessible-heading-links.mjs';

const site = process.env.SITE_URL || 'https://username.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeHeadingIds, rehypeAccessibleHeadingLinks, rehypeKatex],
      remarkRehype: {
        footnoteLabel: '脚注',
        footnoteBackLabel: '返回正文',
      },
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
