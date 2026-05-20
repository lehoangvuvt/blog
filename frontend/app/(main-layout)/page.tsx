"use client";

import { useMemo, useState } from "react";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useTags } from "@/features/tags/hooks/use-tags";
import type { Tag } from "@/features/tags/types";
import useEmblaCarousel from "embla-carousel-react";
import { SidebarPostSkeleton } from "@/shared/components/sidebar-post-skeleton";
import { formatPostDate, getArticleLink } from "@/shared/utils";

const allTag: Tag = {
  id: "0",
  name: "All",
  slug: "all",
};

export default function Home() {
  const { data: tagsData } = useTags({
    limit: 20,
  });

  const topics = useMemo(() => {
    const tags =
      tagsData?.pages.flatMap((page) => page.data.map((tag) => tag)) ?? [];

    return [allTag, ...tags];
  }, [tagsData]);

  const [selectedTopic, setSelectedTopic] = useState(allTag);

  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
    align: "start",
  });

  const postsParams = useMemo(
    () => ({
      limit: 8,
      published: true,
      sortBy: "latest" as const,
      ...(selectedTopic.id !== allTag.id && { tag: selectedTopic.slug }),
    }),
    [selectedTopic.id, selectedTopic.slug]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = usePosts(postsParams);

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const showInitialSkeleton = isLoading && posts.length === 0;
  const isBusy = isLoading || isFetching || isFetchingNextPage;

  const trendingThisWeek = posts.slice(0, 4);
  const monthlyReads = posts.slice(4, 7);

  return (
    <MainLayout>
      <main className="min-h-screen text-[#191919]">
        <div className="sticky top-16 z-10 mt-5 border-b border-black/5 bg-white/95 backdrop-blur">
          <div
            ref={emblaRef}
            className="mx-auto max-w-7xl overflow-hidden px-5 py-3 cursor-grab"
          >
            <div className="flex gap-2">
              {topics.map((topic) => {
                const isActive = selectedTopic.slug === topic.slug;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm capitalize transition cursor-pointer ${
                      isActive
                        ? "bg-black text-white"
                        : "text-neutral-600 hover:bg-black/5 hover:text-black"
                    }`}
                  >
                    {topic.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-10 lg:grid-cols-[minmax(0,720px)_280px]">
          <section>
            <PostsContainer
              hasMore={Boolean(hasNextPage)}
              isLoading={isBusy}
              onLoadMore={() => {
                if (isBusy || !hasNextPage) return;
                fetchNextPage();
              }}
            >
              {showInitialSkeleton &&
                Array.from({ length: 5 }).map((_, index) => (
                  <PostItem.Skeleton key={`initial-skeleton-${index}`} />
                ))}

              <div className="divide-y divide-black/10">
                {posts.map((post) => {
                  const articleLink = getArticleLink(post.slug);
                  const authorName = post.author?.fullName ?? "Unknown author";
                  const authorSlug = post.author?.slug;
                  const authorLink = authorSlug ? `/users/${authorSlug}` : "#";

                  return (
                    <PostItem.Container key={post.id}>
                      <PostItem.Content>
                        <PostItem.Header>
                          <PostItem.Avatar
                            src={post.author?.avatar ?? ""}
                            alt={authorName}
                          />

                          <PostItem.Author link={authorLink}>
                            {authorName}
                          </PostItem.Author>

                          <PostItem.Dot />

                          <PostItem.Date>
                            {formatPostDate(post.postedDate)}
                          </PostItem.Date>
                        </PostItem.Header>

                        <PostItem.Title link={articleLink}>
                          {post.title}
                        </PostItem.Title>

                        {post.subTitle && (
                          <PostItem.SubTitle>{post.subTitle}</PostItem.SubTitle>
                        )}

                        <PostItem.Footer>
                          <span>5 min read</span>
                        </PostItem.Footer>
                      </PostItem.Content>

                      <PostItem.Thumbnail
                        src={post.thumbnailImage ?? ""}
                        alt={post.title}
                        link={articleLink}
                      />
                    </PostItem.Container>
                  );
                })}
              </div>

              {!showInitialSkeleton && posts.length === 0 && (
                <div className="py-20 text-center">
                  <h2 className="text-2xl font-bold">No articles found</h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    No posts match “{selectedTopic.name}” yet.
                  </p>
                </div>
              )}

              {isFetchingNextPage &&
                Array.from({ length: 3 }).map((_, index) => (
                  <PostItem.Skeleton key={`next-page-skeleton-${index}`} />
                ))}
            </PostsContainer>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-14">
              <section>
                <h3 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
                  Trending this week
                </h3>

                <div className="mt-6 space-y-7">
                  {showInitialSkeleton
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <SidebarPostSkeleton
                          key={`trending-skeleton-${index}`}
                        />
                      ))
                    : trendingThisWeek.map((post, index) => (
                        <a
                          key={post.id}
                          href={getArticleLink(post.slug)}
                          className="group flex gap-4"
                        >
                          <span className="text-sm font-medium text-neutral-300">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div>
                            <h4 className="text-[15px] leading-6 font-semibold transition group-hover:text-neutral-600">
                              {post.title}
                            </h4>

                            <p className="mt-1 text-sm text-neutral-500">
                              {post.author?.fullName ?? "Unknown author"}
                            </p>
                          </div>
                        </a>
                      ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
                  Monthly reads
                </h3>

                <div className="mt-6 space-y-7">
                  {showInitialSkeleton
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <SidebarPostSkeleton
                          key={`trending-skeleton-${index}`}
                        />
                      ))
                    : monthlyReads.map((post, index) => (
                        <a
                          key={post.id}
                          href={getArticleLink(post.slug)}
                          className="group flex gap-4"
                        >
                          <span className="text-sm font-medium text-neutral-300">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div>
                            <h4 className="text-[15px] leading-6 font-semibold transition group-hover:text-neutral-600">
                              {post.title}
                            </h4>

                            <p className="mt-1 text-sm text-neutral-500">
                              {post.author?.fullName ?? "Unknown author"}
                            </p>
                          </div>
                        </a>
                      ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </MainLayout>
  );
}
