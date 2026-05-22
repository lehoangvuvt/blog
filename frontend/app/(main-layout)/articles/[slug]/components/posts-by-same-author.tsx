/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

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
    <section className="mt-24 border-t border-black/10 pt-10">
      <div className="mb-8 flex items-center justify-between gap-6">
        <div>
          <p className="text-sm text-neutral-500">More from</p>

          <Link
            href={`/@${author.slug}`}
            className="mt-2 flex items-center gap-3"
          >
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={authorName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-500">
                {getInitials(authorName)}
              </div>
            )}

            <span className="font-serif text-2xl font-semibold tracking-tight text-black hover:underline">
              {authorName}
            </span>
          </Link>
        </div>

        <Link
          href={`/@${author.slug}`}
          className="hidden text-sm text-neutral-500 transition hover:text-black sm:block"
        >
          View profile
        </Link>
      </div>

      <div className="divide-y divide-black/10 border-t border-black/10">
        {posts.slice(0, 4).map((post) => (
          <article key={post.slug} className="article-content group py-6">
            <div className="grid gap-5 md:grid-cols-[1fr_96px]">
              <div className="min-w-0">
                <Link
                  href={`/articles/${post.slug}`}
                  className="block font-serif text-xl font-semibold leading-snug tracking-[-0.02em] text-black hover:underline"
                >
                  {post.title}
                </Link>

                {post.subTitle && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                    {post.subTitle}
                  </p>
                )}

                <div className="mt-3 text-sm text-neutral-400">
                  {authorName}
                </div>
              </div>

              <Link href={`/articles/${post.slug}`} className="hidden md:block">
                <div className="aspect-square overflow-hidden rounded-md bg-neutral-100">
                  {post.thumbnailImage ? (
                    <img
                      src={post.thumbnailImage}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-neutral-100" />
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
