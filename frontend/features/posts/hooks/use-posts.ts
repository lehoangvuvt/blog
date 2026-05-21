import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/features/posts/api/get-posts";
import type { GetPostsParams } from "@/features/posts/types";

export function usePosts(
  params: Omit<GetPostsParams, "page">,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: [
      "posts",

      params.search ?? null,
      params.tag ?? null,

      params.authorId ?? null,

      params.authorIds?.join(",") ?? null,

      params.published ?? null,
      params.sortBy ?? "latest",
      params.limit ?? 10,
    ],

    queryFn: ({ pageParam = 1 }) =>
      getPosts({
        ...params,
        page: pageParam as number,
      }),

    initialPageParam: 1,

    enabled,

    getNextPageParam: (lastPage) => lastPage.meta.nextPage,

    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}