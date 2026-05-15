"use client";

import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { usePosts } from "@/features/posts/hooks/use-posts";

export default function Home() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePosts({
    limit: 5,
    published: true,
    sortBy: "latest",
  });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <MainLayout>
        <main className="mx-auto w-full max-w-5xl p-8">
          <PostsContainer
            hasMore={Boolean(hasNextPage)}
            isLoading={isFetchingNextPage}
            onLoadMore={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              fetchNextPage();
            }}
          >
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <PostItem.Skeleton key={`initial-skeleton-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index}`} />
              ))}

            {posts.map((post) => (
              <PostItem.Container key={post.id}>
                <PostItem.Content>
                  <PostItem.Header>
                    <PostItem.Author>{post.author?.email}</PostItem.Author>

                    <PostItem.Dot />

                    <PostItem.Date>
                      {new Date(post.postedDate).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </PostItem.Date>
                  </PostItem.Header>

                  <PostItem.Title link={`/articles/${post.slug}`}>{post.title}</PostItem.Title>

                  <PostItem.SubTitle>{post.subTitle}</PostItem.SubTitle>
                </PostItem.Content>

                <PostItem.Thumbnail
                  src={post.thumbnailImage ?? ""}
                  alt="Post thumbnail"
                />
              </PostItem.Container>
            ))}

            {isFetchingNextPage &&
              Array.from({ length: 5 }).map((_, index) => (
                <PostItem.Skeleton key={`next-page-skeleton-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index}`} />
              ))}
          </PostsContainer>
        </main>
      </MainLayout>
    </div >
  );
}