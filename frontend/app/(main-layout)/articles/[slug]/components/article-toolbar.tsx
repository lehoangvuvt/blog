"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Heart,
  Link2,
  MessageCircle,
  Repeat2,
  Share2,
  X,
} from "lucide-react";

import { usePostStatistics } from "@/features/posts/hooks/use-post-stasistics";
import { useLikePost } from "@/features/posts/hooks/use-like-post";
import { useUnlikePost } from "@/features/posts/hooks/use-unlike-post";
import { useRepost } from "@/features/posts/hooks/use-repost";
import { useUnRepost } from "@/features/posts/hooks/use-un-repost";

type Props = {
  postId: number;
};

export function ArticleToolbar({ postId }: Props) {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();
  const { mutate: repost } = useRepost();
  const { mutate: unRepost } = useUnRepost();

  const {
    data: postStatistics,
    isLoading: isLoadingStatistics,
    refetch,
  } = usePostStatistics(postId);

  const currentUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const encodedUrl = encodeURIComponent(currentUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?display=popup&u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    if (!currentUrl) return;

    await navigator.clipboard.writeText(currentUrl);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  if (isLoadingStatistics || !postStatistics) return null;

  return (
    <>
      <div className="mt-8 flex items-center justify-between border-y border-black/10 py-3 text-sm text-neutral-500">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => {
              if (postStatistics.liked) {
                unlikePost(postId, {
                  onSuccess: () => refetch(),
                });
              } else {
                likePost(postId, {
                  onSuccess: () => refetch(),
                });
              }
            }}
            className="flex items-center gap-2 transition hover:text-neutral-950"
          >
            <Heart
              className="h-4 w-4"
              fill={postStatistics.liked ? "currentColor" : "none"}
            />
            <span>{postStatistics.likesCount ?? 0}</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 transition hover:text-neutral-950"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{postStatistics.commentsCount ?? 0}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (postStatistics.reposted) {
                unRepost(postId, {
                  onSuccess: () => refetch(),
                });
              } else {
                repost(postId, {
                  onSuccess: () => refetch(),
                });
              }
            }}
            className="flex items-center gap-2 transition hover:text-neutral-950"
          >
            <Repeat2
              className="h-4 w-4"
              fill={postStatistics.reposted ? "currentColor" : "none"}
            />
            <span>{postStatistics.repostsCount ?? 0}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpenShareModal(true)}
          className="flex items-center gap-2 transition hover:text-neutral-950"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {openShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="font-serif text-2xl font-semibold tracking-tight text-black">
                  Share this article
                </h3>

                <p className="mt-1 text-sm text-neutral-500">
                  Copy the link or share it elsewhere.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenShareModal(false)}
                className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Close share modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm text-neutral-700 transition hover:border-black/20 hover:bg-black/[0.02] hover:text-black"
              >
                Facebook
              </a>

              <a
                href={shareLinks.x}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm text-neutral-700 transition hover:border-black/20 hover:bg-black/[0.02] hover:text-black"
              >
                X
              </a>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-black/10 bg-neutral-50 p-2">
              <div className="min-w-0 flex-1 truncate px-2 text-sm text-neutral-500">
                {currentUrl}
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpenShareModal(false)}
            className="absolute inset-0 -z-10"
            aria-label="Close share modal"
          />
        </div>
      )}
    </>
  );
}
