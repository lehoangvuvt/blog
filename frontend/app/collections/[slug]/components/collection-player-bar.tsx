"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { useState } from "react";

export function CollectionPlayerBar({
  collection,
  currentPost,
  currentIndex,
}: {
  collection: any;
  currentPost: any;
  currentIndex: number;
}) {
  const [openList, setOpenList] = useState(false);

  const prevPost = collection.posts[currentIndex - 1];
  const nextPost = collection.posts[currentIndex + 1];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/95 px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <button
            type="button"
            onClick={() => setOpenList(true)}
            className="rounded-full border border-black/10 p-3 hover:bg-black/5"
          >
            <List className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-black/45">
              {collection.title} · {currentIndex + 1}/{collection.posts.length}
            </p>
            <h3 className="truncate text-sm font-semibold text-black">
              {currentPost.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {prevPost ? (
              <Link
                href={`/collections/${collection.id}?post=${prevPost.id}`}
                className="rounded-full border border-black/10 p-3 hover:bg-black/5"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : (
              <button disabled className="rounded-full border p-3 opacity-30">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {nextPost ? (
              <Link
                href={`/collections/${collection.id}?post=${nextPost.id}`}
                className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/80"
              >
                Next
              </Link>
            ) : (
              <button
                disabled
                className="rounded-full bg-black px-5 py-3 text-sm text-white opacity-30"
              >
                Done
              </button>
            )}

            {nextPost && (
              <Link
                href={`/collections/${collection.id}?post=${nextPost.id}`}
                className="rounded-full border border-black/10 p-3 hover:bg-black/5"
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {openList && (
        <div className="fixed inset-0 z-[999]">
          <button
            type="button"
            onClick={() => setOpenList(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          />

          <div className="absolute bottom-0 left-0 right-0 rounded-t-[2rem] bg-white p-5 shadow-2xl">
            <div className="mx-auto max-w-3xl">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                  Collection queue
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  {collection.title}
                </h2>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {collection.posts.map((post: any, index: number) => {
                  const active = post.id === currentPost.id;

                  return (
                    <Link
                      key={post.id}
                      href={`/collections/${collection.id}?post=${post.id}`}
                      onClick={() => setOpenList(false)}
                      className={`mb-2 flex items-center gap-3 rounded-2xl p-3 ${
                        active ? "bg-black text-white" : "hover:bg-black/[0.04]"
                      }`}
                    >
                      <span className="w-6 text-sm">{index + 1}</span>

                      {post.thumbnailImage && (
                        <img
                          src={post.thumbnailImage}
                          alt={post.title}
                          className="h-12 w-16 rounded-lg object-cover"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold">
                          {post.title}
                        </h3>
                        <p
                          className={`text-xs ${
                            active ? "text-white/60" : "text-black/45"
                          }`}
                        >
                          {active ? "Now reading" : "Article"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
