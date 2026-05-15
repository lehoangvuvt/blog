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
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <section className="mx-auto w-full max-w-3xl px-6">
      <div>{children}</div>

      <div ref={loaderRef} className="py-8 text-center">
        {isLoading && (
          <p className="text-sm text-black/50">Loading more stories...</p>
        )}

        {!hasMore && (
          <p className="text-sm text-black/40">You have reached the end.</p>
        )}
      </div>
    </section>
  );
}
