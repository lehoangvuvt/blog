"use client";

import { useEffect, useRef, useState } from "react";
import { StickyNote, X } from "lucide-react";

import { useAppSelector } from "@/store/hooks";
import {
  selectFont,
  selectFontSize,
  selectTheme,
} from "@/features/app-settings/selectors";

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

  const theme = useAppSelector(selectTheme);
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
        top: rect.top - containerRect.top - 44,
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

  const shareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        selectedText
      )}&url=${encodeURIComponent(window.location.href)}`,
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
          className="pointer-events-none absolute z-0 rounded-[2px] bg-[#2f6fed]/70"
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
          relative z-10 prose prose-neutral max-w-none scroll-smooth transition-colors
          ${
            theme === "dark" ? "prose-invert text-zinc-200" : "text-neutral-800"
          }
          ${fontClass}
          ${sizeClass}

          [&_*]:font-inherit

          prose-headings:font-serif
          prose-headings:font-semibold
          prose-headings:tracking-[-0.025em]
          prose-headings:text-neutral-950
          dark:prose-headings:text-zinc-100

          prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-3xl prose-h2:leading-tight
          prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-2xl prose-h3:leading-tight

          prose-p:my-6 prose-p:leading-8 prose-p:text-[inherit]

          prose-a:text-neutral-950 prose-a:underline prose-a:decoration-black/20
          prose-a:underline-offset-4 hover:prose-a:decoration-black
          dark:prose-a:text-zinc-100 dark:prose-a:decoration-white/25

          prose-strong:font-semibold prose-strong:text-neutral-950
          dark:prose-strong:text-zinc-100

          prose-blockquote:border-l-neutral-300 prose-blockquote:pl-5
          prose-blockquote:font-serif prose-blockquote:text-[inherit]
          prose-blockquote:text-neutral-600
          dark:prose-blockquote:border-l-zinc-700
          dark:prose-blockquote:text-zinc-300

          prose-ul:my-6 prose-ol:my-6 prose-li:my-2
          prose-li:text-[inherit] prose-li:leading-8

          prose-img:my-10 prose-img:rounded-xl

          prose-hr:my-12 prose-hr:border-black/10 dark:prose-hr:border-white/10

          prose-code:rounded-md prose-code:bg-black/[0.04]
          prose-code:px-1.5 prose-code:py-0.5
          prose-code:text-[0.9em] prose-code:font-normal
          prose-code:text-neutral-800
          before:prose-code:content-none after:prose-code:content-none
          dark:prose-code:bg-white/10 dark:prose-code:text-zinc-200

          prose-pre:my-8 prose-pre:rounded-xl prose-pre:bg-neutral-950
          prose-pre:p-5 prose-pre:text-sm
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
    rounded-md
    bg-[#242424]
    px-2 py-1.5
    shadow-xl
  "
        >
          {!showNoteBox ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/10"
              >
                Highlight
              </button>

              <button
                type="button"
                className="rounded px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/10"
              >
                Respond
              </button>

              <button
                type="button"
                onClick={shareFacebook}
                className="rounded px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/10"
              >
                Share
              </button>

              <button
                type="button"
                onClick={() => setShowNoteBox(true)}
                className="rounded px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/10"
              >
                Private note
              </button>
            </div>
          ) : (
            <div className="w-[260px] space-y-2 p-1">
              <textarea
                value={note}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your note..."
                className="h-24 w-full resize-none rounded-md border border-white/10 bg-white p-3 text-sm text-black outline-none"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closePopover}
                  className="rounded px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!note.trim()}
                  onClick={saveNote}
                  className="rounded bg-white px-3 py-1.5 text-xs font-medium text-black disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
