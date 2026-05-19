import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostComments } from "@/features/posts/api/get-post-comments";

type UsePostCommentsParams = {
  postId: number;
  limit?: number;
};

export function usePostComments({ postId, limit = 10 }: UsePostCommentsParams) {
  return useInfiniteQuery({
    queryKey: ["post-comments", postId, limit],
    initialPageParam: 1,
    enabled: !!postId,
    queryFn: ({ pageParam }) => getPostComments(postId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasMore ? lastPage.meta.nextPage : undefined;
    },
  });
}
