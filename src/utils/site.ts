import type { CollectionEntry } from 'astro:content';

export function withBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (base && (normalizedPath === base || normalizedPath.startsWith(`${base}/`))) {
    return normalizedPath;
  }
  return `${base}${normalizedPath}` || '/';
}

export function formatDate(date: Date, includeDay = true) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return includeDay ? `${year}.${month}.${day}` : `${year}.${month}`;
}

export function sortByDate<T extends { data: { date: Date } }>(entries: T[]) {
  return [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function visiblePosts(posts: CollectionEntry<'blog'>[]) {
  return sortByDate(posts.filter((post) => !post.data.draft || import.meta.env.DEV));
}

export function slugifyTag(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function estimateReadingMinutes(markdown: string) {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\](){}|~-]/g, ' ');
  const hanCount = (plainText.match(/[\u3400-\u9fff]/g) || []).length;
  const wordCount = (plainText.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  return Math.max(1, Math.ceil(hanCount / 350 + wordCount / 220));
}
