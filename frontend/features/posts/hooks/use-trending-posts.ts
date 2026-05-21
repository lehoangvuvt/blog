import type { TrendingTimeRange } from "@/features/posts/types";
import { useQuery } from "@tanstack/react-query";
import { getTrendingPosts } from "@/features/posts/api/get-trending-posts";

export default function useTrendingPosts(
  timeRange: TrendingTimeRange,
  params?: { limit?: number; tag?: string },
) {
  return useQuery({
    queryKey: ["trending-posts", timeRange, params?.limit, params?.tag],
    queryFn: async () => {
      const data = await getTrendingPosts(
        timeRange,
        params?.limit,
        params?.tag,
      );
      return data;
    },
  });
}
