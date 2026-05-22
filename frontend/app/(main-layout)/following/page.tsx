"use client";

import { useMemo, useState } from "react";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useMe } from "@/features/auth/hooks/use-me";
import { useTags } from "@/features/tags/hooks/use-tags";
import { formatTimeAgo } from "@/shared/utils";

type Tab = "articles" | "topics";

export default function FollowingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("articles");

  const { data: me, isLoading: isLoadingMe } = useMe();

  const followedTagIds = useMemo(() => me?.followedTagIds ?? [], [me]);

  const followingIds = useMemo(
    () => me?.followings?.map((user) => user.id) ?? [],
    [me]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts(
      {
        limit: 10,
        published: true,
        sortBy: "latest",
        authorIds: followingIds,
      },
      activeTab === "articles" && followingIds.length > 0
    );

  const shouldFetchFollowedTags =
    activeTab === "topics" && followedTagIds.length > 0;

  const { data: followedTagsData, isLoading: isLoadingFollowedTags } = useTags(
    {
      ids: followedTagIds,
      limit: Math.max(followedTagIds.length, 1),
    },
    shouldFetchFollowedTags
  );

  const { data: recommendedTagsData, isLoading: isLoadingRecommendedTags } =
    useTags(
      {
        limit: 30,
      },
      activeTab === "topics"
    );

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const followedTopics =
    followedTagsData?.pages.flatMap((page) => page.data) ?? [];

  const recommendedTopics =
    recommendedTagsData?.pages
      .flatMap((page) => page.data)
      .filter((tag) => !followedTagIds.includes(tag.id)) ?? [];

  const showInitialSkeleton =
    activeTab === "articles" &&
    (isLoadingMe || isLoading) &&
    posts.length === 0;

  const hasNoFollowings = !isLoadingMe && followingIds.length === 0;

  const showTopicsSkeleton =
    activeTab === "topics" &&
    !isLoadingMe &&
    followedTagIds.length > 0 &&
    isLoadingFollowedTags;

  return (
    <MainLayout>
      <main className="min-h-screen bg-white text-black">
        <section className="mx-auto w-full max-w-2xl px-5 pt-14 md:px-6">
          <header className="border-b border-black/10 pb-6">
            <h1 className="font-serif text-5xl font-semibold tracking-tight">
              Following
            </h1>

            <p className="mt-3 text-sm leading-6 text-black/55">
              Follow writers and topics to personalize your reading.
            </p>

            <div className="mt-8 flex gap-6 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("articles")}
                className={`border-b pb-3 text-sm font-medium whitespace-nowrap transition ${
                  activeTab === "articles"
                    ? "border-black text-black"
                    : "border-transparent text-black/45 hover:text-black"
                }`}
              >
                Articles
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("topics")}
                className={`border-b pb-3 text-sm font-medium whitespace-nowrap transition ${
                  activeTab === "topics"
                    ? "border-black text-black"
                    : "border-transparent text-black/45 hover:text-black"
                }`}
              >
                Topics
              </button>
            </div>
          </header>
        </section>

        {activeTab === "articles" && (
          <PostsContainer
            hasMore={!hasNoFollowings && !!hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          >
            {showInitialSkeleton &&
              Array.from({ length: 5 }).map((_, index) => (
                <PostItem.Skeleton key={`skeleton-loading-${index + 1}`} />
              ))}

            {!showInitialSkeleton &&
              !hasNoFollowings &&
              posts.map((post) => {
                const authorName =
                  post.author?.fullName ||
                  post.author?.email ||
                  "Unknown writer";

                const authorSlug = post.author?.slug;
                const postLink = `/articles/${post.slug}`;

                return (
                  <PostItem.Container key={post.id}>
                    <PostItem.Content>
                      <PostItem.Header>
                        <PostItem.Avatar
                          src={post.author?.avatar}
                          alt={authorName}
                        />

                        {authorSlug ? (
                          <PostItem.Author link={`/${authorSlug}`}>
                            {authorName}
                          </PostItem.Author>
                        ) : (
                          <span>{authorName}</span>
                        )}

                        <PostItem.Dot />

                        <PostItem.Date>
                          {formatTimeAgo(post.postedDate)}
                        </PostItem.Date>
                      </PostItem.Header>

                      <PostItem.Title link={postLink}>
                        {post.title}
                      </PostItem.Title>

                      {post.subTitle && (
                        <PostItem.SubTitle>{post.subTitle}</PostItem.SubTitle>
                      )}

                      <PostItem.Footer />
                    </PostItem.Content>

                    <PostItem.Thumbnail
                      src={post.thumbnailImage ?? undefined}
                      alt={post.title}
                      link={postLink}
                    />
                  </PostItem.Container>
                );
              })}

            {!showInitialSkeleton && hasNoFollowings && (
              <div className="py-20 text-center">
                <h2 className="font-serif text-2xl font-semibold">
                  You are not following anyone yet
                </h2>

                <p className="mt-2 text-sm text-black/50">
                  Follow writers to see their latest articles here.
                </p>
              </div>
            )}
          </PostsContainer>
        )}

        {activeTab === "topics" && (
          <section className="mx-auto w-full max-w-2xl px-5 py-8 md:px-6">
            {isLoadingMe || showTopicsSkeleton ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`topic-skeleton-${index + 1}`}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-2">
                      <div className="h-6 w-40 animate-pulse rounded bg-black/[0.06]" />
                      <div className="h-4 w-28 animate-pulse rounded bg-black/[0.05]" />
                    </div>

                    <div className="h-10 w-24 animate-pulse rounded-full bg-black/[0.06]" />
                  </div>
                ))}
              </div>
            ) : followedTopics.length > 0 ? (
              <div className="divide-y divide-black/10">
                {followedTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="flex w-full items-center justify-between py-5 text-left"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-sans text-xl font-semibold text-black">
                        {topic.name}
                      </h3>

                      <p className="mt-1 text-sm text-black/55">
                        {topic.postsCount.toLocaleString()} articles ·{" "}
                        {topic.authorsCount.toLocaleString()} authors
                      </p>
                    </div>

                    <button
                      type="button"
                      className="ml-6 shrink-0 rounded-full border border-black px-5 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                    >
                      Following
                    </button>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-black/50">
                You are not following any topics yet.
              </p>
            )}

            <div className="mt-14 border-t border-black/10 pt-10">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-3xl font-semibold">
                  Recommended for you
                </h2>

                <button
                  type="button"
                  className="text-sm text-black/50 transition hover:text-black"
                >
                  See all
                </button>
              </div>

              {isLoadingRecommendedTags ? (
                <div className="space-y-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={`recommended-topic-skeleton-${index + 1}`}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-2">
                        <div className="h-6 w-40 animate-pulse rounded bg-black/[0.06]" />
                        <div className="h-4 w-28 animate-pulse rounded bg-black/[0.05]" />
                      </div>

                      <div className="h-10 w-24 animate-pulse rounded-full bg-black/[0.06]" />
                    </div>
                  ))}
                </div>
              ) : recommendedTopics.length > 0 ? (
                <div className="divide-y divide-black/10">
                  {recommendedTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex w-full items-center justify-between py-5 text-left"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate font-sans text-xl font-semibold text-black">
                          {topic.name}
                        </h3>

                        <p className="mt-1 text-sm text-black/55">
                          {topic.postsCount.toLocaleString()} articles ·{" "}
                          {topic.authorsCount.toLocaleString()} authors
                        </p>
                      </div>

                      <button
                        type="button"
                        className="ml-6 shrink-0 rounded-full border border-black px-5 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                      >
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-black/50">
                  No recommended topics available.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </MainLayout>
  );
}
