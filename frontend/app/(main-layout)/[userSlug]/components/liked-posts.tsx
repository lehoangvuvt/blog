import { PostItem } from "@/features/posts/components/post-item";
import PostsContainer from "@/features/posts/components/posts-container";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import { Heart } from "lucide-react";
import EmptyState from "./empty-state";
import useUserLikedPosts from "@/features/users/hooks/use-user-liked-posts";
import Link from "next/link";

export default function LikedPosts({ slug }: { slug: string }) {
  const { data: posts, isLoading } = useUserLikedPosts(slug);

  return (
    <PostsContainer hasMore={false} isLoading={isLoading} onLoadMore={() => {}}>
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <PostItem.Skeleton key={`initial-skeleton-${index + 1}`} />
        ))}

      {!isLoading && posts?.length === 0 && (
        <EmptyState icon={<Heart />} title="No liked posts yet" />
      )}

      <div className="divide-y divide-neutral-200">
        {posts?.map((post) => {
          const articleLink = getArticleLink(post.slug);
          const authorName = post.author?.fullName ?? "Unknown author";
          const authorSlug = post.author?.slug;
          const authorLink = authorSlug ? `/users/${authorSlug}` : "#";

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

                <PostItem.Title link={articleLink}>{post.title}</PostItem.Title>

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
    </PostsContainer>
  );
}
