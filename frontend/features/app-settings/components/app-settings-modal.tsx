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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex h-[70vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="h-full w-full max-w-md overflow-y-auto border-r border-gray-200 bg-white p-6 text-black">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Appearance Settings</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Customize your reading experience
                </p>
              </div>

              <div className="mb-5">
                <div className="mb-2 text-sm font-medium">Theme</div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("light")}
                    className={`rounded-xl border px-4 py-2 transition ${
                      previewTheme === "light"
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    Light
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewTheme("dark")}
                    className={`rounded-xl border px-4 py-2 transition ${
                      previewTheme === "dark"
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <div className="mb-2 text-sm font-medium">Font</div>

                <select
                  value={previewFont}
                  onChange={(e) => setPreviewFont(e.target.value as Font)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black outline-none transition"
                >
                  <option value="sans-serif">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>

              <div className="mb-6">
                <div className="mb-2 text-sm font-medium">Font Size</div>

                <select
                  value={previewFontSize}
                  onChange={(e) =>
                    setPreviewFontSize(e.target.value as FontSize)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black outline-none transition"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-black transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-1/2 rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-zinc-800"
                >
                  Save
                </button>
              </div>
            </div>

            <div
              className={`flex flex-1 justify-center overflow-hidden p-6 transition-all ${
                previewTheme === "dark"
                  ? "bg-zinc-950 text-white"
                  : "bg-zinc-100 text-black"
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
                <article
                  className={`article-content rounded-3xl p-6 ${
                    previewTheme === "dark" ? "bg-zinc-900" : "bg-white"
                  }`}
                >
                  <div
                    className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      previewTheme === "dark"
                        ? "bg-white/10 text-zinc-300"
                        : "bg-black/5 text-zinc-600"
                    }`}
                  >
                    Technology
                  </div>

                  <h1 className="mb-3 text-3xl font-bold leading-tight">
                    Building a modern blogging experience
                  </h1>

                  <div
                    className={`mb-6 flex items-center gap-3 text-sm ${
                      previewTheme === "dark"
                        ? "text-zinc-400"
                        : "text-zinc-500"
                    }`}
                  >
                    <div
                      className={`h-9 w-9 rounded-full ${
                        previewTheme === "dark" ? "bg-zinc-700" : "bg-zinc-300"
                      }`}
                    />

                    <div>
                      <div className="font-medium">John Doe</div>
                      <div>May 12, 2026 · 8 min read</div>
                    </div>
                  </div>

                  <div className="space-y-5 leading-7">
                    <p className="opacity-90">
                      Modern frontend architecture has evolved significantly
                      with the rise of Next.js.
                    </p>

                    <p className="opacity-90">
                      Redux Toolkit simplifies state management and improves
                      scalability.
                    </p>

                    <blockquote
                      className={`rounded-2xl border-l-4 p-4 italic ${
                        previewTheme === "dark"
                          ? "border-white/20 bg-white/5"
                          : "border-black/20 bg-black/5"
                      }`}
                    >
                      “Good architecture is built on clarity and
                      maintainability.”
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
