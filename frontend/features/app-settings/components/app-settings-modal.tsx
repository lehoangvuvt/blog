/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFont,
  selectFontSize,
  selectTheme,
} from "@/features/app-settings/selectors";
import { setFont, setFontSize, setTheme } from "@/features/app-settings/slice";
import type { Font, FontSize } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function AppSettingsModal({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();

  const theme = useAppSelector(selectTheme);
  const font = useAppSelector(selectFont);
  const fontSize = useAppSelector(selectFontSize);

  const [previewTheme, setPreviewTheme] = useState(theme);
  const [previewFont, setPreviewFont] = useState(font);
  const [previewFontSize, setPreviewFontSize] = useState(fontSize);

  useEffect(() => {
    if (!isOpen) return;

    setPreviewTheme(theme);
    setPreviewFont(font);
    setPreviewFontSize(fontSize);
  }, [isOpen, theme, font, fontSize]);

  const handleSave = () => {
    dispatch(setTheme(previewTheme));
    dispatch(setFont(previewFont));
    dispatch(setFontSize(previewFontSize));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex h-[70vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--midnight-border)] bg-[var(--midnight-surface)] text-[var(--midnight-text)] shadow-2xl"
          >
            <div className="h-full w-full max-w-md overflow-y-auto border-r border-[var(--midnight-border)] bg-[var(--midnight-surface)] p-6">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-semibold text-[var(--midnight-accent)]">
                  Reading Mood
                </h2>
                <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                  Shape the page for a slower night.
                </p>
              </div>

              <div className="mb-5">
                <div className="mb-2 text-sm font-medium text-[var(--midnight-text)]">
                  Lighting
                </div>

                <div className="flex gap-2">
                  {(["light", "dark"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPreviewTheme(value)}
                      className={`rounded-xl border px-4 py-2 transition ${
                        previewTheme === value
                          ? "border-[var(--midnight-accent)] bg-[var(--midnight-accent)] text-[var(--midnight-on-accent)]"
                          : "border-[var(--midnight-border)] bg-[var(--midnight-surface)] text-[var(--midnight-muted)] hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
                      }`}
                    >
                      {value === "light" ? "Lamplight" : "After dark"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="mb-2 text-sm font-medium text-[var(--midnight-text)]">
                  Letter voice
                </div>

                <select
                  value={previewFont}
                  onChange={(e) => setPreviewFont(e.target.value as Font)}
                  className="w-full rounded-xl border border-[var(--midnight-border)] bg-[var(--midnight-surface)] px-3 py-2 text-[var(--midnight-text)] outline-none transition"
                >
                  <option value="sans-serif">Soft Sans</option>
                  <option value="serif">Letter Serif</option>
                  <option value="monospace">Typewriter</option>
                </select>
              </div>

              <div className="mb-6">
                <div className="mb-2 text-sm font-medium text-[var(--midnight-text)]">
                  Line pace
                </div>

                <select
                  value={previewFontSize}
                  onChange={(e) =>
                    setPreviewFontSize(e.target.value as FontSize)
                  }
                  className="w-full rounded-xl border border-[var(--midnight-border)] bg-[var(--midnight-surface)] px-3 py-2 text-[var(--midnight-text)] outline-none transition"
                >
                  <option value="small">Quiet</option>
                  <option value="medium">Room tone</option>
                  <option value="large">Slow and open</option>
                </select>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 rounded-xl border border-[var(--midnight-border)] bg-[var(--midnight-surface)] px-4 py-3 text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-accent-hover)]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-1/2 rounded-xl bg-[var(--midnight-accent)] px-4 py-3 font-medium text-[var(--midnight-on-accent)] transition hover:bg-[var(--midnight-accent-hover)]"
                >
                  Save
                </button>
              </div>
            </div>

            <div
              className={`flex flex-1 justify-center overflow-hidden p-6 transition-all ${
                previewTheme === "dark"
                  ? "bg-[var(--midnight-accent)] text-[var(--midnight-on-accent)]"
                  : "bg-[var(--midnight-bg)] text-[var(--midnight-text)]"
              } ${
                previewFont === "serif"
                  ? "font-serif"
                  : previewFont === "monospace"
                  ? "font-mono"
                  : "font-sans"
              } ${
                previewFontSize === "small"
                  ? "text-sm"
                  : previewFontSize === "large"
                  ? "text-lg"
                  : "text-base"
              }`}
            >
              <div className="h-full w-full max-w-2xl overflow-y-auto rounded-3xl pr-2">
                <article className="article-content rounded-3xl border border-[var(--midnight-border)] bg-[var(--midnight-surface)] p-6">
                  <div className="mb-3 inline-flex rounded-full bg-[var(--midnight-code-bg)] px-3 py-1 text-xs font-medium text-[var(--midnight-accent)]">
                    Letter sample
                  </div>

                  <h1 className="mb-3 text-3xl font-bold leading-tight">
                    A letter left after midnight
                  </h1>

                  <div className="mb-6 flex items-center gap-3 text-sm text-[var(--midnight-muted)]">
                    <div className="h-9 w-9 rounded-full bg-[var(--midnight-code-bg)]" />

                    <div>
                      <div className="font-medium">John Doe</div>
                      <div>May 12, 2026 &middot; 8 min read</div>
                    </div>
                  </div>

                  <div className="space-y-5 leading-7">
                    <p className="opacity-90">
                      Some nights ask for softer words, a quiet room, and room
                      to be a little unserious.
                    </p>

                    <p className="opacity-90">
                      The best pages hang around. They wait until the thought
                      stops pretending.
                    </p>

                    <blockquote className="rounded-2xl border-l-4 border-[var(--midnight-gold)] bg-[var(--midnight-code-bg)] p-4 italic">
                      &quot;Write like the page can keep a secret.&quot;
                    </blockquote>
                  </div>
                </article>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
