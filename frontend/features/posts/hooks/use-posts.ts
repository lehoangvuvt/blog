import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { getPosts } from "@/features/posts/api/get-posts";
import type { GetPostsParams, Post } from "@/features/posts/types";
import type { PaginationResponse } from "@/shared/types/types";

export const usePosts = (
  params?: Omit<GetPostsParams, "page">,
  enabled: boolean = true
) => {
  return useInfiniteQuery<
    PaginationResponse<Post>,
    Error,
    InfiniteData<PaginationResponse<Post>>,
    readonly unknown[],
    number
  >({
    queryKey: ["posts", "infinite", params],

    initialPageParam: 1,

    enabled: !!enabled,

    queryFn: ({ pageParam }) => {
      return getPosts({
        ...params,
        page: pageParam,
      });
    },

    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasMore
        ? lastPage.meta.nextPage ?? undefined
        : undefined;
    },
  });
};
