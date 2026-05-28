"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { SidebarPostSkeleton } from "@/shared/components/sidebar-post-skeleton";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import useTrendingPosts from "@/features/posts/hooks/use-trending-posts";
import { useMe } from "@/features/auth/hooks/use-me";
import useMePreferredPosts from "@/features/posts/hooks/use-me-preferred-posts";
import { usePosts } from "@/features/posts/hooks/use-posts";

type FeedTab = "for-you" | "latest";

export default function Home() {
  const { data: me } = useMe();
  const [activeTab, setActiveTab] = useState<FeedTab>("latest");

  const {
    data: preferredPostsData,
    fetchNextPage: fetchNextPreferredPage,
    hasNextPage: hasNextPreferredPage,
    isFetchingNextPage: isFetchingNextPreferredPage,
    isLoading: isLoadingPreferredPosts,
  } = useMePreferredPosts(8, Boolean(me));

  const preferredPosts = useMemo(() => {
    return (
      preferredPostsData?.pages
        .flatMap((page) => page?.data ?? [])
        .filter(Boolean) ?? []
    );
  }, [preferredPostsData]);

  const {
    data: latestPostsData,
    fetchNextPage: fetchNextLatestPage,
    hasNextPage: hasNextLatestPage,
    isFetchingNextPage: isFetchingNextLatestPage,
    isLoading: isLoadingLatestPosts,
  } = usePosts({
    limit: 8,
    published: true,
    sortBy: "latest",
  });

  const latestPosts = useMemo(() => {
    return (
      latestPostsData?.pages
        .flatMap((page) => page?.data ?? [])
        .filter(Boolean) ?? []
    );
  }, [latestPostsData]);

  const posts = activeTab === "for-you" ? preferredPosts : latestPosts;

  const isLoading =
    activeTab === "for-you" ? isLoadingPreferredPosts : isLoadingLatestPosts;

  const hasMore =
    activeTab === "for-you" ? hasNextPreferredPage : hasNextLatestPage;

  const isFetchingNextPage =
    activeTab === "for-you"
      ? isFetchingNextPreferredPage
      : isFetchingNextLatestPage;

  const handleLoadMore = () => {
    if (activeTab === "for-you") {
      if (!hasNextPreferredPage) return;
      fetchNextPreferredPage();
      return;
    }

    if (!hasNextLatestPage) return;
    fetchNextLatestPage();
  };

  const { data: trendingWeeklyPosts, isLoading: isLoadingWeeklyPosts } =
    useTrendingPosts("weekly", {
      limit: 5,
    });

  const { data: trendingMonthlyPosts, isLoading: isLoadingMonthlyPosts } =
    useTrendingPosts("monthly", {
      limit: 5,
    });

  const tabs: FeedTab[] = me ? ["latest", "for-you"] : ["latest"];

  return (
    <main className="min-h-screen text-[var(--midnight-text)]">
      <div className="mx-auto max-w-7xl px-5 pt-10 md:px-6 md:pt-14">
        <section className="max-w-3xl pt-4 md:pt-6">
          <p className="text-[11px] tracking-[0.16em] text-[var(--midnight-soft)]">
            THE MIDNIGHT LETTERS
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-[0.98] tracking-[-0.06em] text-[var(--midnight-text)] md:text-6xl">
            Thoughts that arrive after midnight
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[var(--midnight-muted)] md:text-[17px]">
            Essays, passing thoughts, quiet observations, and conversations from
            people still awake.
          </p>

          <div className="mt-8 h-px w-12 bg-[var(--midnight-border)]" />
        </section>
      </div>

      <div className="sticky top-16 z-10 mt-6 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <div className="flex items-center gap-7">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative shrink-0 py-4 text-sm font-medium transition ${
                    isActive
                      ? "text-[var(--midnight-text)]"
                      : "text-[var(--midnight-muted)] hover:text-[var(--midnight-text)]"
                  }`}
                >
                  {tab === "for-you" ? "For you" : "Latest"}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--midnight-accent)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-10 md:px-6 lg:grid-cols-[minmax(0,720px)_280px]">
        <section>
          <PostsContainer
            hasMore={Boolean(hasMore)}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
          >
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <PostItem.Skeleton key={`initial-skeleton-${index + 1}`} />
              ))}

            <div className="divide-y divide-[var(--midnight-border)]/70">
              {!isLoading &&
                posts.map((post) => {
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
                          {post.tags?.map((tag) => (
                            <Link
                              className="cursor-pointer transition-all hover:underline hover:brightness-200"
                              href={`/subjects/${tag.slug}`}
                              key={tag.slug}
                            >
                              #{tag.name}
                            </Link>
                          ))}
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

            {!isLoading && posts.length === 0 && activeTab === "for-you" && (
              <div className="py-20 text-center">
                <h2 className="text-2xl font-bold tracking-[-0.03em] text-[var(--midnight-text)]">
                  Your feed is empty
                </h2>

                <p className="mt-3 text-sm leading-6 text-[var(--midnight-muted)]">
                  {`Follow a few topics to personalize your feed and discover stories you'll enjoy.`}
                </p>

                <Link
                  href="/following/subjects"
                  className="mt-6 inline-flex rounded-full border border-[var(--midnight-border)] px-5 py-2 text-sm transition hover:border-[var(--midnight-border-strong)] hover:text-[var(--midnight-text)]"
                >
                  Explore topics
                </Link>
              </div>
            )}

            {!isLoading && posts.length === 0 && activeTab === "latest" && (
              <div className="py-20 text-center">
                <h2 className="text-2xl font-bold tracking-[-0.03em] text-[var(--midnight-text)]">
                  No posts yet
                </h2>

                <p className="mt-3 text-sm leading-6 text-[var(--midnight-muted)]">
                  New thoughts will appear here when they are published.
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
              <h3 className="text-sm font-semibold tracking-[0.08em] text-[var(--midnight-soft)]">
                Recently passed around
              </h3>

              <div className="mt-6 space-y-7">
                {isLoadingWeeklyPosts ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <SidebarPostSkeleton
                      key={`weekly-trending-skeleton-${index + 1}`}
                    />
                  ))
                ) : trendingWeeklyPosts && trendingWeeklyPosts.length > 0 ? (
                  trendingWeeklyPosts.map((post, index) => (
                    <a
                      key={post.postId}
                      href={getArticleLink(post.post.slug)}
                      className="group flex gap-4"
                    >
                      <span className="text-sm font-medium text-[var(--midnight-accent)]/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h4 className="text-[15px] font-semibold leading-6 text-[var(--midnight-text)] transition group-hover:text-[var(--midnight-accent-hover)]">
                          {post.post.title}
                        </h4>

                        <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                          {post.post.author?.fullName ?? "Unknown author"}
                        </p>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-5 text-sm leading-6 text-[var(--midnight-muted)]">
                    Nothing has been passed around this week yet.
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold tracking-[0.08em] text-[var(--midnight-soft)]">
                Kept people awake this month
              </h3>

              <div className="mt-6 space-y-7">
                {isLoadingMonthlyPosts ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <SidebarPostSkeleton
                      key={`monthly-trending-skeleton-${index + 1}`}
                    />
                  ))
                ) : trendingMonthlyPosts && trendingMonthlyPosts.length > 0 ? (
                  trendingMonthlyPosts.map((post, index) => (
                    <a
                      key={post.post.id}
                      href={getArticleLink(post.post.slug)}
                      className="group flex gap-4"
                    >
                      <span className="text-sm font-medium text-[var(--midnight-accent)]/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h4 className="text-[15px] font-semibold leading-6 text-[var(--midnight-text)] transition group-hover:text-[var(--midnight-accent-hover)]">
                          {post.post.title}
                        </h4>

                        <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                          {post.post.author?.fullName ?? "Unknown author"}
                        </p>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-5 text-sm leading-6 text-[var(--midnight-muted)]">
                    Nothing has kept people awake this month yet.
                  </p>
                )}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
