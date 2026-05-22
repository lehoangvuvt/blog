/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  Bookmark,
  Eye,
  FolderPlus,
  Heart,
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
import AddToCollectionModal from "./add-to-collection-modal";
import ShareModal from "./share-modal";
import { useMe } from "@/features/auth/hooks/use-me";
import SignInModal from "@/features/auth/components/sign-in-modal";
import { CommentsSection } from "./comments-section";
import useSavePost from "@/features/posts/hooks/use-save-post";
import useUnsavePost from "@/features/posts/hooks/use-unsave-post";

type Props = {
  postId: number;
};

export function ArticleToolbar({ postId }: Props) {
  const { data: myInfo } = useMe();
  const savedPostIds = myInfo?.savedPostIds ?? [];
  const isSaved = savedPostIds.includes(postId);

  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [animateCommentsDrawer, setAnimateCommentsDrawer] = useState(false);

  const [openShareModal, setOpenShareModal] = useState(false);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

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

  const requireAuth = (callback: () => void) => {
    if (!myInfo) {
      setOpenLoginModal(true);
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
      <div className="mt-8 flex items-center justify-between border-y border-black/10 py-3 text-sm text-neutral-500">
        <div className="flex items-center gap-5">
          <div
            title="Views"
            aria-label="Post views"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            <span>{postStatistics.viewsCount ?? 0}</span>
          </div>

          <button
            type="button"
            title={postStatistics.liked ? "Unlike" : "Like"}
            aria-label={postStatistics.liked ? "Unlike post" : "Like post"}
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
            title="Comments"
            aria-label="Open comments"
            onClick={openComments}
            className="flex items-center gap-2 transition hover:text-neutral-950"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{postStatistics.commentsCount ?? 0}</span>
          </button>

          <button
            type="button"
            title={postStatistics.reposted ? "Undo repost" : "Repost"}
            aria-label={
              postStatistics.reposted ? "Undo repost" : "Repost article"
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
            className="flex items-center gap-2 transition hover:text-neutral-950"
          >
            <Repeat2
              className="h-4 w-4"
              fill={postStatistics.reposted ? "currentColor" : "none"}
            />
            <span>{postStatistics.repostsCount ?? 0}</span>
          </button>

          <button
            type="button"
            title={isSaved ? "Unsave" : "Save"}
            aria-label={isSaved ? "Unsave post" : "Save post"}
            onClick={() =>
              requireAuth(() => {
                if (isSaved) {
                  unsavePost(postId);
                } else {
                  savePost(postId);
                }
              })
            }
            className="flex items-center gap-2 transition hover:text-neutral-950"
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
            className="flex items-center gap-2 transition hover:text-neutral-950"
          >
            <FolderPlus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          title="Share"
          aria-label="Share post"
          onClick={() => setOpenShareModal(true)}
          className="flex items-center gap-2 transition hover:text-neutral-950"
        >
          <Share2 className="h-4 w-4" />
        </button>
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

      <SignInModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
      />

      {showCommentsDrawer && (
        <div className="fixed inset-0 z-[999]">
          <button
            type="button"
            onClick={closeComments}
            className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
              animateCommentsDrawer ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Close comments"
          />

          <aside
            className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              animateCommentsDrawer ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
              <h2 className="font-serif text-2xl font-semibold">Responses</h2>

              <button
                type="button"
                title="Close"
                aria-label="Close comments"
                onClick={closeComments}
                className="rounded-full p-2 text-neutral-500 transition hover:bg-black/5 hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 pb-10">
              <CommentsSection postId={postId} variant="drawer" />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
