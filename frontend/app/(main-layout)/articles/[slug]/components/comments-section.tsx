/* eslint-disable @next/next/no-img-element */
"use client";

import { useCreatePostComment } from "@/features/posts/hooks/use-create-post-comment";
import { MoreHorizontal, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePostComments } from "@/features/posts/hooks/use-post-comments";
import { useMe } from "@/features/auth/hooks/use-me";

type Props = {
  postId: number;
};

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date));
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

export function CommentsSection({ postId }: Props) {
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

  const canSubmit = content.trim().length > 0 && !isPending;
  const responseCount = useMemo(
    () => meta?.total ?? comments.length,
    [meta?.total, comments.length]
  );

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

  const handleCancel = () => {
    setContent("");
  };

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;

    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="mt-24 border-t border-black/5 pt-12 text-neutral-900">
      <div className="mb-12 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Responses ({responseCount})
        </h2>

        <ShieldCheck className="h-5 w-5 text-neutral-700" strokeWidth={1.8} />
      </div>

      <div className="mb-14">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-xl font-medium text-white">
            {getInitial(userInfo?.fullName ?? "")}
          </div>

          <p className="text-lg font-medium">{userInfo?.fullName ?? ""}</p>
        </div>

        <div className="rounded-lg bg-neutral-50 px-6 py-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What are your thoughts?"
            rows={5}
            className="min-h-32 w-full resize-none bg-transparent text-base leading-7 text-neutral-800 outline-none placeholder:text-neutral-400"
          />

          <div className="mt-7 flex items-center justify-between">
            <div className="flex items-center gap-8 font-serif text-2xl font-bold text-neutral-500">
              <button type="button" className="transition hover:text-black">
                B
              </button>

              <button
                type="button"
                className="italic transition hover:text-black"
              >
                i
              </button>
            </div>

            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm text-neutral-900 transition hover:text-black"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="rounded-full px-5 py-2.5 text-sm font-medium transition disabled:bg-neutral-200 disabled:text-white enabled:bg-neutral-900 enabled:text-white enabled:hover:bg-black"
              >
                {isPending ? "Responding..." : "Respond"}
              </button>
            </div>
          </div>
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
            <article key={comment.id} className="py-9">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {comment.user.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={authorName}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-lg font-medium text-white">
                      {getInitial(authorName)}
                    </div>
                  )}

                  <div>
                    <p className="text-base font-medium leading-none">
                      {authorName}
                    </p>

                    <p className="mt-1.5 text-sm text-neutral-500">
                      {formatCommentDate(comment.created_at)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-full p-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-7 whitespace-pre-wrap text-base leading-8 text-neutral-900">
                {comment.content}
              </p>

              <div className="flex items-center gap-7 text-sm text-neutral-600">
                <button
                  type="button"
                  className="underline underline-offset-2 transition hover:text-black"
                >
                  Reply
                </button>

                {comment._count.replies > 0 && (
                  <span>{comment._count.replies} replies</span>
                )}
              </div>
            </article>
          );
        })}

        <div ref={loadMoreRef} className="py-6 text-center">
          {isFetchingNextPage && (
            <p className="text-sm text-neutral-500">Loading more responses...</p>
          )}

          {!hasNextPage && comments.length > 0 && (
            <p className="text-sm text-neutral-400">No more responses.</p>
          )}
        </div>
      </div>
    </section>
  );
}