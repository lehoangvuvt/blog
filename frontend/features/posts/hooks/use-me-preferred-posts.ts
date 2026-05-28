import { useInfiniteQuery } from "@tanstack/react-query";
import { getMePreferredPosts } from "../api/get-me-preferred-posts";

export default function useMePreferredPosts(limit = 8, enabled = false) {
  return useInfiniteQuery({
    queryKey: ["me-preferred-posts", limit],
    enabled: Boolean(enabled),
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return await getMePreferredPosts(pageParam, limit);
    },

    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasMore ? lastPage.meta.nextPage : undefined;
    },
  });
}
