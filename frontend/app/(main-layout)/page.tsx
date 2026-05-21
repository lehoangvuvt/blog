"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useTags } from "@/features/tags/hooks/use-tags";
import type { Tag } from "@/features/tags/types";
import useEmblaCarousel from "embla-carousel-react";
import { SidebarPostSkeleton } from "@/shared/components/sidebar-post-skeleton";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import useTrendingPosts from "@/features/posts/hooks/use-trending-posts";

const allTag: Tag = {
  id: "0",
  name: "All",
  slug: "all",
};

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: tagsData } = useTags({
    limit: 20,
  });

  const topics = useMemo(() => {
    const tags =
      tagsData?.pages.flatMap((page) => page.data.map((tag) => tag)) ?? [];

    return [allTag, ...tags];
  }, [tagsData]);

  const selectedTagSlug = searchParams.get("tag") ?? allTag.slug;

  const selectedTopic = useMemo(() => {
    if (selectedTagSlug === allTag.slug) return allTag;

    return {
      id: selectedTagSlug,
      name: selectedTagSlug.replaceAll("-", " "),
      slug: selectedTagSlug,
    };
  }, [selectedTagSlug]);

  const handleSelectTopic = (topic: Tag) => {
    if (topic.slug === allTag.slug) {
      router.push(pathname, { scroll: false });
      return;
    }

    router.push(`${pathname}?tag=${topic.slug}`, { scroll: false });
  };

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
    isLoading: isLoadingPosts,
  } = usePosts(postsParams);

  const { data: trendingWeeklyPosts, isLoading: isLoadingWeeklyPosts } =
    useTrendingPosts("weekly", {
      limit: 5,
      tag: selectedTopic.slug !== allTag.slug ? selectedTopic.slug : undefined,
    });

  const { data: trendingMonthlyPosts, isLoading: isLoadingMonthlyPosts } =
    useTrendingPosts("monthly", {
      limit: 5,
      tag: selectedTopic.slug !== allTag.slug ? selectedTopic.slug : undefined,
    });

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return (
    <MainLayout>
      <main className="min-h-screen text-[#191919]">
        <div className="sticky top-16 z-10 mt-5 border-b border-black/5 bg-white/95 backdrop-blur">
          <div
            ref={emblaRef}
            className="mx-auto max-w-7xl cursor-grab overflow-hidden px-5 py-3"
          >
            <div className="flex gap-2">
              {topics.map((topic) => {
                const isActive = selectedTopic.slug === topic.slug;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm capitalize transition ${isActive
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
              isLoading={isLoadingPosts}
              onLoadMore={() => {
                if (!hasNextPage) return;
                fetchNextPage();
              }}
            >
              {isLoadingPosts &&
                Array.from({ length: 5 }).map((_, index) => (
                  <PostItem.Skeleton key={`initial-skeleton-${index + 1}`} />
                ))}

              <div className="divide-y divide-black/10">
                {posts.map((post) => {
                  const articleLink = getArticleLink(post.slug);
                  const authorName = post.author?.fullName ?? "Unknown author";
                  const authorSlug = post.author?.slug;
                  const authorLink = authorSlug ? `/${authorSlug}` : "#";

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

              {!isLoadingPosts && posts.length === 0 && (
                <div className="py-20 text-center">
                  <h2 className="text-2xl font-bold">No articles found</h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    No posts match “{selectedTopic.name}” yet.
                  </p>
                </div>
              )}

              {isFetchingNextPage &&
                Array.from({ length: 3 }).map((_, index) => (
                  <PostItem.Skeleton key={`next-page-skeleton-${index + 1}`} />
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
                  {isLoadingWeeklyPosts
                    ? Array.from({ length: 4 }).map((_, index) => (
                      <SidebarPostSkeleton
                        key={`trending-skeleton-${index + 1}`}
                      />
                    ))
                    : trendingWeeklyPosts?.map((post, index) => (
                      <a
                        key={post.postId}
                        href={getArticleLink(post.post.slug)}
                        className="group flex gap-4"
                      >
                        <span className="text-sm font-medium text-neutral-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <h4 className="text-[15px] leading-6 font-semibold transition group-hover:text-neutral-600">
                            {post.post.title}
                          </h4>

                          <p className="mt-1 text-sm text-neutral-500">
                            {post.post.author?.fullName ?? "Unknown author"}
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
                  {isLoadingMonthlyPosts
                    ? Array.from({ length: 4 }).map((_, index) => (
                      <SidebarPostSkeleton
                        key={`monthly-skeleton-${index + 1}`}
                      />
                    ))
                    : trendingMonthlyPosts?.map((post, index) => (
                      <a
                        key={post.post.id}
                        href={getArticleLink(post.post.slug)}
                        className="group flex gap-4"
                      >
                        <span className="text-sm font-medium text-neutral-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <h4 className="text-[15px] leading-6 font-semibold transition group-hover:text-neutral-600">
                            {post.post.title}
                          </h4>

                          <p className="mt-1 text-sm text-neutral-500">
                            {post.post.author?.fullName ?? "Unknown author"}
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