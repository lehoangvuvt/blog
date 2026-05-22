/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  List,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CollectionPost = {
  id: number;
  title: string;
  slug: string;
  subTitle?: string | null;
  thumbnailImage?: string | null;
  htmlContent?: string | null;
};

type Collection = {
  id: string;
  title: string;
  description?: string | null;
  posts: CollectionPost[];
};

type Props = {
  collection: Collection;
  currentPostId?: number;
};

export default function CollectionReader({ collection, currentPostId }: Props) {
  const router = useRouter();

  const [openList, setOpenList] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const currentPost =
    collection.posts.find((post) => post.id === currentPostId) ??
    collection.posts[0];

  const currentIndex = collection.posts.findIndex(
    (post) => post.id === currentPost.id
  );

  const prevPost = collection.posts[currentIndex - 1];
  const nextPost = collection.posts[currentIndex + 1];

  const collectionProgress = Math.round(
    ((currentIndex + 1) / collection.posts.length) * 100
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;

      if (height <= 0) {
        setReadingProgress(0);
        return;
      }

      setReadingProgress(Math.min(100, Math.round((scrollTop / height) * 100)));
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPost.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/");
      }

      if (e.key === "ArrowLeft" && prevPost) {
        router.push(`/collections/${collection.id}?post=${prevPost.id}`);
      }

      if (e.key === "ArrowRight" && nextPost) {
        router.push(`/collections/${collection.id}?post=${nextPost.id}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, collection.id, prevPost, nextPost]);

  return (
    <>
      <div className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#181818]/90 px-4 py-2 text-white shadow-lg backdrop-blur">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit reader
        </Link>

        <div className="h-4 w-px bg-white/10" />

        <div className="hidden items-center gap-2 text-xs text-white/45 sm:flex">
          <Keyboard className="h-3.5 w-3.5" />
          ESC exit · ← prev · → next
        </div>
      </div>

      <article
        key={currentPost.id}
        className="article-content mx-auto w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 px-5 py-28"
      >
        <p className="mb-4 text-sm font-medium text-white/45">
          {collection.title} · Article {currentIndex + 1} of{" "}
          {collection.posts.length} · {collectionProgress}% collection
        </p>

        <h1 className="font-serif text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-white">
          {currentPost.title}
        </h1>

        {currentPost.subTitle && (
          <p className="mt-6 text-xl leading-9 text-neutral-400">
            {currentPost.subTitle}
          </p>
        )}

        {currentPost.thumbnailImage && (
          <img
            src={currentPost.thumbnailImage}
            alt={currentPost.title}
            className="mt-10 w-full rounded-3xl object-cover shadow-2xl"
          />
        )}

        <div
          className="article-content prose prose-invert prose-neutral mt-14 max-w-none prose-headings:font-serif prose-p:text-lg prose-p:leading-8 prose-p:text-neutral-300"
          dangerouslySetInnerHTML={{ __html: currentPost.htmlContent ?? "" }}
        />

        {nextPost ? (
          <Link
            href={`/collections/${collection.id}?post=${nextPost.id}`}
            className="mt-20 flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.07]"
          >
            <div>
              <p className="text-sm font-medium text-white/45">Next article</p>

              <h3 className="mt-2 font-serif text-3xl font-semibold text-white">
                {nextPost.title}
              </h3>
            </div>

            <ChevronRight className="h-6 w-6 text-white/40" />
          </Link>
        ) : (
          <div className="mt-20 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <h3 className="mt-4 font-serif text-3xl font-semibold text-white">
              You finished this collection
            </h3>

            <p className="mt-2 text-sm text-white/45">
              You completed all {collection.posts.length} articles.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Back to home
            </Link>
          </div>
        )}
      </article>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#151515]/95 px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="absolute left-0 top-0 h-0.5 w-full bg-white/10">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <button
            type="button"
            onClick={() => setOpenList(true)}
            className="rounded-full border border-white/10 p-3 text-white transition hover:bg-white/10"
          >
            <List className="h-5 w-5" />
          </button>

          {currentPost.thumbnailImage && (
            <img
              src={currentPost.thumbnailImage}
              alt={currentPost.title}
              className="hidden h-12 w-16 rounded-xl object-cover sm:block"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-white/40">
              {collection.title} · {currentIndex + 1}/{collection.posts.length}
            </p>

            <h3 className="truncate text-sm font-semibold text-white">
              {currentPost.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {prevPost ? (
              <Link
                href={`/collections/${collection.id}?post=${prevPost.id}`}
                className="rounded-full border border-white/10 p-3 text-white transition hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : (
              <button
                disabled
                className="rounded-full border border-white/10 p-3 text-white opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {nextPost ? (
              <Link
                href={`/collections/${collection.id}?post=${nextPost.id}`}
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Next
              </Link>
            ) : (
              <Link
                href="/"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Finish
              </Link>
            )}
          </div>
        </div>
      </div>

      {openList && (
        <div className="fixed inset-0 z-[999]">
          <button
            type="button"
            onClick={() => setOpenList(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="absolute bottom-0 left-0 right-0 rounded-t-[2rem] border-t border-white/10 bg-[#151515] p-5 text-white shadow-2xl">
            <div className="mx-auto max-w-3xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Collection queue
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-semibold">
                    {collection.title}
                  </h2>

                  <p className="mt-1 text-sm text-white/40">
                    {collectionProgress}% completed
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenList(false)}
                  className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {collection.posts.map((post, index) => {
                  const active = post.id === currentPost.id;
                  const isRead = index < currentIndex;

                  return (
                    <Link
                      key={post.id}
                      href={`/collections/${collection.id}?post=${post.id}`}
                      onClick={() => setOpenList(false)}
                      className={`mb-2 flex items-center gap-3 rounded-2xl p-3 transition ${
                        active
                          ? "bg-white text-black"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          active
                            ? "bg-black text-white"
                            : isRead
                            ? "bg-white text-black"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {index + 1}
                      </span>

                      {post.thumbnailImage && (
                        <img
                          src={post.thumbnailImage}
                          alt={post.title}
                          className="h-12 w-16 rounded-lg object-cover"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold">
                          {post.title}
                        </h3>

                        <p
                          className={`text-xs ${
                            active ? "text-black/60" : "text-white/40"
                          }`}
                        >
                          {active ? "Now reading" : isRead ? "Read" : "Up next"}
                        </p>
                      </div>

                      {active && (
                        <span className="flex h-4 items-end gap-0.5">
                          <span className="h-2 w-1 animate-pulse rounded bg-black" />
                          <span className="h-4 w-1 animate-pulse rounded bg-black [animation-delay:120ms]" />
                          <span className="h-3 w-1 animate-pulse rounded bg-black [animation-delay:240ms]" />
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
