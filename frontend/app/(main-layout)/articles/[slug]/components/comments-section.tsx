/* eslint-disable @next/next/no-img-element */
"use client";

import { useCreatePostComment } from "@/features/posts/hooks/use-create-post-comment";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePostComments } from "@/features/posts/hooks/use-post-comments";
import { useMe } from "@/features/auth/hooks/use-me";

type Props = {
  postId: number;
  variant?: "page" | "drawer";
};

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date));
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function CommentsSection({ postId, variant = "page" }: Props) {
  const { data: userInfo } = useMe();
  const { mutate: createPostComment, isPending } = useCreatePostComment();

  const {
    data: commentsData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePostComments({
    postId,
    limit: 10,
  });

  const comments = commentsData?.pages.flatMap((page) => page.data) ?? [];
  const meta = commentsData?.pages[0]?.meta ?? null;

  const [content, setContent] = useState("");

  const responseCount = useMemo(
    () => meta?.total ?? comments.length,
    [meta?.total, comments.length]
  );

  const canSubmit = content.trim().length > 0 && !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;

    createPostComment(
      {
        content: content.trim(),
        postId,
      },
      {
        onSuccess: () => {
          setContent("");
          refetch();
        },
      }
    );
  };

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;

    if (!el || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section
      className={
        variant === "drawer"
          ? "pt-6 text-neutral-950"
          : "mt-24 border-t border-black/10 pt-10 text-neutral-950"
      }
    >
      {variant === "page" && (
        <div className="mb-10">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">
            Responses
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {responseCount} {responseCount === 1 ? "response" : "responses"}
          </p>
        </div>
      )}

      {variant === "drawer" && (
        <p className="mb-5 text-sm text-neutral-500">
          {responseCount} {responseCount === 1 ? "response" : "responses"}
        </p>
      )}

      <div className="mb-12 rounded-xl border border-black/10 bg-white p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-sm font-medium text-neutral-500">
            {userInfo?.avatarUrl ? (
              <img
                src={userInfo.avatarUrl}
                alt={userInfo.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitial(userInfo?.fullName ?? "")
            )}
          </div>

          <p className="text-sm font-medium text-neutral-900">
            {userInfo?.fullName ?? "You"}
          </p>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a response..."
          rows={4}
          className="min-h-28 w-full resize-none bg-transparent text-base leading-7 text-neutral-800 outline-none placeholder:text-neutral-400"
        />

        <div className="mt-4 flex items-center justify-end gap-3">
          {content.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setContent("")}
              className="text-sm text-neutral-500 transition hover:text-neutral-900"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:bg-neutral-200 disabled:text-white"
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      <div className="divide-y divide-black/10 border-t border-black/10">
        {isLoading && (
          <p className="py-8 text-sm text-neutral-500">Loading responses...</p>
        )}

        {!isLoading && comments.length === 0 && (
          <p className="py-8 text-sm text-neutral-500">
            No responses yet. Be the first to respond.
          </p>
        )}

        {comments.map((comment) => {
          const authorName = comment.user.full_name || "Unknown user";

          return (
            <article key={comment.id} className="article-content py-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {comment.user.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={authorName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-500">
                      {getInitial(authorName)}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-neutral-950">
                      {authorName}
                    </p>

                    <p className="mt-0.5 text-sm text-neutral-500">
                      {formatCommentDate(comment.created_at)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <p className="whitespace-pre-wrap text-[15px] leading-7 text-neutral-800">
                {comment.content}
              </p>

              <div className="mt-4 flex items-center gap-5 text-sm text-neutral-500">
                <button
                  type="button"
                  className="transition hover:text-neutral-950"
                >
                  Reply
                </button>

                {comment._count.replies > 0 && (
                  <span>
                    {comment._count.replies}{" "}
                    {comment._count.replies === 1 ? "reply" : "replies"}
                  </span>
                )}
              </div>
            </article>
          );
        })}

        <div ref={loadMoreRef} className="py-8 text-center">
          {isFetchingNextPage && (
            <p className="text-sm text-neutral-500">
              Loading more responses...
            </p>
          )}

          {!hasNextPage && comments.length > 0 && (
            <p className="text-sm text-neutral-400">You’re all caught up.</p>
          )}
        </div>
      </div>
    </section>
  );
}
