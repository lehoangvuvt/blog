"use client";

import { MoreHorizontal, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  clapCount: number;
  color: string;
};

type Props = {
  postId: string;
  currentUserName?: string;
};

const sampleComments: Comment[] = [
  {
    id: "1",
    author: "Bebi Zulaika",
    createdAt: "2026-04-25",
    clapCount: 60,
    color: "bg-purple-500",
    content:
      "it changes my perspective on productive. this explain why i feel tired all day long, very bussy chasing everything, yet i feel like i haven't done anything. that was sucks 😩",
  },
  {
    id: "2",
    author: "Muhammad Irfan",
    createdAt: "2026-04-24",
    clapCount: 32,
    color: "bg-green-500",
    content:
      "Such a well-written piece! The examples really helped me understand the concept better. Will definitely apply this to my daily routine.",
  },
  {
    id: "3",
    author: "Ananya Sharma",
    createdAt: "2026-04-23",
    clapCount: 18,
    color: "bg-indigo-500",
    content:
      "I've been struggling with this for so long and this article gave me the clarity I needed. Thank you!",
  },
  {
    id: "4",
    author: "Dewi Lestari",
    createdAt: "2026-04-22",
    clapCount: 12,
    color: "bg-yellow-500",
    content:
      "Love the practical tips at the end. Small changes can really make a big difference.",
  },
];

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

export function CommentsSection({
  postId,
  currentUserName = "Hoangvule",
}: Props) {
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [content, setContent] = useState("");

  const canSubmit = content.trim().length > 0;
  const responseCount = useMemo(() => comments.length, [comments.length]);

  const handleSubmit = () => {
    if (!canSubmit) return;

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: currentUserName,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      clapCount: 0,
      color: "bg-orange-600",
    };

    setComments((prev) => [newComment, ...prev]);
    setContent("");

    console.log("Comment submitted for post:", postId);
  };

  const handleCancel = () => {
    setContent("");
  };

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
            {getInitial(currentUserName)}
          </div>

          <p className="text-lg font-medium">{currentUserName}</p>
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
              <button
                type="button"
                className="transition hover:text-black"
                aria-label="Bold"
              >
                B
              </button>

              <button
                type="button"
                className="italic transition hover:text-black"
                aria-label="Italic"
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
                Respond
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-black/10 border-t border-black/10">
        {comments.map((comment) => (
          <article key={comment.id} className="py-9">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${comment.color} text-lg font-medium text-white`}
                >
                  {getInitial(comment.author)}
                </div>

                <div>
                  <p className="text-base font-medium leading-none">
                    {comment.author}
                  </p>

                  <p className="mt-1.5 text-sm text-neutral-500">
                    {formatCommentDate(comment.createdAt)}
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
                className="flex items-center gap-2 transition hover:text-black"
              >
                <span className="text-xl">👏</span>
                <span>{comment.clapCount}</span>
              </button>

              <button
                type="button"
                className="underline underline-offset-2 transition hover:text-black"
              >
                Reply
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}