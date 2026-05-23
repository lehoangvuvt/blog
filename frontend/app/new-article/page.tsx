/* eslint-disable @next/next/no-img-element */
"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DefaultTemplate } from "@/features/editor/components/default-template";
import { createPost } from "@/features/posts/api/create-post";
import {
  getUploadPresignedUrl,
  uploadFile,
} from "@/features/files/api/upload.api";
import { useMe } from "@/features/auth/hooks/use-me";
import { useRouter } from "next/navigation";
import Loading from "@/shared/components/loading";
import ForbiddenPage from "../forbbiden";

export default function NewArticlePage() {
  const router = useRouter();
  const { data: me, isLoading: isLoadingMe } = useMe();
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [tags, setTags] = useState<string[]>(["Journal", "Ideas"]);

  const [title, setTitle] = useState("");
  const TITLE_LIMIT = 100;

  const [subtitle, setSubtitle] = useState("");
  const SUBTITLE_LIMIT = 200;

  const [shake, setShake] = useState(false);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishTagInput, setPublishTagInput] = useState("");

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [publishedPost, setPublishedPost] = useState<{
    id?: string;
    slug?: string;
  } | null>(null);

  const [publishStatus, setPublishStatus] = useState<
    "idle" | "publishing" | "success" | "error"
  >("idle");
  const [publishError, setPublishError] = useState("");

  const [jsonContent, setJsonContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  const addPublishTag = () => {
    const t = publishTagInput.trim();
    if (!t) return;

    if (!tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }

    setPublishTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let raf = 0;

    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    el.style.height = "auto";

    const lineHeight = 1.1 * 64;
    const maxHeight = lineHeight * 3;

    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length <= TITLE_LIMIT) {
      setTitle(value);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 200);
      setTitle(value.slice(0, TITLE_LIMIT));
    }
  };

  const autoHour = new Date().getHours();
  const autoDarkMode = autoHour >= 18 || autoHour < 6;

  const [darkMode, setDarkMode] = useState(autoDarkMode);

  const moodText = darkMode
    ? "The night is quiet enough for the sentence you almost didn't write."
    : "A clean page for thoughts that arrived early.";

  const moodLabel = darkMode ? "Midnight draft" : "Morning letter";

  const moodY = scrollY * 0.15;
  const titleY = scrollY * 0.25;
  const dividerY = scrollY * 0.35;
  const editorY = scrollY * 0.1;

  const moodOpacity = Math.max(1 - scrollY / 600, 0.2);
  const titleOpacity = Math.max(1 - scrollY / 900, 0.25);
  const topbarOpacity = Math.max(1 - scrollY / 500, 0.3);

  const handlePublish = async () => {
    try {
      setPublishStatus("publishing");
      setPublishError("");

      await createPost({
        title,
        subTitle: subtitle,
        published: true,
        jsonContent: jsonContent,
        htmlContent: htmlContent,
        tags,
        ...(thumbnailPreview && { thumbnailImage: thumbnailPreview }),
      });
      setShowPublishModal(false);

      setTimeout(() => {
        setPublishStatus("success");
      }, 200);
    } catch {
      setPublishStatus("error");
      setPublishError("The page went quiet. Try sending it again.");
    }
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const mimeType = file.type;
    const getUploadPresignedUrlResponse = await getUploadPresignedUrl(
      file.name,
      mimeType
    );
    const { url, publicUrl } = getUploadPresignedUrlResponse;
    await uploadFile(file, url);

    setThumbnailPreview(publicUrl);
  };

  if (!mounted || isLoadingMe) return <Loading />;

  if (!me) {
    return <ForbiddenPage />;
  }

  return (
    <div
      className={`
        min-h-screen transition-all duration-1000 ease-out
        ${mounted ? "opacity-100" : "opacity-0"}
        ${
          darkMode
            ? "bg-[#111111] text-[#f5f1ea]"
            : "bg-[#f8f5ef] text-[#1c1c1c]"
        }
      `}
    >
      <div
        className={`
          fixed inset-0 -z-10 transition-opacity duration-1000
          ${mounted ? "opacity-100" : "opacity-0"}
          ${
            darkMode
              ? "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%)]"
              : "bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_35%)]"
          }
        `}
      />

      <div
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
          opacity: topbarOpacity,
        }}
        className="sticky top-16 z-50 px-6 pt-6 transition-all"
      >
        <div
          className={`
              mx-auto flex h-16 max-w-5xl items-center justify-between
              rounded-2xl border px-6 backdrop-blur-xl
              ${
                darkMode
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-black/5 bg-white/70"
              }
            `}
        >
          <div
            className={`flex items-center gap-3 text-sm ${
              darkMode ? "text-white/45" : "text-black/45"
            }`}
          >
            <span>
              {darkMode
                ? "Midnight writing session"
                : "Daylight writing session"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDarkMode((p) => !p)}
              className={`
                  flex h-10 w-10 items-center justify-center rounded-full border
                  ${
                    darkMode
                      ? "border-white/10 text-white/70 hover:bg-white/5"
                      : "border-black/10 text-black/70 hover:bg-black/5"
                  }
                `}
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 pb-40 pt-28">
        <div
          style={{
            transform: `translateY(${moodY}px)`,
            opacity: moodOpacity,
          }}
          className="mb-16 space-y-5 transition-transform"
        >
          <span
            className={`
                rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em]
                ${
                  darkMode
                    ? "border-white/10 text-white/40"
                    : "border-black/10 text-black/40"
                }
              `}
          >
            {moodLabel}
          </span>

          <p
            className={`
                max-w-lg font-serif text-lg italic leading-relaxed
                ${darkMode ? "text-white/45" : "text-black/45"}
              `}
          >
            {moodText}
          </p>
        </div>

        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
          className="relative transition-all"
        >
          <textarea
            ref={titleRef}
            value={title}
            onChange={handleTitleChange}
            placeholder="Title this letter"
            rows={1}
            className={`
              w-full resize-none overflow-hidden bg-transparent
              font-serif text-6xl font-light leading-[1]
              tracking-[-0.06em] outline-none md:text-7xl
              transition-all duration-300
              ${shake ? "scale-[1.01]" : ""}
              ${
                darkMode
                  ? "text-white placeholder:text-white/15"
                  : "text-black placeholder:text-black/15"
              }
            `}
          />

          <div
            className={`
              absolute bottom-2 right-2 text-xs
              ${darkMode ? "text-white/40" : "text-black/40"}
            `}
          >
            {title.length}/{TITLE_LIMIT}
          </div>
        </div>

        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
          className="mt-6"
        >
          <textarea
            value={subtitle}
            onChange={(e) =>
              setSubtitle(e.target.value.slice(0, SUBTITLE_LIMIT))
            }
            placeholder="Add a line that hints at what is inside..."
            rows={3}
            className={`
              w-full resize-none overflow-hidden bg-transparent
              text-lg leading-8 outline-none transition-all duration-300
              md:text-xl
              ${
                darkMode
                  ? "text-white/65 placeholder:text-white/20"
                  : "text-black/60 placeholder:text-black/20"
              }
            `}
          />

          <div
            className={`
              mt-2 text-xs
              ${darkMode ? "text-white/35" : "text-black/35"}
            `}
          >
            {subtitle.length}/{SUBTITLE_LIMIT}
          </div>
        </div>

        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
          }}
          className="mt-10"
        >
          <p
            className={`mb-3 text-xs uppercase tracking-[0.2em] ${
              darkMode ? "text-white/40" : "text-black/40"
            }`}
          >
            Cover image
          </p>

          <label
            className={`
            group relative flex cursor-pointer items-center justify-center overflow-hidden
            rounded-3xl border transition-all duration-300
            aspect-[16/9]
            ${
              darkMode
                ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                : "border-black/10 bg-black/[0.02] hover:bg-black/[0.04]"
            }
    `}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />

            {thumbnailPreview ? (
              <>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-xs font-medium text-black shadow-lg">
                  Swap cover
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                    darkMode ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  +
                </div>

                <p className="font-serif text-xl">Add a cover image</p>

                <p
                  className={`mt-2 text-sm ${
                    darkMode ? "text-white/45" : "text-black/45"
                  }`}
                >
                  Wide images give the letter room to breathe.
                </p>
              </div>
            )}
          </label>
        </div>

        <div
          style={{ transform: `translateY(${dividerY}px)` }}
          className={`
              my-16 h-px bg-gradient-to-r from-transparent to-transparent
              ${darkMode ? "via-white/10" : "via-black/10"}
            `}
        />

        <div
          style={{
            transform: `translateY(${editorY}px)`,
          }}
          className={`
            prose max-w-none transition-colors duration-700
            prose-headings:font-serif prose-headings:tracking-tight
            prose-p:text-[1.12rem] prose-p:leading-9 prose-blockquote:italic
            ${
              darkMode
                ? `
                  prose-invert
                  prose-p:text-white/75
                  prose-blockquote:border-l-white/20
                  prose-blockquote:text-white/50
                `
                : `
                  prose-neutral
                  prose-p:text-black/75
                  prose-blockquote:border-l-black/20
                  prose-blockquote:text-black/50
                `
            }
          `}
        >
          <DefaultTemplate
            onContentChange={(json, html) => {
              setJsonContent(json);
              setHtmlContent(html);
            }}
            theme={darkMode ? "dark" : "light"}
          />
        </div>
      </main>

      <div
        className={`
          fixed bottom-6 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-6
          transition-all duration-700
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        <div
          className={`
            flex items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur-xl
            ${
              darkMode
                ? "border-white/10 bg-white/[0.05]"
                : "border-black/10 bg-white/80"
            }
          `}
        >
          <button
            type="button"
            onClick={() => {
              const ok = confirm("Discard this draft?");
              if (!ok) return;
              router.push("/");
            }}
            className={`
              text-sm transition-colors
              ${
                darkMode
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-500 hover:text-red-400"
              }
            `}
          >
            Toss draft
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                console.log("Saving draft...", { title, tags });
              }}
              className={`
                rounded-xl border px-4 py-2 text-sm transition-all
                ${
                  darkMode
                    ? "border-white/10 text-white/70 hover:bg-white/5"
                    : "border-black/10 text-black/70 hover:bg-black/5"
                }
              `}
            >
              Save draft
            </button>

            <button
              type="button"
              onClick={() => {
                setPublishStatus("idle");
                setPublishError("");
                setShowPublishModal(true);
              }}
              className={`
                rounded-xl px-4 py-2 text-sm font-medium transition-all
                ${
                  darkMode
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                }
              `}
            >
              Send letter
            </button>
          </div>
        </div>
      </div>

      {showPublishModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-6">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 backdrop-blur-xl ${
              darkMode
                ? "border-white/10 bg-[#111]/90 text-white"
                : "border-black/10 bg-white text-black"
            }`}
          >
            <h2 className="text-lg font-semibold">
              {publishStatus === "success"
                ? "Letter sent"
                : publishStatus === "publishing"
                ? "Sending your letter"
                : "Ready to send?"}
            </h2>

            <p className="mt-1 text-sm opacity-60">
              {publishStatus === "success"
                ? "Your letter is now in the archive."
                : publishStatus === "publishing"
                ? "Give us a second while the page settles."
                : "Add or adjust subjects before sending."}
            </p>

            {publishStatus === "publishing" && (
              <div className="mt-5">
                <div
                  className={`h-2 overflow-hidden rounded-full ${
                    darkMode ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  <div
                    className={`h-full w-1/2 animate-pulse rounded-full ${
                      darkMode ? "bg-white" : "bg-black"
                    }`}
                  />
                </div>
              </div>
            )}

            {publishStatus === "success" && (
              <div className="mt-6 flex flex-col items-center rounded-2xl py-4 text-center">
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-xl ${
                    darkMode ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  ✓
                </div>

                <p className="font-serif text-xl">Your letter is live.</p>

                <p
                  className={`mt-2 text-sm ${
                    darkMode ? "text-white/55" : "text-black/55"
                  }`}
                >
                  Readers can now find it, share it, and linger.
                </p>
              </div>
            )}

            {publishStatus !== "success" && (
              <>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      disabled={publishStatus === "publishing"}
                      onClick={() => removeTag(tag)}
                      className={`rounded-full px-3 py-1 text-xs transition disabled:opacity-40 ${
                        darkMode
                          ? "bg-white/10 hover:bg-white/20"
                          : "bg-black/10 hover:bg-black/20"
                      }`}
                    >
                      {tag} ✕
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    value={publishTagInput}
                    disabled={publishStatus === "publishing"}
                    onChange={(e) => setPublishTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPublishTag();
                      }
                    }}
                    placeholder="Add a subject..."
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none disabled:opacity-40 ${
                      darkMode
                        ? "border-white/10 bg-white/5"
                        : "border-black/10 bg-white"
                    }`}
                  />

                  <button
                    type="button"
                    disabled={publishStatus === "publishing"}
                    onClick={addPublishTag}
                    className={`rounded-lg px-3 py-2 text-sm disabled:opacity-40 ${
                      darkMode ? "bg-white text-black" : "bg-black text-white"
                    }`}
                  >
                    Drop in
                  </button>
                </div>
              </>
            )}

            <div className="mt-6 flex items-center justify-between gap-2">
              {publishStatus === "error" && (
                <p className="text-xs text-red-500">{publishError}</p>
              )}

              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  disabled={publishStatus === "publishing"}
                  onClick={() => {
                    setShowPublishModal(false);
                    setPublishStatus("idle");
                    setPublishError("");
                  }}
                  className="px-4 py-2 text-sm opacity-70 disabled:opacity-30"
                >
                  Not yet
                </button>

                {publishStatus !== "success" && (
                  <button
                    type="button"
                    disabled={publishStatus === "publishing"}
                    onClick={handlePublish}
                    className={`
                      rounded-lg px-4 py-2 text-sm transition-all
                      disabled:cursor-not-allowed disabled:opacity-70
                      ${
                        darkMode ? "bg-white text-black" : "bg-black text-white"
                      }
                    `}
                  >
                    {publishStatus === "publishing"
                      ? "Sending..."
                      : "Send letter"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {publishStatus === "success" && (
        <div className="fixed left-0 top-0 z-[1000] h-full w-full bg-[#0505055e] backdrop-blur-[3px]">
          <div className="fixed inset-0 flex items-center justify-center px-6">
            <div
              className={`
          w-full max-w-md rounded-3xl border px-8 py-8 shadow-2xl backdrop-blur-2xl
          ${
            darkMode
              ? "border-white/10 bg-[#111]/90 text-white"
              : "border-black/10 bg-white/90 text-black"
          }
        `}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`
              mb-5 flex h-16 w-16 items-center justify-center rounded-full text-2xl
              ${darkMode ? "bg-white text-black" : "bg-black text-white"}
            `}
                >
                  ✓
                </div>

                <p
                  className={`text-xs uppercase tracking-[0.25em] ${
                    darkMode ? "text-white/40" : "text-black/40"
                  }`}
                >
                  Letter sent
                </p>

                <h3 className="mt-3 font-serif text-3xl tracking-[-0.04em]">
                  Your letter is live
                </h3>

                <p
                  className={`mt-3 max-w-sm text-sm leading-7 ${
                    darkMode ? "text-white/60" : "text-black/60"
                  }`}
                >
                  Readers can discover it, share it, and return to the thread.
                </p>

                {/* LINK */}
                <a
                  href={`/posts/${publishedPost?.slug ?? publishedPost?.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`
              mt-8 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition-all
              ${
                darkMode
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-black text-white hover:bg-black/90"
              }
            `}
                >
                  Read the letter
                  <span className="text-base">↗</span>
                </a>

                {/* ACTIONS */}
                <div className="mt-8 flex w-full gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/posts/${
                          publishedPost?.slug ?? publishedPost?.id
                        }`
                      );
                    }}
                    className={`
                    flex-1 rounded-2xl border px-4 py-3 text-sm transition-all
                    ${
                      darkMode
                        ? "border-white/10 hover:bg-white/5"
                        : "border-black/10 hover:bg-black/5"
                    }
                  `}
                  >
                    Copy link
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPublishModal(false);
                      setPublishStatus("idle");
                      setPublishedPost(null);
                    }}
                    className={`
                flex-1 rounded-2xl px-4 py-3 text-sm transition-all
                ${
                  darkMode
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                }
              `}
                  >
                    Back to the desk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
