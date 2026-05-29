"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BellOff,
  Check,
  ChevronDown,
  Slash,
  UserRound,
} from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { useMe } from "@/features/auth/hooks/use-me";
import { useTags } from "@/features/tags/hooks/use-tags";
import useFollowTag from "@/features/tags/hooks/use-follow-tag";
import useUnfollowTag from "@/features/tags/hooks/use-unfollow-tag";
import useToggleTagFollowEmailNotify from "@/features/tags/hooks/use-toggle-tag-follow-email-notify";
import type { Tag } from "@/features/tags/types";
import ForbiddenPage from "@/app/forbbiden";
import Loading from "@/shared/components/loading";
import { useNotification } from "@/hooks/use-notification";
import { apiClient } from "@/shared/api/client";

type Tab = "writers" | "subjects";

type Writer = {
  id: string;
  slug: string;
  avatar: string | null;
  fullName: string | null;
  createdAt?: string;
  statistics?: {
    postsCount: number;
    followersCount: number;
  };
};

type MeFollowingWriter = {
  id: string;
  slug: string;
  avatar: string | null;
  fullName?: string | null;
  full_name?: string | null;
  created_at?: string;
  postsCount?: number;
  followersCount?: number;
  statistics?: {
    postsCount?: number;
    followersCount?: number;
  };
  _count?: {
    posts?: number;
    userFollowers?: number;
  };
};

type SuggestedAuthorsResponse = {
  data: Writer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    nextPage: number | null;
  };
};

async function getSuggestedAuthors({ pageParam = 1 }: { pageParam?: number }) {
  const res = await apiClient.get(`/users/suggested?page=${pageParam}&limit=8`);
  return res.data as SuggestedAuthorsResponse;
}

async function followWriter(writerId: string) {
  await apiClient.post(`/users/${writerId}/follow`);
}

async function unfollowWriter(writerId: string) {
  await apiClient.delete(`/users/${writerId}/follow`);
}

export default function FollowingPage() {
  const queryClient = useQueryClient();
  const { pushNotification } = useNotification();
  const router = useRouter();
  const params = useParams();

  const [activeTab, setActiveTab] = useState<Tab>(
    params.tabType === "writers" ? "writers" : "subjects"
  );

  const [openTopicMenuId, setOpenTopicMenuId] = useState<string | null>(null);
  const [openWriterMenuId, setOpenWriterMenuId] = useState<string | null>(null);

  const { data: me, isLoading: isLoadingMe } = useMe();

  const emailEnabledTopicIds =
    me?.followedTags?.filter((t) => t.isEmailNotify).map((t) => t.id) ?? [];

  const followedTagIds = useMemo(
    () => me?.followedTags?.map((tag) => tag.id) ?? [],
    [me]
  );

  const followedWriters = useMemo<Writer[]>(() => {
    const followings = (me?.followings ?? []) as MeFollowingWriter[];

    return followings.map((writer) => ({
      id: writer.id,
      slug: writer.slug,
      avatar: writer.avatar,
      fullName: writer.fullName ?? writer.full_name ?? null,
      createdAt: writer.created_at,
      statistics: {
        postsCount:
          writer.statistics?.postsCount ??
          writer.postsCount ??
          writer._count?.posts ??
          0,
        followersCount:
          writer.statistics?.followersCount ??
          writer.followersCount ??
          writer._count?.userFollowers ??
          0,
      },
    }));
  }, [me]);

  const followingIds = useMemo(
    () => followedWriters.map((writer) => writer.id),
    [followedWriters]
  );

  const {
    data: suggestedAuthorsData,
    fetchNextPage: fetchNextSuggestedAuthorsPage,
    hasNextPage: hasNextSuggestedAuthorsPage,
    isFetchingNextPage: isFetchingNextSuggestedAuthorsPage,
    isLoading: isLoadingSuggestedAuthors,
  } = useInfiniteQuery({
    queryKey: ["suggested-authors"],
    queryFn: getSuggestedAuthors,
    initialPageParam: 1,
    enabled: activeTab === "writers",
    getNextPageParam: (lastPage) => lastPage.meta.nextPage,
  });

  const suggestedAuthors =
    suggestedAuthorsData?.pages
      .flatMap((page) => page.data)
      .filter((author) => !followingIds.includes(author.id)) ?? [];

  const { mutate: followWriterMutate, isPending: isFollowingWriter } =
    useMutation({
      mutationFn: followWriter,
      onSuccess: async () => {
        pushNotification("Writer followed successfully", "success");
        await queryClient.invalidateQueries({ queryKey: ["me"] });
        await queryClient.invalidateQueries({
          queryKey: ["suggested-authors"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["me-preferred-posts"],
        });
      },
      onError: () => {
        pushNotification("Failed to follow writer", "error");
      },
    });

  const { mutate: unfollowWriterMutate, isPending: isUnfollowingWriter } =
    useMutation({
      mutationFn: unfollowWriter,
      onSuccess: async () => {
        pushNotification("Writer unfollowed successfully", "success");
        setOpenWriterMenuId(null);
        await queryClient.invalidateQueries({ queryKey: ["me"] });
        await queryClient.invalidateQueries({
          queryKey: ["suggested-authors"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["me-preferred-posts"],
        });
      },
      onError: () => {
        pushNotification("Failed to unfollow writer", "error");
      },
    });

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

  const recommendedTopics =
    recommendedTagsData?.pages
      .flatMap((page) => page.data)
      .filter((tag) => !followedTagIds.includes(tag.id)) ?? [];

  const showWritersSkeleton =
    activeTab === "writers" &&
    isLoadingSuggestedAuthors &&
    suggestedAuthors.length === 0;

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
          pushNotification(
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
        pushNotification("Subject unfollowed successfully", "success");
        setOpenTopicMenuId(null);
      },
      onError: () => pushNotification("Failed to unfollow subject", "error"),
    });
  };

  if (isLoadingMe) return <Loading />;

  if (!me && !isLoadingMe) return <ForbiddenPage />;

  return (
    <main className="min-h-screen text-[var(--midnight-text)]">
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
        <section className="mx-auto w-full max-w-3xl px-5 py-8 md:px-6">
          {followedWriters.length > 0 ? (
            <WriterList
              writers={followedWriters}
              mode="following"
              openWriterMenuId={openWriterMenuId}
              setOpenWriterMenuId={setOpenWriterMenuId}
              onFollow={(writer) => followWriterMutate(writer.id)}
              onUnfollow={(writer) => unfollowWriterMutate(writer.id)}
              isPending={isFollowingWriter || isUnfollowingWriter}
            />
          ) : (
            <div className="pt-4 pb-10">
              <p className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                No writers followed yet.
              </p>

              <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
                Follow a few voices and their newest letters will appear here.
              </p>
            </div>
          )}

          <div className="mt-12 border-t border-[var(--midnight-border)]/70 pt-9">
            <div className="mb-6">
              <p className="text-xs tracking-[0.14em] text-[var(--midnight-soft)]">
                Suggested
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[var(--midnight-text)]">
                Writers to follow
              </h2>
            </div>

            {showWritersSkeleton ? (
              <WriterSkeleton />
            ) : suggestedAuthors.length > 0 ? (
              <>
                <WriterList
                  writers={suggestedAuthors}
                  mode="suggested"
                  openWriterMenuId={openWriterMenuId}
                  setOpenWriterMenuId={setOpenWriterMenuId}
                  onFollow={(writer) => followWriterMutate(writer.id)}
                  onUnfollow={(writer) => unfollowWriterMutate(writer.id)}
                  isPending={isFollowingWriter || isUnfollowingWriter}
                />

                {hasNextSuggestedAuthorsPage && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      disabled={isFetchingNextSuggestedAuthorsPage}
                      onClick={() => fetchNextSuggestedAuthorsPage()}
                      className="rounded-full border border-[var(--midnight-border)]/70 px-5 py-2 text-sm text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)] disabled:opacity-50"
                    >
                      {isFetchingNextSuggestedAuthorsPage
                        ? "Loading..."
                        : "Load more writers"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-[var(--midnight-muted)]">
                No suggested writers right now.
              </p>
            )}
          </div>
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
                      pushNotification(
                        "Subject followed successfully",
                        "success"
                      );
                      setOpenTopicMenuId(topic.id);
                    },
                    onError: () =>
                      pushNotification("Failed to follow subject", "error"),
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

function WriterList({
  writers,
  mode,
  openWriterMenuId,
  setOpenWriterMenuId,
  onFollow,
  onUnfollow,
  isPending,
}: {
  writers: Writer[];
  mode: "following" | "suggested";
  openWriterMenuId: string | null;
  setOpenWriterMenuId: (id: string | null) => void;
  onFollow: (writer: Writer) => void;
  onUnfollow: (writer: Writer) => void;
  isPending: boolean;
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { data: me } = useMe();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setOpenWriterMenuId(null);
      }
    }

    if (openWriterMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openWriterMenuId, setOpenWriterMenuId]);

  return (
    <div className="divide-y divide-[var(--midnight-border)]/70">
      {writers
        .filter((ele) => ele.id !== me?.id)
        .map((writer) => {
          const name = writer.fullName || "Unknown writer";
          const isFollowing = mode === "following";
          const isMenuOpen = openWriterMenuId === writer.id;

          return (
            <div
              key={writer.id}
              className="flex items-center justify-between gap-5 py-5"
            >
              <Link
                href={`/${writer.slug}`}
                className="flex min-w-0 items-center gap-4"
              >
                {writer.avatar ? (
                  <img
                    src={writer.avatar}
                    alt={name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] text-[var(--midnight-muted)]">
                    <UserRound className="h-5 w-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-xl font-bold tracking-[-0.035em] text-[var(--midnight-text)]">
                    {name}
                  </p>

                  <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                    {(writer.statistics?.postsCount ?? 0).toLocaleString()}{" "}
                    letters ·{" "}
                    {(writer.statistics?.followersCount ?? 0).toLocaleString()}{" "}
                    followers
                  </p>
                </div>
              </Link>

              <div
                ref={isMenuOpen ? menuRef : null}
                className="relative shrink-0"
              >
                {isFollowing ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      setOpenWriterMenuId(isMenuOpen ? null : writer.id)
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--midnight-border)]/70 bg-[var(--midnight-code-bg)] px-4 py-2 text-sm font-medium text-[var(--midnight-text)] transition hover:border-[var(--midnight-accent)]/60 disabled:opacity-50"
                  >
                    Following
                    <ChevronDown
                      className={`h-4 w-4 transition ${
                        isMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onFollow(writer)}
                    className="rounded-full border border-[var(--midnight-border)]/70 px-4 py-2 text-sm font-medium text-[var(--midnight-muted)] transition hover:border-[var(--midnight-accent)]/70 hover:text-[var(--midnight-accent-hover)] disabled:opacity-50"
                  >
                    Follow
                  </button>
                )}

                {isMenuOpen && (
                  <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-[var(--midnight-border)]/70 bg-[var(--midnight-surface)] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => onUnfollow(writer)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
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

function WriterSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`writer-skeleton-${index + 1}`}
          className="flex items-center justify-between border-b border-[var(--midnight-border)]/70 py-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-[var(--midnight-code-bg)]" />

            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-[var(--midnight-code-bg)]" />
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--midnight-code-bg)]" />
            </div>
          </div>

          <div className="h-10 w-20 animate-pulse rounded-full bg-[var(--midnight-code-bg)]" />
        </div>
      ))}
    </div>
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
              <Link
                href={`/subjects/${topic.slug}`}
                className="truncate text-xl font-bold tracking-[-0.035em] text-[var(--midnight-text)]"
              >
                {topic.name}
              </Link>

              <p className="mt-1 text-sm text-[var(--midnight-muted)]">
                {topic.postsCount.toLocaleString()} letters ·{" "}
                {topic.authorsCount.toLocaleString()} writers
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
