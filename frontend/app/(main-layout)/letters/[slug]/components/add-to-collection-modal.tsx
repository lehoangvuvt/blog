/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, FolderPlus, Library, Loader2, MoonStar, X } from "lucide-react";

import { useMe } from "@/features/auth/hooks/use-me";
import usePostCollections from "@/features/post-collections/hooks/use-post-collections";
import { apiClient } from "@/shared/api/client";
import { formatPostDate } from "@/shared/utils";
import CreateCollectionModal from "@/features/post-collections/components/create-collection-modal";
import Link from "next/link";

export default function AddToCollectionModal({
  onClose,
  postId,
}: {
  postId: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: myInfo } = useMe();

  const [isOpenCreateCollectionModal, setOpenCreateCollectionModal] =
    useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
        <div className="relative border-b border-[var(--midnight-border)]/70 px-6 py-6">
          <div className="absolute right-10 top-0 h-24 w-24 rounded-full bg-[var(--midnight-accent)]/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                <MoonStar className="h-3.5 w-3.5 text-[var(--midnight-accent)]/80" />
                <span>Library</span>
              </div>

              <h3 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[var(--midnight-text)]">
                Add to a collection
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--midnight-muted)]">
                Tuck this letter into a quiet corner you can revisit later.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] p-2 text-[var(--midnight-muted)] transition hover:text-[var(--midnight-accent-hover)]"
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
                  key={`collection-skeleton-${index + 1}`}
                  className="rounded-[22px] border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface-soft)] p-4"
                >
                  <div className="flex gap-5">
                    <div className="h-32 w-36 shrink-0 animate-pulse rounded-2xl bg-[var(--midnight-code-bg)]" />

                    <div className="min-w-0 flex-1 py-1">
                      <div className="h-3 w-24 animate-pulse rounded bg-[var(--midnight-code-bg)]" />
                      <div className="mt-4 h-7 w-56 animate-pulse rounded bg-[var(--midnight-code-bg)]" />
                      <div className="mt-4 h-4 w-full animate-pulse rounded bg-[var(--midnight-code-bg)]" />
                      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[var(--midnight-code-bg)]" />
                      <div className="mt-5 h-8 w-28 animate-pulse rounded-full bg-[var(--midnight-code-bg)]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoadingPostCollections && postCollections?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] text-[var(--midnight-muted)]">
                <FolderPlus className="h-7 w-7" />
              </div>

              <p className="mt-4 text-base font-semibold text-[var(--midnight-text)]">
                No collections yet
              </p>

              <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--midnight-muted)]">
                Start a collection for letters that belong in the same
                late-night mood.
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
                const collectionURU = `/collections/${collection.slug}`;

                return (
                  <article
                    key={collection.id}
                    className={`group rounded-[22px] border bg-[var(--midnight-surface-soft)] p-4 transition duration-300 ${
                      isAdded
                        ? "border-[var(--midnight-accent)]/70 shadow-[0_16px_50px_rgba(0,0,0,0.22)]"
                        : "border-[var(--midnight-border)]/70 hover:-translate-y-0.5 hover:border-[var(--midnight-accent)]/50 hover:shadow-[0_18px_55px_rgba(0,0,0,0.25)]"
                    }`}
                  >
                    <div className="flex gap-5">
                      <div className="relative h-32 w-36 shrink-0">
                        <div className="absolute inset-x-3 top-2 h-full rounded-2xl bg-[var(--midnight-border)]/50 transition group-hover:top-1" />

                        <div className="relative grid h-full w-full grid-cols-2 gap-1 overflow-hidden rounded-2xl bg-[var(--midnight-code-bg)] ring-1 ring-[var(--midnight-border)]/70">
                          {coverImages.length > 0 ? (
                            coverImages.map((image, index) => (
                              <img
                                key={`${collection.id}-${index}`}
                                src={image ?? ""}
                                alt=""
                                className={`h-full w-full object-cover opacity-85 saturate-[0.85] ${
                                  index === 0 ? "row-span-2" : ""
                                }`}
                              />
                            ))
                          ) : (
                            <div className="col-span-2 row-span-2 flex items-center justify-center bg-[var(--midnight-code-bg)] text-[var(--midnight-muted)]">
                              <Library className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 py-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--midnight-soft)]">
                              Letter collection
                            </p>

                            <Link
                              href={collectionURU}
                              className="mt-1 line-clamp-1 text-2xl font-bold tracking-[-0.045em] text-[var(--midnight-text)] hover:underline cursor-pointer"
                            >
                              {collection.name}
                            </Link>
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
                                ? "border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-[var(--midnight-muted)] hover:border-red-400/40 hover:text-red-300"
                                : "bg-[var(--midnight-accent)] text-[var(--midnight-on-accent)] hover:opacity-90"
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

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--midnight-muted)]">
                          {collection.description}
                        </p>

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
                      </div>
                    </div>

                    {collection.posts.length > 0 && (
                      <div className="mt-5 border-t border-[var(--midnight-border)]/70 pt-3 h-30 overflow-auto">
                        {collection.posts.map((post, i) => (
                          <div
                            key={post.id}
                            className="flex items-center justify-between gap-4 py-2 text-sm"
                          >
                            <Link
                              href={`/letters/${post.slug}`}
                              onClick={() => onClose()}
                              className="line-clamp-1 font-medium text-[var(--midnight-text)] hover:underline"
                            >
                              {i + 1}. &nbsp;{post.title}
                            </Link>

                            <span className="shrink-0 text-xs text-[var(--midnight-soft)] mr-5">
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

        <div className="border-t border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)]/70 p-4">
          <button
            type="button"
            onClick={() => setOpenCreateCollectionModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] px-4 py-3 text-sm font-medium text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)]"
          >
            <FolderPlus className="h-4 w-4" />
            Create a new collection
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 -z-10"
        aria-label="Close collection modal"
      />

      <CreateCollectionModal
        onClose={() => setOpenCreateCollectionModal(false)}
        open={isOpenCreateCollectionModal}
      />
    </div>
  );
}
