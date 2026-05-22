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
      <main className="min-h-screen bg-white text-black">
        <section className="mx-auto w-full max-w-2xl px-5 pt-14 md:px-6">
          <header className="border-b border-black/10 pb-8">
            <h1 className="font-serif text-5xl font-semibold tracking-tight">
              Saved
            </h1>

            <p className="mt-3 text-sm leading-6 text-black/55">
              Articles you saved for later.
            </p>
          </header>
        </section>

        <PostsContainer hasMore={false} isLoading={false} onLoadMore={() => {}}>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <PostItem.Skeleton key={`saved-post-skeleton-${index + 1}`} />
            ))}

          {!isLoading &&
            savedPosts.map((post) => {
              const authorName =
                post.author?.fullName || post.author?.email || "Unknown writer";

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
            <div className="py-20 text-center">
              <h2 className="font-serif text-2xl font-semibold">
                No saved articles yet
              </h2>

              <p className="mt-2 text-sm text-black/50">
                Save articles you want to read later.
              </p>
            </div>
          )}
        </PostsContainer>
      </main>
    </MainLayout>
  );
}
