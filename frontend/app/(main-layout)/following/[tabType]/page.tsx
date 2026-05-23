"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useMe } from "@/features/auth/hooks/use-me";
import { useTags } from "@/features/tags/hooks/use-tags";
import { formatTimeAgo } from "@/shared/utils";
import useFollowTag from "@/features/tags/hooks/use-follow-tag";
import useUnfollowTag from "@/features/tags/hooks/use-unfollow-tag";
import NotificationPopover from "@/shared/components/notification-popover";
import useNotification from "@/hooks/use-notification";
import { Tag } from "@/features/tags/types";

type Tab = "writters" | "subjects";

export default function FollowingPage() {
  const { close, open, notifications } = useNotification();
  const router = useRouter();
  const params = useParams();

  const [activeTab, setActiveTab] = useState<Tab>(
    params.tabType === "writters" ? "writters" : "subjects"
  );

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
      activeTab === "writters" && followingIds.length > 0
    );

  const shouldFetchFollowedTags =
    activeTab === "subjects" && followedTagIds.length > 0;

  const { data: followedTagsData, isLoading: isLoadingFollowedTags } = useTags(
    shouldFetchFollowedTags
      ? {
          ids: followedTagIds,
          limit: followedTagIds.length,
        }
      : undefined,
    shouldFetchFollowedTags
  );

  const followedTopics = shouldFetchFollowedTags
    ? followedTagsData?.pages.flatMap((page) => page.data) ?? []
    : [];

  const { data: recommendedTagsData, isLoading: isLoadingRecommendedTags } =
    useTags(
      {
        limit: 30,
      },
      activeTab === "subjects"
    );

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const recommendedTopics =
    recommendedTagsData?.pages
      .flatMap((page) => page.data)
      .filter((tag) => !followedTagIds.includes(tag.id)) ?? [];

  const showInitialSkeleton =
    activeTab === "writters" &&
    (isLoadingMe || isLoading) &&
    posts.length === 0;

  const hasNoFollowings = !isLoadingMe && followingIds.length === 0;

  const showTopicsSkeleton =
    activeTab === "subjects" &&
    !isLoadingMe &&
    followedTagIds.length > 0 &&
    isLoadingFollowedTags;

  const { mutate: followTag } = useFollowTag();
  const { mutate: unfollowTag } = useUnfollowTag();

  useEffect(() => {
    router.replace(`/following/${activeTab}`);
  }, [activeTab, router]);

  return (
    <MainLayout>
      <NotificationPopover onClose={close} notifications={notifications} />

      <main className="min-h-screen bg-[var(--midnight-bg)] text-[var(--midnight-text)]">
        <section className="mx-auto w-full max-w-3xl px-5 pt-12 md:px-6">
          <header className="border-b border-[var(--midnight-border)]/70 pb-7">
            <h1 className="mt-4 text-5xl font-bold tracking-[-0.06em] text-[var(--midnight-text)]">
              Following
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[var(--midnight-muted)]">
              Letters from writers and subjects you keep returning to.
            </p>

            <div className="mt-8 flex gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("writters")}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeTab === "writters"
                    ? "border-[var(--midnight-accent)]/70 bg-[var(--midnight-code-bg)] text-[var(--midnight-text)]"
                    : "border-transparent text-[var(--midnight-muted)] hover:border-[var(--midnight-border)]/70 hover:text-[var(--midnight-text)]"
                }`}
              >
                Writers
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("subjects")}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeTab === "subjects"
                    ? "border-[var(--midnight-accent)]/70 bg-[var(--midnight-code-bg)] text-[var(--midnight-text)]"
                    : "border-transparent text-[var(--midnight-muted)] hover:border-[var(--midnight-border)]/70 hover:text-[var(--midnight-text)]"
                }`}
              >
                Subjects
              </button>
            </div>
          </header>
        </section>

        {activeTab === "writters" && (
          <section className="mx-auto w-full max-w-3xl px-5 md:px-6">
            <PostsContainer
              hasMore={!hasNoFollowings && Boolean(hasNextPage)}
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
                <div className="pt-12 pb-16">
                  <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                    No writers followed yet.
                  </h2>

                  <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
                    Follow a few voices and their newest letters will appear
                    here.
                  </p>
                </div>
              )}
            </PostsContainer>
          </section>
        )}

        {activeTab === "subjects" && (
          <section className="mx-auto w-full max-w-3xl px-5 py-8 md:px-6">
            {isLoadingMe || showTopicsSkeleton ? (
              <TopicSkeleton />
            ) : followedTopics.length > 0 ? (
              <TopicList
                topics={followedTopics}
                actionLabel="Following"
                hoverLabel="Unfollow"
                onAction={(topic) =>
                  unfollowTag(topic, {
                    onSuccess: () =>
                      open("Subject unfollowed successfully", "success"),
                    onError: () => open("Failed to unfollow subject", "error"),
                  })
                }
                active
              />
            ) : (
              <div className="pt-4 pb-10">
                <p className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                  No subjects followed yet.
                </p>

                <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
                  Follow subjects to shape the letters you see.
                </p>
              </div>
            )}

            <div className="mt-12 border-t border-[var(--midnight-border)]/70 pt-9">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                    Suggested
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[var(--midnight-text)]">
                    Subjects to follow
                  </h2>
                </div>
              </div>

              {isLoadingRecommendedTags ? (
                <TopicSkeleton />
              ) : recommendedTopics.length > 0 ? (
                <TopicList
                  topics={recommendedTopics}
                  actionLabel="Follow"
                  hoverLabel="Follow"
                  onAction={(topic) =>
                    followTag(topic, {
                      onSuccess: () =>
                        open("Subject followed successfully", "success"),
                      onError: () => open("Failed to follow subject", "error"),
                    })
                  }
                />
              ) : (
                <p className="text-sm text-[var(--midnight-muted)]">
                  No suggested subjects right now.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </MainLayout>
  );
}

function TopicSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`topic-skeleton-${index + 1}`}
          className="flex items-center justify-between border-b border-[var(--midnight-border)]/70 py-5"
        >
          <div className="space-y-2">
            <div className="h-6 w-40 animate-pulse rounded bg-[var(--midnight-code-bg)]" />
            <div className="h-4 w-28 animate-pulse rounded bg-[var(--midnight-code-bg)]" />
          </div>

          <div className="h-10 w-24 animate-pulse rounded-full bg-[var(--midnight-code-bg)]" />
        </div>
      ))}
    </div>
  );
}

function TopicList({
  topics,
  actionLabel,
  hoverLabel,
  onAction,
  active = false,
}: {
  topics: Tag[];
  actionLabel: string;
  hoverLabel: string;
  onAction: (topic: Tag) => void;
  active?: boolean;
}) {
  return (
    <div className="divide-y divide-[var(--midnight-border)]/70">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="flex w-full items-center justify-between py-5 text-left"
        >
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold tracking-[-0.035em] text-[var(--midnight-text)]">
              {topic.name}
            </h3>

            <p className="mt-1 text-sm text-[var(--midnight-muted)]">
              {topic.postsCount.toLocaleString()} letters ·{" "}
              {topic.authorsCount.toLocaleString()} writers
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAction(topic)}
            className={`group ml-6 shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition ${
              active
                ? "border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-[var(--midnight-muted)] hover:border-red-400/40 hover:text-red-300"
                : "border-[var(--midnight-border)]/70 text-[var(--midnight-muted)] hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)]"
            }`}
          >
            <span className="relative block h-5 overflow-hidden">
              <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                {actionLabel}
              </span>

              <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-200 group-hover:translate-y-0">
                {hoverLabel}
              </span>
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
