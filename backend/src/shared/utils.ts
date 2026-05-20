import DOMPurify from 'isomorphic-dompurify';
import { nanoid } from 'nanoid';

export function generateSlug(text: string, withSuffix: boolean = true): string {
  const slug = text
    .normalize('NFD')
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!withSuffix) {
    return slug;
  }

  return `${slug}-${nanoid(6)}`;
}

export function sanitizedHtmlContent(htmlContent: string): string {
  return DOMPurify.sanitize(htmlContent ?? '', {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'h1',
      'h2',
      'h3',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'img',
      'pre',
      'code',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
  });
}
