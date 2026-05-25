import { formatDistanceToNowStrict } from "date-fns";

export function formatPostDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getArticleLink(slug: string) {
  return `/letters/${slug}`;
}

export function formatTimeAgo(date: string) {
  const text = formatDistanceToNowStrict(new Date(date));

  return text
    .replace(" seconds", "s")
    .replace(" second", "s")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" months", "mo")
    .replace(" month", "mo")
    .replace(" years", "y")
    .replace(" year", "y");
}
