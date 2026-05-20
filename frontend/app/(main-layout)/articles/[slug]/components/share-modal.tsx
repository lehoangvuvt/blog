"use client";

import { Check, Link2, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
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

  return (
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
            onClick={() => onClose?.()}
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
        onClick={() => onClose?.()}
        className="absolute inset-0 -z-10"
        aria-label="Close share modal"
      />
    </div>
  );
}
