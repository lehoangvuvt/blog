/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import MainLayout from "@/shared/components/layout/main-layout/main-layout";
import PostsContainer from "@/features/posts/components/posts-container";
import { PostItem } from "@/features/posts/components/post-item";
import { useCallback, useEffect, useState } from "react";
import { getPosts } from "@/features/posts/api/get-posts";
import { AppSettingsModal } from "@/features/app-settings/components/app-settings-modal";

type Post = {
  id: string;
  title: string;
  subTitle?: string;
  thumbnailImage?: string | null;
  postedDate: string;
  author?: {
    id: string;
    email: string;
  };
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = useCallback(
    async (pageToFetch: number) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        const response = await getPosts({
          page: pageToFetch,
          limit: 10,
          published: true,
          sortBy: "latest",
        });

        const newPosts = response.data.data;
        const meta = response.data.meta;

        setPosts((prev) =>
          pageToFetch === 1 ? newPosts : [...prev, ...newPosts]
        );

        setPage(meta.nextPage ?? pageToFetch);
        setHasMore(meta.hasMore);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchNextPage = () => {
    if (!hasMore || isLoading) return;
    fetchPosts(page);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <MainLayout>
        <main className="mx-auto w-full max-w-5xl p-8">
          <PostsContainer
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={fetchNextPage}
          >
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

                  <PostItem.Title>{post.title}</PostItem.Title>

                  <PostItem.SubTitle>{post.subTitle}</PostItem.SubTitle>
                </PostItem.Content>

                <PostItem.Thumbnail
                  src={post.thumbnailImage ?? ""}
                  alt="Post thumbnail"
                />
              </PostItem.Container>
            ))}

            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <PostItem.Skeleton key={index} />
              ))}
          </PostsContainer>
        </main>
      </MainLayout>
    </div>
  );
}
