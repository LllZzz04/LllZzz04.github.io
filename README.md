# RFIC Notes — 个人主页与技术博客

一个内容优先、长期可维护的 Astro 静态网站，适合电子、RFIC、模拟 IC 方向的学生记录技术文章、学习笔记、工程项目与绘画练习。

主要特性：

- Astro + TypeScript + Markdown / MDX
- Astro Content Collections 与 frontmatter 类型校验
- 静态生成，除主题切换外不依赖客户端 JavaScript
- Shiki 代码高亮、KaTeX 数学公式、GFM 表格与脚注
- 博客标签、草稿、阅读时间、目录、标题锚点、上一篇 / 下一篇
- 响应式 Projects 与 Art 页面
- Light / Dark Mode、系统主题跟随与本地记忆
- RSS、Sitemap、robots.txt、canonical、Open Graph、Twitter Card、404
- GitHub Pages 自动部署与子路径支持

## 环境要求

- Node.js 22.12 或更高版本（推荐 Node.js 24 LTS）
- npm 10 或更高版本

## 安装

```bash
npm install
```

## 本地开发

```bash
npm run dev
```

Astro 会在终端显示本地地址，通常为 `http://localhost:4321/`。

## 类型检查与构建

```bash
npm run check
npm run build
```

构建结果位于 `dist/`。要检查生产构建：

```bash
npm run preview
```

## 修改个人信息

主页、导航、About、页脚和 SEO 中使用的个人信息集中在：

```text
src/config.ts
```

修改 `SITE.name`、`SITE.title`、`SITE.description`、`SITE.github`、`SITE.email`、`SITE.role` 等字段即可。默认内容都是安全的 placeholder。

## 写一篇博客

在 `src/content/blog/` 新建 `.md` 或 `.mdx` 文件。文件名会成为 URL slug：

```text
src/content/blog/example.md
→ /blog/example/
```

最小示例：

```markdown
---
title: "Article Title"
description: "A short summary used on the list page and by search engines."
date: 2026-08-26
updated: 2026-08-27
tags:
  - RFIC
  - Analog
draft: false
---

正文从这里开始。

## Section

行内公式：$f_0 = 1 / (2\pi\sqrt{LC})$

块级公式：

$$
Z(s) = \frac{V(s)}{I(s)}
$$
```

说明：

- `updated` 可省略。
- `tags` 可为空数组。
- `draft: true` 的文章只在本地开发环境显示，生产构建会排除。
- Markdown 标题自动生成 ID，页面会添加可复制的标题锚点与右侧目录。
- GFM 表格、blockquote、代码块、脚注与普通图片可以直接使用。
- 需要导入 Astro 组件或使用带 caption 的图片时，使用 `.mdx`。

发布文章：

```bash
git add .
git commit -m "add new post"
git push
```

## 在文章中添加图片

推荐把原图放在 `src/assets/blog/`，Astro 会在构建时处理本地图片。普通 Markdown：

```markdown
![清楚描述图片内容的 alt 文本](../../assets/blog/example.webp)
```

需要 caption 或宽于正文的图片时，把文章保存为 `.mdx`：

```mdx
import Figure from '../../components/Figure.astro';
import image from '../../assets/blog/example.webp';

<Figure
  src={image}
  alt="描述图片中真正可见的内容"
  caption="Figure 1. 图片说明。"
  wide
/>
```

建议：

- 优先使用 WebP 或 AVIF；照片宽度通常不必超过 2000 px。
- 始终提供准确的 alt 文本。
- 不要手写缺少 `width` / `height` 的 `<img>`；使用 Markdown 图片或 `Figure` 组件。

## 创建项目

在 `src/content/projects/` 新建 Markdown 文件：

```markdown
---
title: "Project Name"
description: "One-sentence project summary."
date: 2026-08-26
tags:
  - RFIC
  - CMOS
featured: true
---

## Project background

项目背景。

## My work

你的具体工作。

## System architecture

系统架构。

## Circuit design

电路设计。

## Simulation and measurement results

结果与测试条件。

## Lessons learned

复盘。
```

文件名会成为 `/projects/<文件名>/`。`featured: true` 的项目会优先出现在首页和项目列表。

## 添加绘画作品

1. 把图片放到 `src/assets/art/`。
2. 在 `src/content/art/` 新建 Markdown 条目：

```markdown
---
title: "Perspective Study #05"
date: 2026-08-26
description: "Perspective construction practice."
tags:
  - Perspective
  - Study
image: "../../assets/art/perspective-study-05.webp"
alt: "描述画面内容的替代文本"
---
```

Art 页面按日期倒序排列。点击缩略图会打开构建后的大图。

## GitHub Pages 部署

项目包含 `.github/workflows/deploy.yml`。默认行为：

- push 到 `main` 后自动构建并部署；
- 普通仓库自动使用 `/<repository-name>` 作为 `BASE_PATH`；
- 名为 `<username>.github.io` 的用户主页仓库自动使用根路径 `/`；
- GitHub 仓库 owner 自动用于默认 `SITE_URL`。

部署步骤：

1. 在 GitHub 创建仓库并推送本项目。
2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment** 中把 Source 设为 **GitHub Actions**。
4. push 到 `main`，等待 `Deploy to GitHub Pages` 工作流完成。

如果仓库改名，工作流会在下一次构建时自动使用新的 base path。所有站内链接都通过统一 helper 生成，可安全部署在子路径。

## 自定义域名

1. 把 `public/CNAME.example` 复制或重命名为 `public/CNAME`，内容改为你的域名，例如 `www.example.com`。
2. 按 GitHub Pages 文档在域名服务商处配置 DNS。
3. 在 GitHub 仓库 **Settings → Secrets and variables → Actions → Variables** 新建：
   - `SITE_URL`：`https://www.example.com`
   - `BASE_PATH`：`/`
4. 在 `src/config.ts` 中同步更新公开主页信息。
5. 重新运行部署工作流。

本地也可以用 `.env` 覆盖默认地址：

```env
SITE_URL=https://www.example.com
BASE_PATH=/
```

不要提交 `.env`；仓库中已经提供 `.env.example`。

## 目录结构

```text
src/
├── assets/           # 由 Astro 处理的文章和作品图片
├── components/       # 列表、卡片、导航、TOC、Figure
├── content/
│   ├── art/
│   ├── blog/
│   └── projects/
├── layouts/          # 全局布局与文章布局
├── pages/            # 路由、RSS、robots、404
├── styles/           # 全局样式与响应式规则
├── config.ts         # 个人信息
└── content.config.ts # Content Collections schema
```

## 适合以后扩展的方向

- 为文章增加系列（series）或分类字段。
- 在项目 schema 中增加封面图、状态或外部论文链接。
- 用真实绘画作品替换示例 SVG，并按需要加入单独作品详情页。
- 为特定文章增加独立 Open Graph 图片。
- 内容规模明显增大后，再考虑分页或全文搜索；当前规模下不引入额外客户端依赖。

本项目刻意不包含评论、点赞、粒子动画、WebGL、音乐播放器或大型 UI 框架，以保持可读性、加载速度和长期稳定性。
