/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRight, BookOpen, Library } from "lucide-react";

import EmptyState from "./empty-state";
import { formatPostDate } from "@/shared/utils";
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

        const href = `/collections/${collection.slug}`;

        return (
          <Link key={collection.id} href={href} className="group block">
            <article className="rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--midnight-accent)]/50 hover:bg-[var(--midnight-surface-soft)]/60">
              <div className="flex gap-5">
                <div className="grid h-32 w-28 shrink-0 grid-cols-2 gap-1 overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)]">
                  {coverImages.length > 0 ? (
                    coverImages.map((image, index) => (
                      <img
                        key={`${collection.id}-${index}`}
                        src={image ?? ""}
                        alt=""
                        className={`h-full w-full object-cover opacity-85 saturate-[0.85] transition duration-500 group-hover:opacity-95 group-hover:saturate-100 ${
                          index === 0 ? "row-span-2" : ""
                        }`}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 row-span-2 flex items-center justify-center text-[var(--midnight-muted)]">
                      <BookOpen className="h-7 w-7" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                    Collection
                  </p>

                  <h3 className="mt-2 line-clamp-1 text-2xl font-bold tracking-[-0.045em] text-[var(--midnight-text)]">
                    {collection.name}
                  </h3>

                  {collection.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--midnight-muted)]">
                      {collection.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-[var(--midnight-soft)]">
                    <span>{collection.posts.length} letters</span>
                    <span>·</span>
                    <span>
                      Updated{" "}
                      {formatPostDate(
                        collection.posts[0]?.postedDate ?? new Date()
                      )}
                    </span>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--midnight-muted)] transition-colors group-hover:text-[var(--midnight-accent-hover)]">
                    Open collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {collection.posts.length > 0 && (
                <div className="mt-5 border-t border-[var(--midnight-border)]/70 pt-4">
                  <div className="space-y-2">
                    {collection.posts.slice(0, 3).map((post, index) => (
                      <div
                        key={post.id}
                        className="flex gap-3 text-sm text-[var(--midnight-muted)]"
                      >
                        <span className="shrink-0 text-[var(--midnight-soft)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="line-clamp-1">{post.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </Link>
        );
      })}
    </div>
  );
}
