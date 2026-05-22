/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/features/auth/hooks/use-me";
import usePostCollections from "@/features/post-collections/hooks/use-post-collections";
import { apiClient } from "@/shared/api/client";
import { formatPostDate } from "@/shared/utils";
import { Check, FolderPlus, Library, Loader2, X } from "lucide-react";

export default function AddToCollectionModal({
  onClose,
  postId,
}: {
  postId: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: myInfo } = useMe();

  const [loadingCollectionId, setLoadingCollectionId] = useState<string | null>(
    null
  );

  const { data: postCollections, isLoading: isLoadingPostCollections } =
    usePostCollections(myInfo?.id, Boolean(myInfo?.id));

  const addToCollection = async (collectionId: string) => {
    await apiClient.post(`/post-collections/${collectionId}/posts/${postId}`);
  };

  const removeFromCollection = async (collectionId: string) => {
    await apiClient.delete(`/post-collections/${collectionId}/posts/${postId}`);
  };

  const refreshCollections = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["post-collections", myInfo?.id],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/25 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-black/10 bg-[#fbfaf7] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div className="relative border-b border-black/10 px-6 py-6">
          <div className="absolute right-10 top-0 h-24 w-24 rounded-full bg-[#ff6719]/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
                Library
              </p>

              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
                Add to collection
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
                Save this article into a curated set of writing.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/80 p-2 text-neutral-400 ring-1 ring-black/10 transition hover:bg-white hover:text-neutral-950"
              aria-label="Close collection modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[68vh] overflow-y-auto px-4 py-4 sm:px-6">
          {isLoadingPostCollections && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`collection-skeleton-${index}`}
                  className="rounded-[22px] border border-black/10 bg-white p-4"
                >
                  <div className="flex gap-5">
                    <div className="h-32 w-36 shrink-0 animate-pulse rounded-2xl bg-neutral-100" />

                    <div className="min-w-0 flex-1 py-1">
                      <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
                      <div className="mt-4 h-7 w-56 animate-pulse rounded bg-neutral-100" />
                      <div className="mt-4 h-4 w-full animate-pulse rounded bg-neutral-100" />
                      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
                      <div className="mt-5 h-8 w-28 animate-pulse rounded-full bg-neutral-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoadingPostCollections && postCollections?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-black/10 bg-white px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f6f1] text-neutral-400">
                <FolderPlus className="h-7 w-7" />
              </div>

              <p className="mt-4 text-base font-semibold text-neutral-950">
                No collections yet
              </p>

              <p className="mt-1 max-w-sm text-sm leading-6 text-neutral-500">
                Create a collection to organize related articles into a readable
                series.
              </p>
            </div>
          )}

          {!isLoadingPostCollections && Boolean(postCollections?.length) && (
            <div className="space-y-4">
              {postCollections?.map((collection) => {
                const isAdded = collection.posts.some(
                  (post) => String(post.id) === String(postId)
                );

                const coverImages =
                  collection.posts.length > 0
                    ? collection.posts
                        .map((article) => article.thumbnailImage)
                        .filter(Boolean)
                        .slice(0, 3)
                    : [];

                const isMutating = loadingCollectionId === collection.id;

                return (
                  <article
                    key={collection.id}
                    className={`article-content group rounded-[22px] border bg-white p-4 transition duration-200 ${
                      isAdded
                        ? "border-neutral-950 shadow-[0_10px_30px_rgba(0,0,0,0.07)]"
                        : "border-black/10 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_12px_34px_rgba(0,0,0,0.08)]"
                    }`}
                  >
                    <div className="flex gap-5">
                      <div className="relative h-32 w-36 shrink-0">
                        <div className="absolute inset-x-3 top-2 h-full rounded-2xl bg-neutral-200/70 transition group-hover:top-1" />

                        <div className="relative grid h-full w-full grid-cols-2 gap-1 overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/10">
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
                            <div className="col-span-2 row-span-2 flex items-center justify-center bg-[#f8f6f1] text-neutral-400">
                              <Library className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 py-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                              Collection
                            </p>

                            <h3 className="mt-1 line-clamp-1 text-2xl font-semibold tracking-[-0.035em] text-neutral-950">
                              {collection.name}
                            </h3>
                          </div>

                          <button
                            type="button"
                            disabled={isMutating}
                            onClick={async () => {
                              try {
                                setLoadingCollectionId(collection.id);

                                if (isAdded) {
                                  await removeFromCollection(collection.id);
                                } else {
                                  await addToCollection(collection.id);
                                }

                                await refreshCollections();
                              } finally {
                                setLoadingCollectionId(null);
                              }
                            }}
                            className={`group/action inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              isAdded
                                ? "border border-neutral-300 bg-[#f8f6f1] text-neutral-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                : "bg-neutral-950 text-white hover:bg-neutral-800"
                            }`}
                          >
                            {isMutating ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving
                              </>
                            ) : isAdded ? (
                              <>
                                <Check className="h-4 w-4 group-hover/action:hidden" />
                                <span className="group-hover/action:hidden">
                                  Added
                                </span>
                                <span className="hidden group-hover/action:inline">
                                  Remove
                                </span>
                              </>
                            ) : (
                              <>
                                <FolderPlus className="h-4 w-4" />
                                Add
                              </>
                            )}
                          </button>
                        </div>

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

                    {collection.posts.length > 0 && (
                      <div className="mt-5 border-t border-neutral-100 pt-3">
                        {collection.posts.slice(0, 3).map((post) => (
                          <div
                            key={post.id}
                            className="flex items-center justify-between gap-4 py-2 text-sm"
                          >
                            <span className="line-clamp-1 font-medium text-neutral-800">
                              {post.title}
                            </span>

                            <span className="shrink-0 text-xs text-neutral-400">
                              {formatPostDate(post.postedDate)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-black/10 bg-white/70 p-4">
          <button
            type="button"
            onClick={() => {
              console.log("Create new collection from article:", postId);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-[#f8f6f1]"
          >
            <FolderPlus className="h-4 w-4" />
            Create new collection
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 -z-10"
        aria-label="Close collection modal"
      />
    </div>
  );
}
