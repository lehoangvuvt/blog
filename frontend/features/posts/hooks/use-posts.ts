import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/features/posts/api/get-posts";
import type { GetPostsParams } from "@/features/posts/types";

export function usePosts(params: Omit<GetPostsParams, "page">) {
  return useInfiniteQuery({
    queryKey: [
      "posts",
      params.limit,
      params.published,
      params.sortBy,
      params.tag ?? null,
    ],

    queryFn: ({ pageParam = 1 }) =>
      getPosts({
        ...params,
        page: pageParam as number,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => lastPage.meta.nextPage,

    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
