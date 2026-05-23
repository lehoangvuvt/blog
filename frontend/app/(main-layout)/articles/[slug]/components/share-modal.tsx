"use client";

import { Check, Link2, MoonStar, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
        <div className="relative border-b border-[var(--midnight-border)]/70 px-6 py-6">
          <div className="absolute right-8 top-0 h-20 w-20 rounded-full bg-[var(--midnight-accent)]/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                <MoonStar className="h-3.5 w-3.5 text-[var(--midnight-accent)]/80" />
                <span>The Midnight Letters</span>
              </div>

              <h3 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-[var(--midnight-text)]">
                Share this letter
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--midnight-muted)]">
                Copy the link or send it to someone still awake.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onClose?.()}
              className="rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] p-2 text-[var(--midnight-muted)] transition hover:text-[var(--midnight-accent-hover)]"
              aria-label="Close share modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-sm text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)]"
            >
              Facebook
            </a>

            <a
              href={shareLinks.x}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-3 text-sm text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)]"
            >
              X
            </a>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] p-2">
            <div className="min-w-0 flex-1 truncate px-2 text-sm text-[var(--midnight-muted)]">
              {currentUrl}
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--midnight-accent)] px-3 py-2 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  Copy link
                </>
              )}
            </button>
          </div>
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
