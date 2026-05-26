/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Search, Send, X } from "lucide-react";
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

  const [tags, setTags] = useState<string[]>(["Journal", "Ideas"]);
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

  const TITLE_LIMIT = 100;
  const SUBTITLE_LIMIT = 200;

  const canPublish = title.trim().length > 0 && htmlContent.trim().length > 0;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedTagSearch(tagInput.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [tagInput]);

  const shouldSearchTags =
    isTagInputFocused && debouncedTagSearch.length >= 2;

  const {
    data: searchedTagsData,
    isFetching: isFetchingTags,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTags(
    {
      search: debouncedTagSearch,
      limit: 8,
    },
    shouldSearchTags
  );

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

    if (!exists) {
      setTags((prev) => [...prev, nextTag]);
    }

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
      <main className="mx-auto max-w-5xl px-5 pb-40 pt-12">
        <section className="mx-auto w-full max-w-3xl">
          <p className="mb-8 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
            The Midnight Letters / Writing desk
          </p>

          <textarea
            ref={titleRef}
            value={title}
            onChange={handleTitleChange}
            placeholder="Title"
            rows={1}
            className="w-full resize-none overflow-hidden bg-transparent text-5xl font-bold leading-[1.05] tracking-[-0.06em] text-[var(--midnight-text)] outline-none placeholder:text-[var(--midnight-soft)] md:text-6xl"
          />

          <div className="mt-2 text-xs text-[var(--midnight-soft)]">
            {title.length}/{TITLE_LIMIT}
          </div>

          <textarea
            value={subtitle}
            onChange={(e) =>
              setSubtitle(e.target.value.slice(0, SUBTITLE_LIMIT))
            }
            placeholder="Subtitle"
            rows={2}
            className="mt-8 w-full resize-none bg-transparent text-xl leading-8 text-[var(--midnight-muted)] outline-none placeholder:text-[var(--midnight-soft)]"
          />

          <div className="mt-2 text-xs text-[var(--midnight-soft)]">
            {subtitle.length}/{SUBTITLE_LIMIT}
          </div>
        </section>

        <section className="mx-auto mt-10 w-full max-w-3xl border-y border-[var(--midnight-border)]/70 py-6">
          <p className="mb-3 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
            Subjects
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-3 py-1 text-sm text-[var(--midnight-muted)] transition hover:border-red-400/40 hover:text-red-300"
              >
                {tag} ×
              </button>
            ))}

            <div className="relative">
              <input
                value={tagInput}
                onFocus={() => setIsTagInputFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => setIsTagInputFocused(false), 150);
                }}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    if (suggestedTags[0]) {
                      addTag(suggestedTags[0].name);
                      return;
                    }

                    addTag();
                  }

                  if (e.key === "Escape") {
                    setIsTagInputFocused(false);
                  }
                }}
                placeholder="Add subject..."
                className="min-w-44 rounded-full border border-[var(--midnight-border)]/70 bg-transparent px-3 py-1 text-sm text-[var(--midnight-text)] outline-none placeholder:text-[var(--midnight-soft)] focus:border-[var(--midnight-accent)]/70"
              />

              {isTagInputFocused && tagInput.trim().length > 0 && (
                <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  <div className="flex items-center gap-2 border-b border-[var(--midnight-border)]/70 px-4 py-3 text-xs text-[var(--midnight-soft)]">
                    <Search className="h-3.5 w-3.5" />
                    Suggested subjects
                  </div>

                  <div className="max-h-72 overflow-y-auto p-2">
                    {tagInput.trim().length < 2 && (
                      <div className="px-3 py-3 text-sm text-[var(--midnight-muted)]">
                        Type at least 2 characters...
                      </div>
                    )}

                    {tagInput.trim().length >= 2 &&
                      isFetchingTags &&
                      suggestedTags.length === 0 && (
                        <div className="flex items-center gap-2 px-3 py-3 text-sm text-[var(--midnight-muted)]">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Searching...
                        </div>
                      )}

                    {tagInput.trim().length >= 2 &&
                      !isFetchingTags &&
                      suggestedTags.length === 0 && (
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => addTag()}
                          className="w-full rounded-xl px-3 py-3 text-left text-sm text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
                        >
                          Create “{tagInput.trim()}”
                        </button>
                      )}

                    {tagInput.trim().length >= 2 &&
                      suggestedTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => addTag(tag.name)}
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[var(--midnight-code-bg)]"
                        >
                          <div>
                            <p className="text-sm font-medium text-[var(--midnight-text)]">
                              {tag.name}
                            </p>
                            <p className="mt-0.5 text-xs text-[var(--midnight-soft)]">
                              {tag.postsCount} posts · {tag.authorsCount}{" "}
                              authors
                            </p>
                          </div>

                          <span className="shrink-0 text-xs text-[var(--midnight-soft)]">
                            Add
                          </span>
                        </button>
                      ))}

                    {tagInput.trim().length >= 2 && hasNextPage && (
                      <button
                        type="button"
                        disabled={isFetchingNextPage}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => fetchNextPage()}
                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)] disabled:opacity-50"
                      >
                        {isFetchingNextPage && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Load more
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 w-full max-w-3xl">
          <p className="mb-3 text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
            Cover image
          </p>

          <label className="group relative flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] transition hover:border-[var(--midnight-accent)]/60">
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
                  alt="Cover preview"
                  className="h-full w-full object-cover opacity-90 saturate-[0.85] transition group-hover:opacity-100"
                />

                <div className="absolute bottom-4 right-4 rounded-full bg-[var(--midnight-surface)] px-4 py-2 text-xs font-medium text-[var(--midnight-text)] shadow-xl">
                  Change cover
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--midnight-border)]/70 text-[var(--midnight-muted)]">
                  <ImagePlus className="h-5 w-5" />
                </div>

                <p className="text-sm font-medium text-[var(--midnight-text)]">
                  Add a cover image
                </p>

                <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                  Optional, but useful for sharing.
                </p>
              </div>
            )}
          </label>
        </section>

        <section className="mx-auto mt-14 w-full max-w-3xl">
          <DefaultTemplate
            onContentChange={(json, html) => {
              setJsonContent(json);
              setHtmlContent(html);
            }}
            theme="dark"
          />
        </section>
      </main>

      <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)]/90 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <p className="text-sm text-[var(--midnight-muted)]">Draft</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full px-4 py-2 text-sm text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
            >
              Cancel
            </button>

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
                      : "Review the subjects before publishing."}
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
              {publishStatus === "publishing" && (
                <div className="h-2 overflow-hidden rounded-full bg-[var(--midnight-code-bg)]">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--midnight-accent)]" />
                </div>
              )}

              {publishStatus === "success" && (
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
              )}

              {publishStatus !== "success" && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        disabled={publishStatus === "publishing"}
                        onClick={() => removeTag(tag)}
                        className="rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-3 py-1 text-xs text-[var(--midnight-muted)] disabled:opacity-40"
                      >
                        {tag} ×
                      </button>
                    ))}
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