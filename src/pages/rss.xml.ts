import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import { visiblePosts, withBase } from '../utils/site';

export async function GET(context: { site: URL }) {
  const posts = visiblePosts(await getCollection('blog'));
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    customData: `<language>${SITE.language}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: withBase(`/blog/${post.id}/`),
      categories: post.data.tags,
    })),
  });
}
