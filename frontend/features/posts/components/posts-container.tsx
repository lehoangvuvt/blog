"use client";

import { useEffect, useRef } from "react";

type PostsContainerProps = {
  children: React.ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
};

export default function PostsContainer({
  children,
  hasMore,
  isLoading,
  onLoadMore,
}: PostsContainerProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loader = loaderRef.current;

    if (!loader || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!hasMore || isLoading) return;

        onLoadMore();
      },
      {
        root: null,
        rootMargin: "240px",
        threshold: 0,
      }
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <section className="mx-auto w-full max-w-2xl px-5 md:px-6">
      <div className="divide-y divide-black/10 dark:divide-white/10">
        {children}
      </div>

      <div ref={loaderRef} className="py-10 text-center">
        {isLoading && (
          <p className="text-sm text-neutral-500 dark:text-zinc-400">
            Loading more posts...
          </p>
        )}

        {!hasMore && (
          <p className="text-sm text-neutral-400 dark:text-zinc-500">
            You’re all caught up.
          </p>
        )}
      </div>
    </section>
  );
}
