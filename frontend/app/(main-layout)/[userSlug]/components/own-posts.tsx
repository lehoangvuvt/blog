import { PostItem } from "@/features/posts/components/post-item";
import PostsContainer from "@/features/posts/components/posts-container";
import { formatPostDate, getArticleLink } from "@/shared/utils";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useMemo } from "react";

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
                    <PostItem.Skeleton key={`initial-skeleton-${index + 1}`} />
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
    )
}