/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { Highlighter } from "lucide-react";

import { useAppSelector } from "@/store/hooks";
import { selectFont, selectFontSize } from "@/features/app-settings/selectors";
import type { HighlightRect } from "@/features/posts/types";
import { createHighlight } from "@/features/posts/api/create-post-highlight";
import { getUserPostHighlights } from "@/features/users/api/get-user-post-highlights";
import { apiClient } from "@/shared/api/client";

type Props = {
  html: string;
  postId: number;
};

type SavedHighlight = {
  id: string;
  text: string;
  note?: string;
  url: string;
  createdAt: string;
  rects: HighlightRect[];
};

const getHighlightBox = (rects: HighlightRect[]) => {
  const top = Math.min(...rects.map((rect) => rect.top));
  const left = Math.min(...rects.map((rect) => rect.left));
  const right = Math.max(...rects.map((rect) => rect.left + rect.width));
  const bottom = Math.max(...rects.map((rect) => rect.top + rect.height));

  return {
    top,
    left,
    width: right - left,
    height: bottom - top,
  };
};

export async function updateReadingProgress(payload: {
  postId: number;
  progress: number;
}) {
  const data = { progress: payload.progress };
  const res = await apiClient.post(`/posts/${payload.postId}/read`, data);
  return res.data;
}

export function ArticleContent({ html, postId }: Props) {
  const articleRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const savedProgressRef = useRef(0);

  const font = useAppSelector(selectFont);
  const fontSize = useAppSelector(selectFontSize);

  const [selectedText, setSelectedText] = useState("");
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [highlightRects, setHighlightRects] = useState<HighlightRect[]>([]);
  const [savedHighlights, setSavedHighlights] = useState<SavedHighlight[]>([]);
  const [activeHighlight, setActiveHighlight] = useState<SavedHighlight | null>(
    null
  );
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [note, setNote] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);

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

  const saveHighlight = async (highlightNote?: string) => {
    const safeNote =
      typeof highlightNote === "string" ? highlightNote.trim() : "";

    const createdHighlight = await createHighlight({
      postId,
      text: selectedText,
      note: safeNote || undefined,
      rects: highlightRects,
    });

    setSavedHighlights((prev) => [
      {
        id: createdHighlight.id,
        text: createdHighlight.text,
        note: createdHighlight.note || undefined,
        createdAt: createdHighlight.createdAt,
        rects: createdHighlight.rects,
        url: window.location.href,
      },
      ...prev,
    ]);

    closePopover();
  };

  useEffect(() => {
    getUserPostHighlights(postId)
      .then((highlights) => {
        setSavedHighlights(
          highlights.map((item: SavedHighlight) => ({
            id: item.id,
            text: item.text,
            note: item.note,
            rects: item.rects,
            createdAt: item.createdAt,
            url: window.location.href,
          }))
        );
      })
      .catch(() => {
        setSavedHighlights([]);
      });
  }, [postId]);

  useEffect(() => {
    function handleClickOutsidePopover(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        closePopover();
      }
    }

    document.addEventListener("mousedown", handleClickOutsidePopover);

    return () =>
      document.removeEventListener("mousedown", handleClickOutsidePopover);
  }, []);

  useEffect(() => {
    function handleCloseActiveHighlight(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (
        target.closest("[data-highlight-layer]") ||
        target.closest("[data-highlight-sidebar]")
      ) {
        return;
      }

      setActiveHighlight(null);
    }

    document.addEventListener("mousedown", handleCloseActiveHighlight);

    return () =>
      document.removeEventListener("mousedown", handleCloseActiveHighlight);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function updateProgress() {
      if (!articleRef.current) return;

      const rect = articleRef.current.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = rect.height;
      const viewportBottom = window.scrollY + window.innerHeight;

      const rawProgress = ((viewportBottom - articleTop) / articleHeight) * 100;
      const currentProgress = Math.min(Math.max(rawProgress, 0), 100);

      setReadingProgress(currentProgress);

      const progressToSave = Math.round(
        Math.max(savedProgressRef.current, currentProgress)
      );

      savedProgressRef.current = progressToSave;

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        updateReadingProgress({
          postId,
          progress: progressToSave,
        }).catch(() => {});
      }, 800);
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);

      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [postId]);

  return (
    <div className="relative isolate overflow-visible">
      {highlightRects.map((rect, index) => (
        <div
          key={`current-highlight-${index + 1}`}
          className="pointer-events-none absolute z-20 rounded-[3px] bg-[rgba(143,164,194,0.24)]"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      ))}

      {savedHighlights.map((highlight) => {
        const box = getHighlightBox(highlight.rects);
        const isActive = activeHighlight?.id === highlight.id;

        return (
          <div
            data-highlight-layer
            key={highlight.id}
            onClick={(event) => {
              event.stopPropagation();

              setActiveHighlight((prev) =>
                prev?.id === highlight.id ? null : highlight
              );
            }}
            className="group absolute z-20 cursor-pointer"
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
            }}
          >
            {highlight.rects.map((rect, index) => (
              <div
                key={`${highlight.id}-${index}`}
                className={`
                  absolute rounded-[3px]
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[rgba(245,214,140,0.46)] shadow-[0_0_14px_rgba(245,214,140,0.2)]"
                      : "bg-[rgba(212,185,122,0.22)] group-hover:bg-[rgba(245,214,140,0.34)] group-hover:shadow-[0_0_12px_rgba(245,214,140,0.14)]"
                  }
                `}
                style={{
                  top: rect.top - box.top,
                  left: rect.left - box.left,
                  width: rect.width,
                  height: rect.height,
                }}
              />
            ))}
          </div>
        );
      })}

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

      {activeHighlight && (
        <aside
          data-highlight-sidebar
          className="
            fixed right-0 top-0 z-[2147483647]
            flex h-screen w-[380px] flex-col
            border-l border-white/5
            bg-[linear-gradient(to_bottom,rgba(15,15,15,0.96),rgba(10,10,10,0.98))]
            shadow-[-24px_0_80px_rgba(0,0,0,0.45)]
            backdrop-blur-2xl
          "
        >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--midnight-soft)]">
                Highlight note
              </p>
            </div>

            <div className="h-2 w-2 rounded-full bg-[var(--midnight-accent)]/70 shadow-[0_0_12px_rgba(212,185,122,0.5)]" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-6">
            <div
              className="
                relative max-h-[32vh] shrink-0 overflow-y-auto
                rounded-3xl
                border border-[var(--midnight-border)]/50
                bg-[rgba(255,255,255,0.02)]
                p-5
              "
            >
              <div
                className="
                  absolute left-0 top-0 h-full w-1
                  bg-[linear-gradient(to_bottom,rgba(245,214,140,0.9),rgba(245,214,140,0.1))]
                "
              />

              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--midnight-soft)]">
                Highlighted passage
              </p>

              <p
                className="
                  whitespace-pre-wrap
                  text-[15px]
                  italic
                  leading-8
                  text-[var(--midnight-muted)]
                "
              >
                “{activeHighlight.text}”
              </p>
            </div>

            <div className="mt-8 flex min-h-0 flex-1 flex-col">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--midnight-accent)]/80" />

                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--midnight-soft)]">
                  Note
                </p>
              </div>

              <div
                className="
                  min-h-0 flex-1 overflow-y-auto
                  rounded-3xl
                  border border-[var(--midnight-border)]/50
                  bg-[rgba(255,255,255,0.015)]
                  p-5
                "
              >
                <p
                  className="
                    whitespace-pre-wrap break-words
                    text-[15px]
                    leading-8
                    text-[var(--midnight-text)]
                  "
                >
                  {activeHighlight.note || "No note added for this highlight."}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 px-6 py-4">
            <p className="text-[11px] text-[var(--midnight-soft)]">
              Click a highlighted passage to revisit your thoughts.
            </p>
          </div>
        </aside>
      )}

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
            rounded-2xl
            border border-[var(--midnight-border)]/70
            bg-[var(--midnight-surface)]/95
            p-2
            shadow-[0_18px_60px_rgba(0,0,0,0.35)]
            backdrop-blur-xl
          "
        >
          {!showNoteBox ? (
            <button
              type="button"
              title="Highlight"
              aria-label="Highlight"
              onClick={() => setShowNoteBox(true)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--midnight-text)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
            >
              <Highlighter className="h-3.5 w-3.5" />
              Highlight
            </button>
          ) : (
            <div className="w-[320px] space-y-3">
              <div className="rounded-xl border border-[var(--midnight-border)]/60 bg-[var(--midnight-code-bg)]/70 p-3">
                <p className="line-clamp-3 text-xs leading-5 text-[var(--midnight-muted)]">
                  “{selectedText}”
                </p>
              </div>

              <textarea
                value={note}
                autoFocus
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for this highlight..."
                className="
                  h-28 w-full resize-none rounded-xl
                  border border-[var(--midnight-border)]/70
                  bg-[var(--midnight-code-bg)]
                  p-3 text-sm leading-6
                  text-[var(--midnight-text)]
                  outline-none
                  placeholder:text-[var(--midnight-soft)]
                  focus:border-[var(--midnight-accent)]/70
                "
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={closePopover}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-[var(--midnight-muted)] transition-colors hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => saveHighlight(note)}
                  className="rounded-full bg-[var(--midnight-accent)] px-4 py-1.5 text-xs font-medium text-[var(--midnight-on-accent)] transition-opacity hover:opacity-90"
                >
                  Save highlight
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 z-[2147483646] w-full">
        <div className="relative h-1 w-full bg-black/20">
          <div
            className="h-full bg-[var(--midnight-accent)] transition-[width] duration-150"
            style={{
              width: `${readingProgress}%`,
            }}
          />
        </div>

        <div
          className="
          pointer-events-none
          absolute right-4 bottom-3
          rounded-full
          border border-white/5
          bg-[rgba(10,10,10,0.75)]
          px-3 py-1
          text-sm
          font-medium
          tracking-[0.08em]
          text-[white]
          shadow-[0_8px_30px_rgba(0,0,0,0.35)]
          backdrop-blur-xl
        "
        >
          {Math.round(readingProgress)}%
        </div>
      </div>
    </div>
  );
}
