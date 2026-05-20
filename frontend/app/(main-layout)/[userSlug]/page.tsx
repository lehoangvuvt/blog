"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import {
  Bookmark,
  Heart,
  Library,
  Plus,
  Repeat2,
  Upload,
  X,
} from "lucide-react";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { PostItem } from "@/features/posts/components/post-item";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import PostsContainer from "@/features/posts/components/posts-container";
import { useUserInfo } from "@/features/users/hooks/use-user-info";
import { useParams } from "next/navigation";
import { useMe } from "@/features/auth/hooks/use-me";
import EditProfileModal from "./components/edit-profile-modal";
import CreateCollectionModal from "./components/create-collection-modal";
import { Post } from "@/features/posts/types";
import ArticleCollectionsSection from "./components/article-collections-section";
import EmptyState from "./components/empty-state";
import usePostCollections from "@/features/post-collections/hooks/use-post-collections";

type Tab =
  | "Posts"
  | "Collections"
  | "Reposts"
  | "Bookmarks"
  | "Likes"
  | "About";

const allTabs: Tab[] = [
  "Posts",
  "Collections",
  "Reposts",
  "Bookmarks",
  "Likes",
  "About",
];

export default function UserArticlesPage() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Posts");

  const params = useParams();
  const userSlug = params.userSlug as string;

  const { data: userInfo, isLoading: isLoadingUserInfo } =
    useUserInfo(userSlug);

  const { data: myInfo, isLoading: isLoadingMe } = useMe();

  const {
    data: postsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = usePosts({ authorId: userInfo?.id }, Boolean(userInfo?.id));

  const posts = useMemo(() => {
    return postsData?.pages.flatMap((page) => page.data) ?? [];
  }, [postsData]);

  const showInitialSkeleton = isLoading && posts.length === 0;
  const isBusy = isLoading || isFetching || isFetchingNextPage;

  const displayName = userInfo?.fullName ?? "Untitled writer";
  const introduction = userInfo?.introduction ?? "-";
  const avatar = userInfo?.avatar;

  const hasBackgroundImage = Boolean(userInfo?.backgroundImage);
  const isCheckingOwner = isLoadingUserInfo || isLoadingMe;
  const isMyProfile = Boolean(
    myInfo?.id && userInfo?.id && myInfo.id === userInfo.id
  );
  const { data: collections } = usePostCollections(userInfo?.id, isMyProfile);

  const tabs = allTabs.filter((tab) => {
    if (tab === "Collections" && !isMyProfile) {
      return false;
    }

    if (tab === "Bookmarks" && !isMyProfile) {
      return false;
    }

    return true;
  });

  return (
    <MainLayout>
      <main className="min-h-screen bg-white text-neutral-950">
        <section
          className="relative overflow-hidden border-b border-neutral-200"
          style={
            hasBackgroundImage
              ? {
                  backgroundImage: `url(${userInfo?.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  background:
                    "radial-gradient(circle at top left, rgba(0,0,0,0.05), transparent 34%), radial-gradient(circle at bottom right, rgba(255,103,25,0.12), transparent 32%), #f8f6f1",
                }
          }
        >
          <div
            className={`absolute inset-0 ${
              hasBackgroundImage ? "bg-black/35 backdrop-blur-[1px]" : ""
            }`}
          />

          <div className="relative mx-auto max-w-3xl px-5 py-12">
            <div className="flex items-start gap-6">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-28 w-28 rounded-full border border-black/10 object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-black/10 bg-neutral-950 text-4xl font-semibold text-white shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h1
                  className={`text-3xl font-semibold tracking-tight ${
                    hasBackgroundImage ? "text-white" : "text-neutral-950"
                  }`}
                >
                  {displayName}
                </h1>

                <p
                  className={`mt-1 text-sm font-medium ${
                    hasBackgroundImage ? "text-white/70" : "text-neutral-500"
                  }`}
                >
                  @{userInfo?.slug}
                </p>

                <p
                  className={`mt-3 max-w-xl text-[15px] leading-7 ${
                    hasBackgroundImage ? "text-white/90" : "text-neutral-700"
                  }`}
                >
                  {introduction}
                </p>

                <div
                  className={`mt-4 flex flex-wrap items-center gap-x-2 text-sm ${
                    hasBackgroundImage ? "text-white/75" : "text-neutral-500"
                  }`}
                >
                  <span>
                    {userInfo?.statistics.followersCount ?? "-"} followers
                  </span>
                  <span>·</span>
                  <span>{userInfo?.statistics.postsCount ?? "-"} posts</span>
                </div>

                <div className="mt-5 flex min-h-9 flex-wrap items-center gap-3">
                  {isCheckingOwner ? (
                    <div
                      className={`h-9 w-28 animate-pulse rounded-full ${
                        hasBackgroundImage ? "bg-white/30" : "bg-neutral-200"
                      }`}
                    />
                  ) : isMyProfile ? (
                    <>
                      <Link
                        href="/new-article"
                        className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
                          hasBackgroundImage
                            ? "bg-white text-black hover:bg-white/90"
                            : "bg-neutral-950 text-white hover:bg-neutral-800"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                        New article
                      </Link>

                      <button
                        type="button"
                        onClick={() => setIsCreateCollectionOpen(true)}
                        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition ${
                          hasBackgroundImage
                            ? "border-white/30 text-white hover:bg-white/10"
                            : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <Library className="h-4 w-4" />
                        Create collection
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsEditProfileOpen(true)}
                        className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                          hasBackgroundImage
                            ? "border-white/30 text-white hover:bg-white/10"
                            : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        Edit profile
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="rounded-full bg-[#ff6719] px-5 py-2 text-sm font-medium text-white transition hover:brightness-95"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-5">
            <nav className="sticky top-16 z-30 flex gap-8 overflow-x-auto border-b border-neutral-200 bg-white/95 text-sm text-neutral-500 backdrop-blur">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 py-4 transition ${
                    activeTab === tab
                      ? "border-b border-neutral-950 font-medium text-neutral-950"
                      : "hover:text-neutral-950"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <section className="py-8">
              {activeTab === "Posts" && (
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

                  <div className="divide-y divide-neutral-200">
                    {posts.map((post) => {
                      const articleLink = getArticleLink(post.slug);
                      const authorName =
                        post.author?.fullName ?? "Unknown author";
                      const authorSlug = post.author?.slug;
                      const authorLink = authorSlug
                        ? `/users/${authorSlug}`
                        : "#";

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
                              <PostItem.SubTitle>
                                {post.subTitle}
                              </PostItem.SubTitle>
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
                </PostsContainer>
              )}

              {activeTab === "Collections" && (
                <ArticleCollectionsSection collections={collections ?? []} />
              )}

              {activeTab === "Reposts" && (
                <EmptyState icon={<Repeat2 />} title="No reposts yet" />
              )}

              {activeTab === "Bookmarks" && (
                <EmptyState icon={<Bookmark />} title="No bookmarks yet" />
              )}

              {activeTab === "Likes" && (
                <EmptyState icon={<Heart />} title="No liked posts yet" />
              )}

              {activeTab === "About" && (
                <div className="max-w-2xl text-base leading-8 text-neutral-700">
                  <h2 className="mb-3 text-xl font-semibold text-neutral-950">
                    About {displayName}
                  </h2>
                  <p>{introduction}</p>
                </div>
              )}
            </section>
          </div>
        </section>

        {userInfo && (
          <EditProfileModal
            open={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            userInfo={userInfo}
          />
        )}

        <CreateCollectionModal
          open={isCreateCollectionOpen}
          onClose={() => setIsCreateCollectionOpen(false)}
        />
      </main>
    </MainLayout>
  );
}
