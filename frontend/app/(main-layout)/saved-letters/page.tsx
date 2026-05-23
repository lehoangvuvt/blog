"use client";

import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { formatTimeAgo } from "@/shared/utils";
import useUserSavedPosts from "@/features/users/hooks/use-user-saved-posts";

export default function SavedPostsPage() {
  const { data, isLoading } = useUserSavedPosts();

  const savedPosts = data ?? [];

  return (
    <MainLayout>
      <main className="min-h-screen bg-[var(--midnight-bg)] text-[var(--midnight-text)]">
        <section className="mx-auto w-full max-w-3xl px-5 pt-12 md:px-6">
          <header className="border-b border-[var(--midnight-border)]/70 pb-7">
            <h1 className="mt-4 text-5xl font-bold tracking-[-0.06em] text-[var(--midnight-text)]">
              Saved letters
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[var(--midnight-muted)]">
              Letters you kept for another quiet hour.
            </p>
          </header>
        </section>

        <section className="mx-auto w-full max-w-3xl px-5 md:px-6">
          <PostsContainer
            hasMore={false}
            isLoading={false}
            onLoadMore={() => {}}
          >
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <PostItem.Skeleton key={`saved-post-skeleton-${index + 1}`} />
              ))}

            {!isLoading &&
              savedPosts.map((post) => {
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

            {!isLoading && savedPosts.length === 0 && (
              <div className="pt-12 pb-16">
                <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
                  No saved letters yet.
                </h2>

                <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
                  Save the letters you want to return to later.
                </p>
              </div>
            )}
          </PostsContainer>
        </section>
      </main>
    </MainLayout>
  );
}
