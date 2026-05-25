"use client";

import { useState } from "react";
import {
  Bookmark,
  Eye,
  FolderPlus,
  Heart,
  MessageCircle,
  MoonStar,
  Repeat2,
  Share2,
  X,
} from "lucide-react";

import { usePostStatistics } from "@/features/posts/hooks/use-post-stasistics";
import { useLikePost } from "@/features/posts/hooks/use-like-post";
import { useUnlikePost } from "@/features/posts/hooks/use-unlike-post";
import { useRepost } from "@/features/posts/hooks/use-repost";
import { useUnRepost } from "@/features/posts/hooks/use-un-repost";

import AddToCollectionModal from "./add-to-collection-modal";
import ShareModal from "./share-modal";

import { useMe } from "@/features/auth/hooks/use-me";
import { CommentsSection } from "./comments-section";

import useSavePost from "@/features/posts/hooks/use-save-post";
import useUnsavePost from "@/features/posts/hooks/use-unsave-post";
import { useAppDispatch } from "@/store/hooks";
import { setSignInModalState } from "@/features/app-settings/slice";

type Props = {
  postId: number;
};

export function ArticleToolbar({ postId }: Props) {
  const dispatch = useAppDispatch();
  const { data: myInfo } = useMe();

  const savedPostIds = myInfo?.savedPostIds ?? [];

  const isSaved = savedPostIds.includes(postId);

  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [animateCommentsDrawer, setAnimateCommentsDrawer] = useState(false);

  const [openShareModal, setOpenShareModal] = useState(false);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();

  const { mutate: repost } = useRepost();
  const { mutate: unRepost } = useUnRepost();

  const { mutate: savePost } = useSavePost();
  const { mutate: unsavePost } = useUnsavePost();

  const {
    data: postStatistics,
    isLoading: isLoadingStatistics,
    refetch,
  } = usePostStatistics(postId);

  if (isLoadingStatistics || !postStatistics) return null;

  const openSignInModal = () => {
    dispatch(setSignInModalState({ isOpen: true }));
  };

  const requireAuth = (callback: () => void) => {
    if (!myInfo) {
      openSignInModal();
      return;
    }

    callback();
  };

  const openComments = () => {
    setShowCommentsDrawer(true);

    requestAnimationFrame(() => {
      setAnimateCommentsDrawer(true);
    });
  };

  const closeComments = () => {
    setAnimateCommentsDrawer(false);

    setTimeout(() => {
      setShowCommentsDrawer(false);
    }, 300);
  };

  return (
    <>
      <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/75 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-5 px-5 py-4 text-sm text-[var(--midnight-muted)]">
          <div className="flex flex-wrap items-center gap-5">
            <div
              title="Views"
              aria-label="Post views"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4 opacity-70" />
              <span>{postStatistics.viewsCount ?? 0}</span>
            </div>

            <button
              type="button"
              title={
                postStatistics.liked ? "Take back appreciation" : "Appreciate"
              }
              aria-label={
                postStatistics.liked ? "Take back appreciation" : "Appreciate"
              }
              onClick={() =>
                requireAuth(() => {
                  if (postStatistics.liked) {
                    unlikePost(postId, {
                      onSuccess: () => refetch(),
                    });
                  } else {
                    likePost(postId, {
                      onSuccess: () => refetch(),
                    });
                  }
                })
              }
              className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-300 ${
                postStatistics.liked
                  ? "bg-[var(--midnight-code-bg)] text-[var(--midnight-accent-hover)]"
                  : "hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
              }`}
            >
              <Heart
                className="h-4 w-4"
                fill={postStatistics.liked ? "currentColor" : "none"}
              />

              <span>{postStatistics.likesCount ?? 0}</span>
            </button>

            <button
              type="button"
              title="Replies"
              aria-label="Open replies"
              onClick={openComments}
              className="flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-300 hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
            >
              <MessageCircle className="h-4 w-4" />

              <span>{postStatistics.commentsCount ?? 0}</span>
            </button>

            <button
              type="button"
              title={
                postStatistics.reposted ? "Take back echo" : "Echo this letter"
              }
              aria-label={
                postStatistics.reposted ? "Take back echo" : "Echo this letter"
              }
              onClick={() =>
                requireAuth(() => {
                  if (postStatistics.reposted) {
                    unRepost(postId, {
                      onSuccess: () => refetch(),
                    });
                  } else {
                    repost(postId, {
                      onSuccess: () => refetch(),
                    });
                  }
                })
              }
              className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-300 ${
                postStatistics.reposted
                  ? "bg-[var(--midnight-code-bg)] text-[var(--midnight-accent-hover)]"
                  : "hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
              }`}
            >
              <Repeat2
                className="h-4 w-4"
                fill={postStatistics.reposted ? "currentColor" : "none"}
              />

              <span>{postStatistics.repostsCount ?? 0}</span>
            </button>

            <button
              type="button"
              title={isSaved ? "Remove saved letter" : "Save letter"}
              aria-label={isSaved ? "Remove saved letter" : "Save letter"}
              onClick={() =>
                requireAuth(() => {
                  if (isSaved) {
                    unsavePost(postId);
                  } else {
                    savePost(postId);
                  }
                })
              }
              className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-300 ${
                isSaved
                  ? "bg-[var(--midnight-code-bg)] text-[var(--midnight-accent-hover)]"
                  : "hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
              }`}
            >
              <Bookmark
                className="h-4 w-4"
                fill={isSaved ? "currentColor" : "none"}
              />
            </button>

            <button
              type="button"
              title="Add to collection"
              aria-label="Add to collection"
              onClick={() =>
                requireAuth(() => {
                  setOpenCollectionModal(true);
                })
              }
              className="flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-300 hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Share this letter"
              aria-label="Share this letter"
              onClick={() => setOpenShareModal(true)}
              className="flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-300 hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {openCollectionModal && (
        <AddToCollectionModal
          onClose={() => setOpenCollectionModal(false)}
          postId={postId}
        />
      )}

      {openShareModal && (
        <ShareModal onClose={() => setOpenShareModal(false)} />
      )}

      {showCommentsDrawer && (
        <div className="fixed inset-0 z-[999]">
          <button
            type="button"
            onClick={closeComments}
            className={`absolute inset-0 bg-black/60 backdrop-blur-[3px] transition-opacity duration-300 ${
              animateCommentsDrawer ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Close comments"
          />

          <aside
            className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] text-[var(--midnight-text)] shadow-2xl will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              animateCommentsDrawer ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/90 px-5 py-4 backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                  <MoonStar className="h-3.5 w-3.5 opacity-70" />

                  <span>The Midnight Letters</span>
                </div>

                <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                  Replies
                </h2>
              </div>

              <button
                type="button"
                title="Close"
                aria-label="Close comments"
                onClick={closeComments}
                className="rounded-full p-2 text-[var(--midnight-muted)] transition-all duration-300 hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 pb-10 pt-4">
              <CommentsSection postId={postId} variant="drawer" />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
