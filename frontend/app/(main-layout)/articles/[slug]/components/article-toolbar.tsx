"use client";

import { useMemo, useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Link2,
  Check,
} from "lucide-react";
import { usePostStatistics } from "@/features/posts/hooks/use-post-stasistics";

type Props = {
  postId: number;
};

export function ArticleToolbar({ postId }: Props) {
  const [openShareModal, setOpenShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data } = usePostStatistics(postId);

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
    await navigator.clipboard.writeText(currentUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <div className="mt-5 flex items-center justify-between border-y border-black/5 py-4 text-neutral-600">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="flex items-center gap-2 text-sm transition hover:text-black"
          >
            <Heart className="h-5 w-5" />
            <span>{data?.likesCount ?? 0}</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 text-sm transition hover:text-black"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{data?.commentsCount ?? 0}</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 text-sm transition hover:text-black"
          >
            <Repeat2 className="h-5 w-5" />
            <span>{data?.repostsCount ?? 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpenShareModal(true)}
            className="flex items-center gap-2 text-sm transition hover:text-black"
          >
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {openShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-black">
                  Share article
                </h3>

                <p className="mt-1 text-sm text-neutral-500">
                  Share this article with your audience
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenShareModal(false)}
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-[#1877F2]/15 bg-[#1877F2]/5 px-5 py-4 transition-all duration-200 hover:border-[#1877F2]/30 hover:bg-[#1877F2]/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M22 12.07C22 6.477 17.523 2 12 2S2 6.477 2 12.07c0 5.017 3.657 9.182 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.52 1.492-3.913 3.777-3.913 1.094 0 2.238.196 2.238.196v2.475h-1.26c-1.242 0-1.63.774-1.63 1.567v1.88h2.773l-.443 2.9h-2.33V22c4.78-.748 8.437-4.913 8.437-9.93Z" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-black">
                    Facebook
                  </span>
                  <span className="text-xs text-neutral-500">
                    Share with friends
                  </span>
                </div>
              </a>

              <a
                href={shareLinks.x}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-neutral-50 px-5 py-4 transition-all duration-200 hover:border-black/20 hover:bg-neutral-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932L18.9 1.153Zm-1.29 19.494h2.039L6.486 3.248H4.298l13.313 17.399Z" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-black">X</span>
                  <span className="text-xs text-neutral-500">
                    Post to timeline
                  </span>
                </div>
              </a>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Link
              </p>

              <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-neutral-50 p-2">
                <div className="min-w-0 flex-1 truncate px-3 text-sm text-neutral-600">
                  {currentUrl}
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
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
          </div>

          <button
            type="button"
            onClick={() => setOpenShareModal(false)}
            className="absolute inset-0 -z-10"
          />
        </div>
      )}
    </>
  );
}