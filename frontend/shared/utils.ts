export function formatPostDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getArticleLink(slug: string) {
  return `/articles/${slug}`;
}
