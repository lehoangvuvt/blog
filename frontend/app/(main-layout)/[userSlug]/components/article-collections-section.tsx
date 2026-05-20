/* eslint-disable @next/next/no-img-element */
import { Library } from "lucide-react";
import EmptyState from "./empty-state";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import { PostCollection } from "@/features/post-collections/types";

export default function ArticleCollectionsSection({
  collections,
}: {
  collections: PostCollection[];
}) {
  if (!collections.length) {
    return <EmptyState icon={<Library />} title="No collections yet" />;
  }

  return (
    <div className="space-y-5">
      {collections.map((collection) => {
        const coverImages =
          collection.posts.length > 0
            ? collection.posts
                .map((article) => article.thumbnailImage)
                .filter(Boolean)
                .slice(0, 3)
            : [];

        return (
          <article
            key={collection.id}
            className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex gap-5">
              <div className="grid h-28 w-32 shrink-0 grid-cols-2 gap-1 overflow-hidden rounded-xl bg-neutral-100">
                {coverImages.length > 0 ? (
                  coverImages.map((image, index) => (
                    <img
                      key={`${collection.id}-${index}`}
                      src={image ?? ""}
                      alt=""
                      className={`h-full w-full object-cover ${
                        index === 0 ? "row-span-2" : ""
                      }`}
                    />
                  ))
                ) : (
                  <div className="col-span-2 row-span-2 flex items-center justify-center text-neutral-400">
                    <Library className="h-7 w-7" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  Collection
                </p>

                <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
                  {collection.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                  {collection.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-neutral-500">
                  <span>{collection.posts.length} articles</span>
                  <span>·</span>
                  <span>
                    Updated{" "}
                    {formatPostDate(
                      collection.posts[0]?.postedDate ?? new Date()
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 divide-y divide-neutral-100 border-t border-neutral-100 pt-2">
              {collection.posts.slice(0, 3).map((post) => (
                <a
                  key={post.id}
                  href={getArticleLink(post.slug)}
                  className="block py-3 text-sm font-medium text-neutral-800 transition hover:text-neutral-950"
                >
                  {post.title}
                </a>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
