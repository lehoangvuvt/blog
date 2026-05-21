"use client";

import { useMemo } from "react";
import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useMe } from "@/features/auth/hooks/use-me";
import { formatTimeAgo } from "@/shared/utils";

export default function FollowingPage() {
    const { data: me, isLoading: isLoadingMe } = useMe();

    const followingIds = useMemo(
        () => me?.followings?.map((user) => user.id) ?? [],
        [me],
    );

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = usePosts(
        {
            limit: 10,
            published: true,
            sortBy: "latest",
            authorIds: followingIds,
        },
        followingIds.length > 0,
    );

    const posts = data?.pages.flatMap((page) => page.data) ?? [];

    const showInitialSkeleton = (isLoadingMe || isLoading) && posts.length === 0;
    const hasNoFollowings = !isLoadingMe && followingIds.length === 0;

    return (
        <MainLayout>
            <main className="min-h-screen bg-white text-black">
                <section className="mx-auto w-full max-w-2xl px-5 pt-14 md:px-6">
                    <header className="border-b border-black/10 pb-8">
                        <h1 className="font-serif text-5xl font-semibold tracking-tight">
                            Following
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-black/55">
                            Latest articles from authors you follow.
                        </p>
                    </header>
                </section>

                <PostsContainer
                    hasMore={!hasNoFollowings && !!hasNextPage}
                    isLoading={isFetchingNextPage}
                    onLoadMore={() => fetchNextPage()}
                >
                    {showInitialSkeleton &&
                        Array.from({ length: 5 }).map((_, index) => (
                            <PostItem.Skeleton key={`skeleton-loading-${index + 1}`} />
                        ))}

                    {!showInitialSkeleton &&
                        !hasNoFollowings &&
                        posts.map((post) => {
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

                    {!showInitialSkeleton &&
                        (hasNoFollowings && (
                            <div className="py-20 text-center">
                                <h2 className="font-serif text-2xl font-semibold">
                                    {hasNoFollowings ? "You are not following anyone yet" : "No articles found"}
                                </h2>

                                <p className="mt-2 text-sm text-black/50">
                                    {hasNoFollowings
                                        ? "Follow writers to see their latest articles here."
                                        : "Articles from writers you follow will appear here."}
                                </p>
                            </div>
                        ))}
                </PostsContainer>
            </main>
        </MainLayout>
    );
}