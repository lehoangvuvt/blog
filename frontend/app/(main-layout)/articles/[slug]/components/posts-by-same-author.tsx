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

export function PostsBySameAuthor({ author, posts }: Props) {
  if (!posts?.length) return null;

  const authorName = author.fullName || author.slug;

  return (
    <section className="mt-20 border-t border-black/5 pt-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-500">
            More from
          </p>

          <Link
            href={`/@${author.slug}`}
            className="mt-2 inline-flex items-center gap-3"
          >
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={authorName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-500">
                {authorName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <span className="text-2xl font-bold tracking-tight text-black hover:underline">
              {authorName}
            </span>
          </Link>
        </div>

        <Link
          href={`/@${author.slug}`}
          className="hidden text-sm text-neutral-500 transition-colors hover:text-black sm:block"
        >
          View profile
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {posts.slice(0, 4).map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/articles/${post.slug}`}>
              <div className="overflow-hidden rounded-3xl bg-neutral-100">
                {post.thumbnailImage ? (
                  <img
                    src={post.thumbnailImage}
                    alt={post.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="aspect-[16/10] w-full bg-neutral-200" />
                )}
              </div>
            </Link>

            <div className="pt-5">
              <Link
                href={`/@${author.slug}`}
                className="text-sm text-neutral-500 hover:text-black"
              >
                {authorName}
              </Link>

              <Link href={`/articles/${post.slug}`}>
                <h3 className="mt-2 text-xl leading-snug font-bold tracking-tight text-black transition-opacity group-hover:opacity-80">
                  {post.title}
                </h3>
              </Link>

              {post.subTitle && (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                  {post.subTitle}
                </p>
              )}

              <div className="mt-5">
                <Link
                  href={`/articles/${post.slug}`}
                  className="text-sm font-medium text-black underline underline-offset-4"
                >
                  Read article
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
