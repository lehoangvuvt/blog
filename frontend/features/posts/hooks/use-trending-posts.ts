import type { TrendingTimeRange } from "@/features/posts/types";
import { useQuery } from "@tanstack/react-query";
import { getTrendingPosts } from "@/features/posts/api/get-trending-posts";

export default function useTrendingPosts(timeRange: TrendingTimeRange) {
  return useQuery({
    queryKey: ["trending-posts", timeRange],
    queryFn: async () => {
      const data = await getTrendingPosts(timeRange);
      return data;
    },
  });
}
