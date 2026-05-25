"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, BellOff, Check, ChevronDown, Mail, Slash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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
import type { Tag } from "@/features/tags/types";
import useToggleTagFollowEmailNotify from "@/features/tags/hooks/use-toggle-tag-follow-email-notify";

type Tab = "writers" | "subjects";

export default function FollowingPage() {
  const { close, open, notifications } = useNotification();
  const router = useRouter();
  const params = useParams();

  const [activeTab, setActiveTab] = useState<Tab>(
    params.tabType === "writers" ? "writers" : "subjects"
  );

  const [openTopicMenuId, setOpenTopicMenuId] = useState<string | null>(null);

  const { data: me, isLoading: isLoadingMe } = useMe();

  const emailEnabledTopicIds =
    me?.followedTags?.filter((t) => t.isEmailNotify).map((t) => t.id) ?? [];

  const followedTagIds = useMemo(
    () => (me?.followedTags ? me.followedTags.map((tag) => tag.id) : []),
    [me]
  );

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
      activeTab === "writers" && followingIds.length > 0
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
    activeTab === "writers" && (isLoadingMe || isLoading) && posts.length === 0;

  const hasNoFollowings = !isLoadingMe && followingIds.length === 0;

  const showTopicsSkeleton =
    activeTab === "subjects" &&
    !isLoadingMe &&
    followedTagIds.length > 0 &&
    isLoadingFollowedTags;

  const { mutate: followTag } = useFollowTag();
  const { mutate: unfollowTag } = useUnfollowTag();
  const { mutate: toggleEmailNotify } = useToggleTagFollowEmailNotify();

  useEffect(() => {
    router.replace(`/following/${activeTab}`);
  }, [activeTab, router]);

  const handleToggleEmail = (topic: Tag, enabled: boolean) => {
    toggleEmailNotify(
      {
        tag: topic,
        state: enabled ? "on" : "off",
      },
      {
        onSuccess: () => {
          open(
            enabled
              ? `Email notifications on for ${topic.name}`
              : `Email notifications off for ${topic.name}`,
            "success"
          );

          setOpenTopicMenuId(null);
        },
      }
    );
  };

  const handleUnfollowTopic = (topic: Tag) => {
    unfollowTag(topic, {
      onSuccess: () => {
        open("Subject unfollowed successfully", "success");
        setOpenTopicMenuId(null);
      },
      onError: () => open("Failed to unfollow subject", "error"),
    });
  };

  return (
    <main className="min-h-screen text-[var(--midnight-text)]">
      <NotificationPopover onClose={close} notifications={notifications} />

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
              onClick={() => setActiveTab("writers")}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeTab === "writers"
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

      {activeTab === "writers" && (
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
                const postLink = `/letters/${post.slug}`;

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
                  Follow a few voices and their newest letters will appear here.
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
              mode="following"
              openTopicMenuId={openTopicMenuId}
              setOpenTopicMenuId={setOpenTopicMenuId}
              emailEnabledTopicIds={emailEnabledTopicIds}
              onToggleEmail={handleToggleEmail}
              onUnfollow={handleUnfollowTopic}
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
                mode="suggested"
                openTopicMenuId={openTopicMenuId}
                setOpenTopicMenuId={setOpenTopicMenuId}
                emailEnabledTopicIds={emailEnabledTopicIds}
                onToggleEmail={handleToggleEmail}
                onUnfollow={handleUnfollowTopic}
                onFollow={(topic) =>
                  followTag(topic, {
                    onSuccess: () => {
                      open("Subject followed successfully", "success");
                      setOpenTopicMenuId(topic.id);
                    },
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
  mode,
  openTopicMenuId,
  setOpenTopicMenuId,
  emailEnabledTopicIds,
  onFollow,
  onUnfollow,
  onToggleEmail,
}: {
  topics: Tag[];
  mode: "following" | "suggested";
  openTopicMenuId: string | null;
  setOpenTopicMenuId: (id: string | null) => void;
  emailEnabledTopicIds: string[];
  onFollow?: (topic: Tag) => void;
  onUnfollow: (topic: Tag) => void;
  onToggleEmail: (topic: Tag, enabled: boolean) => void;
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setOpenTopicMenuId(null);
      }
    }

    if (openTopicMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openTopicMenuId, setOpenTopicMenuId]);

  return (
    <div className="divide-y divide-[var(--midnight-border)]/70">
      {topics.map((topic) => {
        const isMenuOpen = openTopicMenuId === topic.id;
        const isEmailEnabled = emailEnabledTopicIds.includes(topic.id);
        const isFollowing = mode === "following" || isMenuOpen;

        return (
          <div
            key={topic.id}
            className="flex w-full items-center justify-between py-5 text-left"
          >
            <div className="min-w-0">
              <h3 className="truncate text-xl font-bold tracking-[-0.035em] text-[var(--midnight-text)]">
                {topic.name}
              </h3>

              <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                {topic.postsCount.toLocaleString()} &nbsp;letters ·{" "}
                {topic.authorsCount.toLocaleString()} &nbsp;&nbsp;writers
              </p>
            </div>

            <div
              ref={isMenuOpen ? menuRef : null}
              className="relative ml-6 shrink-0"
            >
              <button
                type="button"
                onClick={() => {
                  if (isFollowing) {
                    setOpenTopicMenuId(isMenuOpen ? null : topic.id);
                    return;
                  }

                  onFollow?.(topic);
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isFollowing
                    ? "border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-[var(--midnight-text)] hover:border-[var(--midnight-accent)]/60"
                    : "border-[var(--midnight-border)]/70 text-[var(--midnight-muted)] hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)]"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}

                {isFollowing && (
                  <ChevronDown
                    className={`h-4 w-4 transition ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                  <button
                    type="button"
                    onClick={() => onToggleEmail(topic, true)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[var(--midnight-text)] transition hover:bg-[var(--midnight-code-bg)]"
                  >
                    <Bell className="h-4 w-4 text-[var(--midnight-muted)]" />

                    <span className="flex-1">Email notifications on</span>

                    {isEmailEnabled && (
                      <Check className="h-4 w-4 text-[var(--midnight-accent)]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleEmail(topic, false)}
                    className="flex w-full items-center gap-3 border-t border-[var(--midnight-border)]/70 px-4 py-3 text-left text-sm text-[var(--midnight-muted)] transition hover:bg-[var(--midnight-code-bg)] hover:text-[var(--midnight-text)]"
                  >
                    <BellOff className="h-4 w-4" />

                    <span className="flex-1">Email notifications off</span>

                    {!isEmailEnabled && (
                      <Check className="h-4 w-4 text-[var(--midnight-accent)]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onUnfollow(topic)}
                    className="flex w-full items-center gap-3 border-t border-[var(--midnight-border)]/70 px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-400/10"
                  >
                    <Slash className="h-4 w-4" />
                    Unfollow
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
