import type {
  GetTrendingPostsResponse,
  TrendingTimeRange,
} from "@/features/posts/types";
import { apiClient } from "@/shared/api/client";

export const getTrendingPosts = async (
  timeRange: TrendingTimeRange,
  limit = 10,
  tag?: string
) => {
  const response = await apiClient.get(
    `/post-statistics/trending/${timeRange}?limit=${limit}${tag ? `&tag=${tag}` : ''}`
  );
  return response.data as GetTrendingPostsResponse;
};
