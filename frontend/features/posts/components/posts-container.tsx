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
    <section className="mx-auto w-full max-w-3xl px-4 md:px-0">
      <div className="divide-y divide-(--midnight-border)">{children}</div>

      <div ref={loaderRef} className="py-10 text-center">
        {isLoading && (
          <p className="text-sm text-(--midnight-muted)">
            Opening the next letters...
          </p>
        )}

        {!hasMore && (
          <p className="text-sm text-(--midnight-soft)">
            You are caught up for tonight.
          </p>
        )}
      </div>
    </section>
  );
}
