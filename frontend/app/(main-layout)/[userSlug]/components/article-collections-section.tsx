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
    return <EmptyState icon={<Library />} title="No bundles yet" />;
  }

  return (
    <div className="space-y-6">
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
          <Link
            key={collection.id}
            href={href}
            className="group block rounded-sm p-3 transition hover:-translate-y-0.5"
          >
            <article className="article-content relative overflow-hidden rounded-sm p-6 shadow-[0_18px_50px_rgba(60,40,20,0.12)] transition group-hover:shadow-[0_26px_70px_rgba(60,40,20,0.18)]">
              <div className="absolute left-0 top-0 h-full w-6  from-black/10 to-transparent" />

              <div className="flex gap-6">
                <div className="grid h-36 w-32 shrink-0 grid-cols-2 gap-1 overflow-hidden rounded-sm bg-[#e7ddcf] shadow-inner">
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
                    <div className="col-span-2 row-span-2 flex items-center justify-center text-black/30">
                      <BookOpen className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 py-1">
                  <p className="text-xs uppercase tracking-[0.28em] text-black/35">
                    Letter bundle
                  </p>

                  <h3 className="mt-3 font-serif text-3xl leading-tight text-[#211b16]">
                    {collection.name}
                  </h3>

                  <p className="mt-3 line-clamp-2 font-serif text-lg leading-7 text-black/55">
                    {collection.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-2 text-sm text-black/40">
                    <span>{collection.posts.length} letters</span>
                    <span>·</span>
                    <span>
                      Updated{" "}
                      {formatPostDate(
                        collection.posts[0]?.postedDate ?? new Date()
                      )}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#211b16]">
                    Open bundle
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {collection.posts.length > 0 && (
                <div className="mt-6 border-t border-black/10 pt-4">
                  <div className="space-y-2">
                    {collection.posts.slice(0, 3).map((post, index) => (
                      <div
                        key={post.id}
                        className="flex gap-3 text-sm text-black/55"
                      >
                        <span className="font-serif text-black/35">
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
