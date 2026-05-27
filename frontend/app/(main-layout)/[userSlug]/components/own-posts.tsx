import { useMemo } from "react";

import { PostItem } from "@/features/posts/components/post-item";
import PostsContainer from "@/features/posts/components/posts-container";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import Link from "next/link";

export default function OwnPosts({ userId }: { userId: string }) {
  const {
    data: postsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = usePosts({ authorId: userId }, true);

  const posts = useMemo(() => {
    return postsData?.pages.flatMap((page) => page.data) ?? [];
  }, [postsData]);

  return (
    <PostsContainer
      hasMore={Boolean(hasNextPage)}
      isLoading={isLoading}
      onLoadMore={() => {
        if (isLoading || !hasNextPage) return;
        fetchNextPage();
      }}
    >
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <PostItem.Skeleton key={`own-post-skeleton-${index + 1}`} />
        ))}

      {!isLoading && posts.length === 0 && (
        <div className="py-16">
          <p className="text-2xl font-bold tracking-[-0.04em] text-[var(--midnight-text)]">
            No letters yet.
          </p>

          <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--midnight-muted)]">
            This archive is still quiet.
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="divide-y divide-[var(--midnight-border)]/70">
          {posts.map((post) => {
            const articleLink = getArticleLink(post.slug);
            const authorName = post.author?.fullName ?? "Unknown author";
            const authorSlug = post.author?.slug;
            const authorLink = authorSlug ? `/${authorSlug}` : "#";

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
                    <PostItem.SubTitle>{post.subTitle}</PostItem.SubTitle>
                  )}

                  <PostItem.Footer>
                    {post.tags.map((tag) => (
                      <Link
                        className="hover:underline cursor-pointer hover:brightness-200 transition-all"
                        href={`/subjects/${tag.slug}`}
                        key={tag.slug}
                      >
                        #{tag.name}
                      </Link>
                    ))}
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
      )}
    </PostsContainer>
  );
}
