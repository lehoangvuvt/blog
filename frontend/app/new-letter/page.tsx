/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  Circle,
  ImagePlus,
  Loader2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { DefaultTemplate } from "@/features/editor/components/default-template";
import { createPost } from "@/features/posts/api/create-post";
import {
  getUploadPresignedUrl,
  uploadFile,
} from "@/features/files/api/upload.api";
import { useMe } from "@/features/auth/hooks/use-me";
import Loading from "@/shared/components/loading";
import ForbiddenPage from "../forbbiden";
import { useTags } from "@/features/tags/hooks/use-tags";

export default function NewLetterPage() {
  const router = useRouter();
  const { data: me, isLoading: isLoadingMe } = useMe();

  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [debouncedTagSearch, setDebouncedTagSearch] = useState("");
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "publishing" | "success" | "error"
  >("idle");
  const [publishError, setPublishError] = useState("");
  const [publishedPost, setPublishedPost] = useState<{
    id?: string;
    slug?: string;
  } | null>(null);

  const [focusedSection, setFocusedSection] = useState<
    "title" | "subtitle" | "topics" | "cover" | "content" | null
  >(null);

  const TITLE_LIMIT = 100;
  const SUBTITLE_LIMIT = 200;

  const writingTip = useMemo(() => {
    switch (focusedSection) {
      case "title":
        return {
          label: "Title",
          title: "Shape your headline",
          description:
            "Write a clear title that gives readers a reason to begin.",
        };
      case "subtitle":
        return {
          label: "Subtitle",
          title: "Set the mood",
          description:
            "Use the subtitle to gently preview what this letter is about.",
        };
      case "topics":
        return {
          label: "Topics",
          title: "Help readers find this",
          description:
            "Add subjects so your letter can reach readers who care about them.",
        };
      case "cover":
        return {
          label: "Cover",
          title: "Give it a visual feeling",
          description:
            "A cover image is optional, but it helps your letter feel complete.",
        };
      case "content":
        return {
          label: "Editor",
          title: "Write the letter",
          description: "Type / to insert blocks. Highlight text to format it.",
        };
      default:
        return {
          label: "Guide",
          title: "Start your letter",
          description:
            "Begin with a title, write your story, add topics, then publish.",
        };
    }
  }, [focusedSection]);

  const hasRealContent = (html: string) => {
    if (!html.trim()) return false;

    const plainText = html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();

    return plainText.length > 0;
  };

  const hasContent = hasRealContent(htmlContent);

  const canPublish = title.trim().length > 0 && hasContent && tags.length > 0;

  const tutorialSteps = useMemo(
    () => [
      { label: "Title", done: title.trim().length > 0 },
      { label: "Subtitle", done: subtitle.trim().length > 0 },
      { label: "Topics", done: tags.length > 0 },
      { label: "Content", done: hasContent },
    ],
    [title, subtitle, tags.length, hasContent]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedTagSearch(tagInput.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [tagInput]);

  const shouldSearchTags = isTagInputFocused && debouncedTagSearch.length >= 2;

  const {
    data: searchedTagsData,
    isFetching: isFetchingTags,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTags({ search: debouncedTagSearch, limit: 8 }, shouldSearchTags);

  const suggestedTags = useMemo(() => {
    const selected = new Set(tags.map((tag) => tag.toLowerCase()));

    return (
      searchedTagsData?.pages
        .flatMap((page) => page.data)
        .filter((tag) => !selected.has(tag.name.toLowerCase())) ?? []
    );
  }, [searchedTagsData, tags]);

  const addTag = (value?: string) => {
    const nextTag = (value ?? tagInput).trim();
    if (!nextTag) return;

    const exists = tags.some(
      (tag) => tag.toLowerCase() === nextTag.toLowerCase()
    );

    if (!exists) setTags((prev) => [...prev, nextTag]);

    setTagInput("");
    setDebouncedTagSearch("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, TITLE_LIMIT);
    setTitle(value);

    requestAnimationFrame(() => {
      const el = titleRef.current;
      if (!el) return;

      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
    });
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { url, publicUrl } = await getUploadPresignedUrl(
      file.name,
      file.type
    );

    await uploadFile(file, url);
    setThumbnailPreview(publicUrl);
  };

  const handlePublish = async () => {
    if (!canPublish) return;

    try {
      setPublishStatus("publishing");
      setPublishError("");

      const response = await createPost({
        title: title.trim(),
        subTitle: subtitle.trim(),
        published: true,
        jsonContent,
        htmlContent,
        tags,
        ...(thumbnailPreview && { thumbnailImage: thumbnailPreview }),
      });

      setPublishedPost(response.data ?? null);
      setPublishStatus("success");
    } catch {
      setPublishStatus("error");
      setPublishError("Could not publish this article. Try again.");
    }
  };

  if (isLoadingMe) return <Loading />;
  if (!me) return <ForbiddenPage />;

  return (
    <div className="min-h-screen bg-[var(--midnight-bg)] text-[var(--midnight-text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--midnight-border)]/60 bg-[var(--midnight-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm font-medium text-[var(--midnight-muted)] transition hover:text-[var(--midnight-text)]"
          >
            The Midnight Letters
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[var(--midnight-soft)] sm:inline">
              Draft
            </span>

            <button
              type="button"
              disabled={!canPublish}
              onClick={() => {
                setPublishStatus("idle");
                setPublishError("");
                setShowPublishModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--midnight-accent)] px-4 py-2 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-[1060px] px-5 md:px-6">
        <aside className="absolute left-[calc(50%+420px)] top-12 hidden w-64 xl:block">
          <div className="sticky top-24 border-l-1 border-[var(--midnight-border)]/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl">
            <h2 className="mt-2 font-serif text-lg tracking-[-0.03em] text-[var(--midnight-text)]">
              {writingTip.title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--midnight-muted)]">
              {writingTip.description}
            </p>

            <div className="mt-4 space-y-2 border-t border-[var(--midnight-border)]/60 pt-4">
              {tutorialSteps.map((step) => {
                const Icon = step.done ? CheckCircle2 : Circle;

                return (
                  <div
                    key={step.label}
                    className="flex items-center gap-2 text-xs text-[var(--midnight-muted)]"
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        step.done
                          ? "text-emerald-300"
                          : "text-[var(--midnight-soft)]"
                      }`}
                    />
                    {step.label}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="mx-auto w-full max-w-[740px] pb-32 pt-12 md:pt-16">
          <textarea
            ref={titleRef}
            value={title}
            onFocus={() => setFocusedSection("title")}
            onChange={handleTitleChange}
            placeholder="Title"
            rows={2}
            className="w-full resize-none overflow-hidden bg-transparent font-serif text-5xl leading-tight tracking-[-0.04em] text-[var(--midnight-text)] outline-none placeholder:text-[var(--midnight-soft)] md:text-6xl"
          />

          <div
            className={`mt-2 flex justify-end text-xs ${
              title.length >= TITLE_LIMIT
                ? "text-red-300"
                : "text-[var(--midnight-soft)]"
            }`}
          >
            {title.length}/{TITLE_LIMIT}
          </div>

          <textarea
            value={subtitle}
            onFocus={() => setFocusedSection("subtitle")}
            onChange={(e) =>
              setSubtitle(e.target.value.slice(0, SUBTITLE_LIMIT))
            }
            placeholder="Tell your story..."
            rows={2}
            className="mt-5 w-full resize-none bg-transparent font-serif text-xl leading-8 text-[var(--midnight-muted)] outline-none placeholder:text-[var(--midnight-soft)] md:text-2xl"
          />

          <div
            className={`mt-2 flex justify-end text-xs ${
              subtitle.length >= SUBTITLE_LIMIT
                ? "text-red-300"
                : "text-[var(--midnight-soft)]"
            }`}
          >
            {subtitle.length}/{SUBTITLE_LIMIT}
          </div>

          <div
            onFocusCapture={() => setFocusedSection("topics")}
            onMouseEnter={() => setFocusedSection("topics")}
            className="mt-8 flex flex-wrap items-center gap-2 border-y border-[var(--midnight-border)]/60 py-4"
          >
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full border border-[var(--midnight-border)] px-3 py-1 text-sm text-[var(--midnight-muted)] transition hover:border-red-400/40 hover:text-red-300"
              >
                {tag} ×
              </button>
            ))}

            <div className="relative">
              <input
                value={tagInput}
                onFocus={() => {
                  setFocusedSection("topics");
                  setIsTagInputFocused(true);
                }}
                onBlur={() => {
                  window.setTimeout(() => setIsTagInputFocused(false), 150);
                }}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a topic"
                className="min-w-36 bg-transparent px-1 py-1 text-sm text-[var(--midnight-text)] outline-none placeholder:text-[var(--midnight-soft)]"
              />

              {isTagInputFocused && shouldSearchTags && (
                <div className="absolute left-0 top-full z-30 mt-3 w-72 overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
                  <div className="border-b border-[var(--midnight-border)]/60 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--midnight-soft)]">
                    Suggested topics
                  </div>

                  <div className="max-h-72 overflow-y-auto p-2">
                    {isFetchingTags && suggestedTags.length === 0 ? (
                      <div className="flex items-center gap-2 px-3 py-3 text-sm text-[var(--midnight-muted)]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching...
                      </div>
                    ) : suggestedTags.length > 0 ? (
                      suggestedTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => addTag(tag.name)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
                        >
                          <span>{tag.name}</span>
                          <span className="text-xs text-[var(--midnight-soft)]">
                            Add
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-[var(--midnight-muted)]">
                        No matching topics.
                      </div>
                    )}

                    {hasNextPage && (
                      <button
                        type="button"
                        disabled={isFetchingNextPage}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => fetchNextPage()}
                        className="mt-1 w-full rounded-xl px-3 py-2 text-sm text-[var(--midnight-accent)] transition hover:bg-[var(--midnight-code-bg)] disabled:opacity-50"
                      >
                        {isFetchingNextPage ? "Loading..." : "Load more"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <label
            onMouseEnter={() => setFocusedSection("cover")}
            className="group mt-8 flex cursor-pointer items-center gap-3 text-sm text-[var(--midnight-muted)] transition hover:text-[var(--midnight-text)]"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--midnight-border)] transition group-hover:border-[var(--midnight-accent)]/50 group-hover:text-[var(--midnight-accent)]">
              <ImagePlus className="h-4 w-4" />
            </span>

            {thumbnailPreview ? "Change cover image" : "Add cover image"}
          </label>

          {thumbnailPreview && (
            <div className="mt-6 overflow-hidden rounded-sm">
              <img
                src={thumbnailPreview}
                alt="Cover preview"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          <section
            className="mt-10"
            onFocusCapture={() => setFocusedSection("content")}
            onMouseEnter={() => setFocusedSection("content")}
          >
            <DefaultTemplate
              onContentChange={(json, html) => {
                setJsonContent(json);
                setHtmlContent(html);
              }}
              theme="dark"
            />
          </section>
        </main>
      </div>

      {showPublishModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-5 backdrop-blur-[3px]">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
            <div className="flex items-start justify-between border-b border-[var(--midnight-border)]/70 px-6 py-5">
              <div>
                <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                  Publish
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                  {publishStatus === "success"
                    ? "Published"
                    : publishStatus === "publishing"
                    ? "Publishing"
                    : "Ready to publish?"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--midnight-muted)]">
                  {publishStatus === "success"
                    ? "Your article is now publicly available."
                    : publishStatus === "publishing"
                    ? "Sending your article to the archive."
                    : "Review your topics before publishing."}
                </p>
              </div>

              <button
                type="button"
                disabled={publishStatus === "publishing"}
                onClick={() => setShowPublishModal(false)}
                className="rounded-full p-2 text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)] disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5">
              {publishStatus === "success" ? (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--midnight-accent)] text-[var(--midnight-on-accent)]">
                    <Check className="h-6 w-6" />
                  </div>

                  <a
                    href={`/letters/${
                      publishedPost?.slug ?? publishedPost?.id
                    }`}
                    className="mt-6 inline-flex rounded-full bg-[var(--midnight-accent)] px-5 py-2 text-sm font-medium text-[var(--midnight-on-accent)]"
                  >
                    Read article
                  </a>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          disabled={publishStatus === "publishing"}
                          onClick={() => removeTag(tag)}
                          className="rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-3 py-1 text-xs text-[var(--midnight-muted)] disabled:opacity-40"
                        >
                          {tag} ×
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--midnight-muted)]">
                        No topics added.
                      </p>
                    )}
                  </div>

                  {publishStatus === "error" && (
                    <p className="mt-4 text-sm text-red-300">{publishError}</p>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      disabled={publishStatus === "publishing"}
                      onClick={() => setShowPublishModal(false)}
                      className="rounded-full px-4 py-2 text-sm text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)] disabled:opacity-40"
                    >
                      Not yet
                    </button>

                    <button
                      type="button"
                      disabled={publishStatus === "publishing"}
                      onClick={handlePublish}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--midnight-accent)] px-4 py-2 text-sm font-medium text-[var(--midnight-on-accent)] transition hover:opacity-90 disabled:opacity-40"
                    >
                      {publishStatus === "publishing" && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {publishStatus === "publishing"
                        ? "Publishing"
                        : "Publish"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
