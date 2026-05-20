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

type Tab = "Articles" | "Reposts" | "Bookmarks" | "Likes" | "About";

const tabs: Tab[] = ["Articles", "Reposts", "Bookmarks", "Likes", "About"];

export default function UserArticlesPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("Articles");
  const {
    data: postsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = usePosts({});
  const {} = useUserInfo(params.userSlug as string);
  const posts = useMemo(() => {
    return postsData?.pages.flatMap((page) => page.data) ?? [];
  }, [postsData]);

  const showInitialSkeleton = isLoading && posts.length === 0;
  const isBusy = isLoading || isFetching || isFetchingNextPage;

  return (
    <MainLayout>
      <main className="min-h-screen bg-white text-neutral-950">
        <section className="mx-auto max-w-3xl px-5 py-12">
          <header className="border-b border-neutral-200 pb-10">
            <div className="flex items-start justify-between gap-8">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">
                  Hoang Vu Le
                </h1>

                <p className="mt-3 max-w-xl text-base leading-7 text-neutral-600">
                  Essays about software, AI, startups, writing, and building
                  products on the internet.
                </p>

                <p className="mt-4 text-sm text-neutral-500">
                  12.8K subscribers · 24 posts
                </p>
              </div>

              <img
                src="https://i.pravatar.cc/200?img=12"
                alt="Hoang Vu Le"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800">
                Subscribe
              </button>

              <button className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium hover:bg-neutral-50">
                Message
              </button>
            </div>
          </header>

          <nav className="flex gap-7 overflow-x-auto border-b border-neutral-200 text-sm text-neutral-500">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 py-4 ${
                  activeTab === tab
                    ? "border-b border-black text-black"
                    : "hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <section className="py-8">
            {activeTab === "Articles" && (
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
                <p>
                  Hoang writes about software engineering, AI, startups,
                  systems, productivity, and internet business.
                </p>

                <p className="mt-5">
                  This page collects essays, notes, reposts, and saved reads.
                </p>
              </div>
            )}
          </section>
        </section>
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
