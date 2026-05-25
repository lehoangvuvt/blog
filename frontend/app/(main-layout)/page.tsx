"use client";

import { useMemo, useState } from "react";
import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useTags } from "@/features/tags/hooks/use-tags";
import type { Tag } from "@/features/tags/types";
import useEmblaCarousel from "embla-carousel-react";
import { SidebarPostSkeleton } from "@/shared/components/sidebar-post-skeleton";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import useTrendingPosts from "@/features/posts/hooks/use-trending-posts";
import { useMe } from "@/features/auth/hooks/use-me";

const allTag: Tag = {
  id: "0",
  name: "All",
  slug: "all",
  postsCount: 0,
  authorsCount: 0,
};

export default function Home() {
  const { data: me } = useMe();

  const followedTagIds = useMemo(
    () => (me?.followedTags ? me.followedTags.map((tag) => tag.id) : []),
    [me]
  );

  const shouldFetchFollowedTags = followedTagIds.length > 0;

  const { data: followedTagsData, isLoading: isLoadingFollowedTags } = useTags(
    {
      ids: followedTagIds,
      limit: Math.max(followedTagIds.length, 1),
    },
    shouldFetchFollowedTags
  );

  const followedTopics = useMemo(() => {
    const topics = followedTagsData?.pages.flatMap((page) => page.data) ?? [];

    return [allTag, ...topics];
  }, [followedTagsData]);

  const [selectedTopic, setSelectedTopic] = useState<Tag>(allTag);

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
      ...(selectedTopic.id !== allTag.id && {
        tag: selectedTopic.slug,
      }),
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
    <main className="min-h-screen text-[var(--midnight-text)]">
      <div className="mx-auto max-w-7xl px-5 pt-10 md:px-6 md:pt-14">
        <section className="max-w-3xl pt-4 md:pt-6">
          <p className="text-[11px] tracking-[0.16em] text-[var(--midnight-soft)]">
            THE MIDNIGHT LETTERS
          </p>

          <h1
            className="
              mt-4
              text-4xl font-bold
              leading-[0.98]
              tracking-[-0.06em]
              text-[var(--midnight-text)]
              md:text-6xl
            "
          >
            Thoughts that arrive after midnight
          </h1>

          <p
            className="
              mt-5
              max-w-2xl
              text-[15px]
              leading-7
              text-[var(--midnight-muted)]
              md:text-[17px]
            "
          >
            Essays, passing thoughts, quiet observations, and conversations from
            people still awake.
          </p>

          <div className="mt-8 h-px w-12 bg-[var(--midnight-border)]" />
        </section>
      </div>

      <div className="sticky top-16 z-10 mt-6 border-y border-[var(--midnight-border)]/70 bg-[var(--midnight-bg)]/90 backdrop-blur-xl">
        <div
          ref={emblaRef}
          className="mx-auto max-w-7xl cursor-grab overflow-hidden px-5 py-3 md:px-6"
        >
          <div className="flex gap-2">
            {!isLoadingFollowedTags &&
              followedTopics.map((topic) => {
                const isActive = selectedTopic.slug === topic.slug;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                      isActive
                        ? "border-[var(--midnight-border-strong)] bg-[var(--midnight-surface-soft)] text-[var(--midnight-text)]"
                        : "border-transparent text-[var(--midnight-muted)] hover:border-[var(--midnight-border)] hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
                    }`}
                  >
                    {topic.name}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-10 md:px-6 lg:grid-cols-[minmax(0,720px)_280px]">
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

            <div className="divide-y divide-[var(--midnight-border)]/70">
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
                <h2 className="text-2xl font-bold tracking-[-0.03em] text-[var(--midnight-text)]">
                  It&apos;s quiet here tonight
                </h2>

                <p className="mt-2 text-sm text-[var(--midnight-muted)]">
                  No thoughts have drifted into this corner yet.
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
                {isLoadingWeeklyPosts
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <SidebarPostSkeleton
                        key={`weekly-trending-skeleton-${index + 1}`}
                      />
                    ))
                  : trendingWeeklyPosts?.map((post, index) => (
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
                    ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold tracking-[0.08em] text-[var(--midnight-soft)]">
                Kept people awake this month
              </h3>

              <div className="mt-6 space-y-7">
                {isLoadingMonthlyPosts
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <SidebarPostSkeleton
                        key={`monthly-trending-skeleton-${index + 1}`}
                      />
                    ))
                  : trendingMonthlyPosts?.map((post, index) => (
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
                    ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
