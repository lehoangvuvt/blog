"use client";

import { useEffect, useRef, useState } from "react";
import { Highlighter, MessageCircle, Share2, StickyNote } from "lucide-react";

import { useAppSelector } from "@/store/hooks";
import { selectFont, selectFontSize } from "@/features/app-settings/selectors";

type Props = {
  html: string;
};

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function ArticleContent({ html }: Props) {
  const articleRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const font = useAppSelector(selectFont);
  const fontSize = useAppSelector(selectFontSize);

  const [selectedText, setSelectedText] = useState("");
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [highlightRects, setHighlightRects] = useState<HighlightRect[]>([]);
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [note, setNote] = useState("");

  const fontClass =
    font === "serif"
      ? "font-serif"
      : font === "monospace"
      ? "font-mono"
      : "font-sans";

  const sizeClass =
    fontSize === "small"
      ? "text-base prose-base"
      : fontSize === "large"
      ? "text-xl prose-xl"
      : "text-lg prose-lg";

  const closePopover = () => {
    setSelectedText("");
    setHighlightRects([]);
    setShowNoteBox(false);
    setNote("");
    window.getSelection()?.removeAllRanges();
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (popoverRef.current?.contains(event.target as Node)) return;

    setTimeout(() => {
      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return;
      }

      const text = selection.toString().trim();
      if (!text) return;

      const startNode = selection.anchorNode;

      if (!startNode || !articleRef.current?.contains(startNode)) {
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const rects = Array.from(range.getClientRects());
      const containerRect = articleRef.current.getBoundingClientRect();

      setSelectedText(text);
      setShowNoteBox(false);
      setNote("");

      setHighlightRects(
        rects.map((item) => ({
          top: item.top - containerRect.top,
          left: item.left - containerRect.left,
          width: item.width,
          height: item.height,
        }))
      );

      setPopoverPos({
        top: rect.top - containerRect.top - 50,
        left: rect.left - containerRect.left + rect.width / 2,
      });

      window.getSelection()?.removeAllRanges();
    }, 0);
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        closePopover();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveNote = () => {
    const notes = JSON.parse(localStorage.getItem("article_notes") || "[]");

    localStorage.setItem(
      "article_notes",
      JSON.stringify([
        {
          id: crypto.randomUUID(),
          text: selectedText,
          note,
          url: window.location.href,
          createdAt: new Date().toISOString(),
        },
        ...notes,
      ])
    );

    closePopover();
  };

  return (
    <div className="relative overflow-visible">
      {highlightRects.map((rect, index) => (
        <div
          key={index}
          className="pointer-events-none absolute z-0 rounded-[3px] bg-[rgba(143,164,194,0.24)]"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      ))}

      <section
        ref={articleRef}
        onMouseUp={handleMouseUp}
        className={`
          relative z-10 prose max-w-none scroll-smooth text-[var(--midnight-text)] transition-colors
          ${fontClass}
          ${sizeClass}

          [&_*]:font-inherit

          prose-headings:font-sans
          prose-headings:font-bold
          prose-headings:tracking-[-0.04em]
          prose-headings:text-[var(--midnight-text)]

          prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-3xl prose-h2:leading-tight
          prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-2xl prose-h3:leading-tight

          prose-p:my-6 prose-p:leading-8 prose-p:text-[inherit]

          prose-a:text-[var(--midnight-link)]
          prose-a:underline
          prose-a:decoration-[var(--midnight-accent)]/50
          prose-a:underline-offset-4
          hover:prose-a:text-[var(--midnight-accent-hover)]
          hover:prose-a:decoration-[var(--midnight-accent-hover)]

          prose-strong:font-semibold prose-strong:text-[var(--midnight-text)]

          prose-blockquote:rounded-r-xl
          prose-blockquote:border-l-[var(--midnight-accent)]/70
          prose-blockquote:bg-[var(--midnight-quote-bg)]
          prose-blockquote:py-2
          prose-blockquote:pl-5
          prose-blockquote:font-normal
          prose-blockquote:text-[var(--midnight-muted)]

          prose-ul:my-6 prose-ol:my-6 prose-li:my-2
          prose-li:text-[inherit] prose-li:leading-8

          prose-img:my-10 prose-img:rounded-2xl
          prose-img:border prose-img:border-[var(--midnight-border)]/70

          prose-hr:my-12 prose-hr:border-[var(--midnight-border)]/70

          prose-code:rounded-md prose-code:bg-[var(--midnight-code-bg)]
          prose-code:px-1.5 prose-code:py-0.5
          prose-code:text-[0.9em] prose-code:font-normal
          prose-code:text-[var(--midnight-text)]
          before:prose-code:content-none after:prose-code:content-none

          prose-pre:my-8
          prose-pre:rounded-2xl
          prose-pre:border prose-pre:border-[var(--midnight-border)]/70
          prose-pre:bg-[var(--midnight-code-bg)]
          prose-pre:p-5
          prose-pre:text-sm
          prose-pre:text-[var(--midnight-text)]
        `}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {selectedText && (
        <div
          ref={popoverRef}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            top: popoverPos.top,
            left: popoverPos.left,
            transform: "translateX(-50%)",
          }}
          className="
            absolute z-[9999]
            w-auto
            overflow-hidden
            rounded-full
            border border-[var(--midnight-border)]/70
            bg-[var(--midnight-surface)]/95
            px-1.5 py-1.5
            shadow-[0_18px_60px_rgba(0,0,0,0.35)]
            backdrop-blur-xl
          "
        >
          {!showNoteBox ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Highlight"
                aria-label="Highlight"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--midnight-text)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
              >
                <Highlighter className="h-3.5 w-3.5" />
                Highlight
              </button>

              <button
                type="button"
                title="Respond"
                aria-label="Respond"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--midnight-text)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Respond
              </button>

              <button
                type="button"
                title="Share"
                aria-label="Share"
                onClick={shareFacebook}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--midnight-text)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>

              <button
                type="button"
                title="Private note"
                aria-label="Private note"
                onClick={() => setShowNoteBox(true)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--midnight-text)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
              >
                <StickyNote className="h-3.5 w-3.5" />
                Note
              </button>
            </div>
          ) : (
            <div className="w-[280px] space-y-3 rounded-2xl p-2">
              <textarea
                value={note}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Leave a quiet note..."
                className="h-24 w-full resize-none rounded-xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] p-3 text-sm text-[var(--midnight-text)] outline-none placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/70"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closePopover}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-[var(--midnight-muted)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!note.trim()}
                  onClick={saveNote}
                  className="rounded-full bg-[var(--midnight-accent)] px-3 py-1.5 text-xs font-medium text-[var(--midnight-on-accent)] transition-opacity disabled:opacity-40"
                >
                  Save note
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
