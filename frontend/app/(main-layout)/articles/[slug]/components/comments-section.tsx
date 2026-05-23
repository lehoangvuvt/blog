/* eslint-disable @next/next/no-img-element */
"use client";

import { useCreatePostComment } from "@/features/posts/hooks/use-create-post-comment";
import { MessageCircle, MoreHorizontal, MoonStar } from "lucide-react";
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
          ? "pt-6 text-[var(--midnight-text)]"
          : "mt-24 border-t border-[var(--midnight-border)]/70 pt-10 text-[var(--midnight-text)]"
      }
    >
      {variant === "page" && (
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
            <MoonStar className="h-3.5 w-3.5 text-[var(--midnight-accent)]/80" />

            <span>The Midnight Letters</span>
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-[var(--midnight-text)]">
            Replies
          </h2>

          <p className="mt-2 text-sm text-[var(--midnight-muted)]">
            {responseCount} {responseCount === 1 ? "reply" : "replies"} in the
            margin
          </p>
        </div>
      )}

      {variant === "drawer" && (
        <p className="mb-5 text-sm text-[var(--midnight-muted)]">
          {responseCount} {responseCount === 1 ? "reply" : "replies"} in the
          margin
        </p>
      )}

      <div className="midnight-panel mb-12 rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-sm font-medium text-[var(--midnight-muted)]">
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

          <p className="text-sm font-medium text-[var(--midnight-text)]">
            {userInfo?.fullName ?? "You"}
          </p>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Leave a quiet thought..."
          rows={4}
          className="
            min-h-28 w-full resize-none rounded-xl
            border border-[var(--midnight-border)]/70
            bg-[var(--midnight-code-bg)]
            px-4 py-3
            text-[15px] leading-7 text-[var(--midnight-text)]
            outline-none transition-colors
            placeholder:text-[var(--midnight-soft)]
            focus:border-[var(--midnight-accent)]/70
          "
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="ml-auto flex items-center gap-3">
            {content.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setContent("")}
                className="
                  rounded-full px-4 py-2 text-sm
                  text-[var(--midnight-muted)]
                  transition-colors
                  hover:bg-[var(--midnight-code-bg)]
                  hover:text-[var(--midnight-text)]
                "
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="
                rounded-full
                bg-[var(--midnight-accent)]
                px-5 py-2
                text-sm font-medium
                text-[var(--midnight-on-accent)]
                transition-all duration-300
                hover:opacity-90
                disabled:opacity-40
              "
            >
              {isPending ? "Sending..." : "Leave reply"}
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--midnight-border)]/70 border-t border-[var(--midnight-border)]/70">
        {isLoading && (
          <p className="py-10 text-sm text-[var(--midnight-muted)]">
            Listening for replies...
          </p>
        )}

        {!isLoading && comments.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--midnight-muted)]">
              It’s quiet in the margin tonight.
            </p>

            <p className="mt-1 text-sm text-[var(--midnight-soft)]">
              Be the first voice here.
            </p>
          </div>
        )}

        {comments.map((comment) => {
          const authorName = comment.user.full_name || "Unknown user";

          return (
            <article
              key={comment.id}
              className="group py-8 transition-colors duration-300 hover:bg-[rgba(21,25,34,0.35)] md:px-4"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {comment.user.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={authorName}
                      className="h-9 w-9 rounded-full border border-[var(--midnight-border)]/70 object-cover opacity-95"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-sm font-medium text-[var(--midnight-muted)]">
                      {getInitial(authorName)}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-[var(--midnight-text)]">
                      {authorName}
                    </p>

                    <p className="mt-0.5 text-sm text-[var(--midnight-soft)]">
                      {formatCommentDate(comment.created_at)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="
                    rounded-full p-2
                    text-[var(--midnight-soft)]
                    transition-all duration-300
                    hover:bg-[var(--midnight-code-bg)]
                    hover:text-[var(--midnight-accent-hover)]
                  "
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <p className="whitespace-pre-wrap text-[15px] leading-8 text-[var(--midnight-muted)]">
                {comment.content}
              </p>

              <div className="mt-5 flex items-center gap-5 text-sm text-[var(--midnight-soft)]">
                <button
                  type="button"
                  className="transition-colors hover:text-[var(--midnight-accent-hover)]"
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

        <div ref={loadMoreRef} className="py-10 text-center">
          {isFetchingNextPage && (
            <p className="text-sm text-[var(--midnight-muted)]">
              More voices drifting in...
            </p>
          )}

          {!hasNextPage && comments.length > 0 && (
            <p className="text-sm text-[var(--midnight-soft)]">
              You’ve reached the end of the conversation.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
