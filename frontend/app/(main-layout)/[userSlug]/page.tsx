"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import { Bookmark, Heart, Repeat2 } from "lucide-react";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { PostItem } from "@/features/posts/components/post-item";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import PostsContainer from "@/features/posts/components/posts-container";
import { useUserInfo } from "@/features/users/hooks/use-user-info";
import { useParams } from "next/navigation";
import { useMe } from "@/features/auth/hooks/use-me";
import EditProfileModal from "./components/edit-profile-modal";

type Tab = "Posts" | "Reposts" | "Bookmarks" | "Likes" | "About";

const tabs: Tab[] = ["Posts", "Reposts", "Bookmarks", "Likes", "About"];

export default function UserArticlesPage() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const params = useParams();
  const userSlug = params.userSlug as string;

  const [activeTab, setActiveTab] = useState<Tab>("Posts");

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
            className={`absolute inset-0 ${hasBackgroundImage ? "bg-black/35 backdrop-blur-[1px]" : ""
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
                  className={`text-3xl font-semibold tracking-tight ${hasBackgroundImage ? "text-white" : "text-neutral-950"
                    }`}
                >
                  {displayName}
                </h1>

                <p
                  className={`mt-1 text-sm font-medium ${hasBackgroundImage ? "text-white/70" : "text-neutral-500"
                    }`}
                >
                  @{userInfo?.slug}
                </p>

                <p
                  className={`mt-3 max-w-xl text-[15px] leading-7 ${hasBackgroundImage ? "text-white/90" : "text-neutral-700"
                    }`}
                >
                  {introduction}
                </p>

                <div
                  className={`mt-4 flex flex-wrap items-center gap-x-2 text-sm ${hasBackgroundImage ? "text-white/75" : "text-neutral-500"
                    }`}
                >
                  <span>
                    {userInfo?.statistics.followersCount ?? "-"} followers
                  </span>
                  <span>·</span>
                  <span>{userInfo?.statistics.postsCount ?? "-"} posts</span>
                </div>

                <div
                  className={`mt-5 flex flex-wrap items-center gap-4 ${hasBackgroundImage ? "text-white/80" : "text-neutral-500"
                    }`}
                >
                  {userInfo?.social.x && (
                    <a
                      href={userInfo.social.x}
                      target="_blank"
                      rel="noreferrer"
                      className="transition hover:text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <title>X</title>
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153Zm-1.292 19.49h2.039L6.486 3.24H4.298l13.31 17.404Z" />
                      </svg>
                    </a>
                  )}

                  {userInfo?.social.facebook && (
                    <a
                      href={userInfo.social.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="transition hover:text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <title>Facebook</title>
                        <path d="M22 12.07C22 6.477 17.523 2 12 2S2 6.477 2 12.07c0 5.017 3.657 9.18 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.522 1.492-3.916 3.777-3.916 1.094 0 2.238.197 2.238.197v2.475h-1.26c-1.243 0-1.63.776-1.63 1.572v1.887h2.773l-.443 2.9h-2.33V22c4.78-.75 8.437-4.913 8.437-9.93Z" />
                      </svg>
                    </a>
                  )}

                  {userInfo?.social.youtube && (
                    <a
                      href={userInfo.social.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="transition hover:text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <title>YouTube</title>
                        <path d="M23.498 6.186a2.97 2.97 0 0 0-2.09-2.103C19.556 3.5 12 3.5 12 3.5s-7.556 0-9.408.583A2.97 2.97 0 0 0 .502 6.186 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .502 5.814 2.97 2.97 0 0 0 2.09 2.103C4.444 20.5 12 20.5 12 20.5s7.556 0 9.408-.583a2.97 2.97 0 0 0 2.09-2.103A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                      </svg>
                    </a>
                  )}

                  {userInfo?.social.linkedin && (
                    <a
                      href={userInfo.social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="transition hover:text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <title>LinkedIn</title>
                        <path d="M4.98 3.5C4.98 4.604 4.104 5.5 3 5.5S1.02 4.604 1.02 3.5 1.896 1.5 3 1.5s1.98.896 1.98 2ZM1.5 8h3V22h-3V8Zm7 0h2.878v1.91h.041c.401-.761 1.381-1.562 2.844-1.562 3.041 0 3.603 2.002 3.603 4.604V22h-3v-6.617c0-1.579-.028-3.611-2.2-3.611-2.2 0-2.537 1.719-2.537 3.496V22h-3V8Z" />
                      </svg>
                    </a>
                  )}

                  {userInfo?.social.website && (
                    <a
                      href={userInfo.social.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium transition hover:text-black"
                    >
                      Website
                    </a>
                  )}
                </div>

                <div className="mt-5 flex min-h-9 flex-wrap items-center gap-3">
                  {isCheckingOwner ? (
                    <div
                      className={`h-9 w-28 animate-pulse rounded-full ${hasBackgroundImage ? "bg-white/30" : "bg-neutral-200"
                        }`}
                    />
                  ) : isMyProfile ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditProfileOpen(true)}
                        className={`rounded-full px-5 py-2 text-sm font-medium transition ${hasBackgroundImage
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-neutral-950 text-white hover:bg-neutral-800"
                          }`}
                      >
                        Edit profile
                      </button>

                      <button
                        type="button"
                        className={`rounded-full border px-5 py-2 text-sm font-medium transition ${hasBackgroundImage
                          ? "border-white/30 text-white hover:bg-white/10"
                          : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                          }`}
                      >
                        Customize
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
                  className={`shrink-0 py-4 transition ${activeTab === tab
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

                  {isFetchingNextPage &&
                    Array.from({ length: 3 }).map((_, index) => (
                      <PostItem.Skeleton key={`next-page-skeleton-${index}`} />
                    ))}
                </PostsContainer>
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
      </main>
    </MainLayout>
  );
}

function EmptyState({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 py-20 text-center text-neutral-500">
      <div className="mb-3 text-neutral-400">{icon}</div>
      <p className="text-sm">{title}</p>
    </div>
  );
}