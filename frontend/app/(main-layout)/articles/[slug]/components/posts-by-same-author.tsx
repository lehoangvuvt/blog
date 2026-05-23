/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { MoonStar } from "lucide-react";

type Author = {
  email: string;
  fullName?: string;
  avatar?: string | null;
  slug: string;
};

type PostByAuthor = {
  title: string;
  slug: string;
  subTitle?: string | null;
  thumbnailImage?: string | null;
};

type Props = {
  author: Author;
  posts: PostByAuthor[];
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function PostsBySameAuthor({ author, posts }: Props) {
  if (!posts?.length) return null;

  const authorName = author.fullName || author.slug;

  return (
    <section className="mt-24 border-t border-[var(--midnight-border)]/70 pt-10">
      <div className="mb-8 flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--midnight-muted)]">
            <MoonStar className="h-3.5 w-3.5 text-[var(--midnight-accent)]/80" />
            <span>More after-hours notes from</span>
          </div>

          <Link
            href={`/@${author.slug}`}
            className="mt-3 flex items-center gap-3"
          >
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={authorName}
                className="h-9 w-9 rounded-full border border-[var(--midnight-border)]/70 object-cover opacity-95"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-xs font-medium text-[var(--midnight-accent)]">
                {getInitials(authorName)}
              </div>
            )}

            <span className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)] transition-colors hover:text-[var(--midnight-accent-hover)]">
              {authorName}
            </span>
          </Link>
        </div>

        <Link
          href={`/${author.slug}`}
          className="hidden rounded-full border border-[var(--midnight-border)]/70 px-4 py-2 text-sm text-[var(--midnight-muted)] transition-colors hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)] sm:block"
        >
          Visit their desk
        </Link>
      </div>

      <div className="divide-y divide-[var(--midnight-border)]/70 border-t border-[var(--midnight-border)]/70">
        {posts.slice(0, 4).map((post) => (
          <article
            key={post.slug}
            className="group py-6 transition-colors duration-300 hover:bg-[rgba(21,25,34,0.35)] md:px-4"
          >
            <div className="grid gap-5 md:grid-cols-[1fr_96px]">
              <div className="min-w-0">
                <Link
                  href={`/articles/${post.slug}`}
                  className="block text-xl font-semibold leading-snug tracking-[-0.035em] text-[var(--midnight-text)] transition-colors hover:text-[var(--midnight-accent-hover)]"
                >
                  {post.title}
                </Link>

                {post.subTitle && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--midnight-muted)]">
                    {post.subTitle}
                  </p>
                )}

                <div className="mt-3 text-sm text-[var(--midnight-soft)]">
                  {authorName}
                </div>
              </div>

              <Link href={`/articles/${post.slug}`} className="hidden md:block">
                <div className="aspect-square overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)]">
                  {post.thumbnailImage ? (
                    <img
                      src={post.thumbnailImage}
                      alt={post.title}
                      className="h-full w-full object-cover opacity-85 saturate-[0.85] transition duration-500 group-hover:opacity-95 group-hover:saturate-100"
                    />
                  ) : (
                    <div className="h-full w-full bg-[var(--midnight-code-bg)]" />
                  )}
                </div>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
