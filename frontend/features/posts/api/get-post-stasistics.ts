import { apiClient } from "@/shared/api/client";
import type { GetPostStasisticsResponse } from "@/features/posts/types";

export const getPostStatistics = async (postId: number) => {
  const response = await apiClient.get(`/posts/${postId}/statistics`);
  return response.data as GetPostStasisticsResponse;
};
