import { apiClient } from "@/shared/api/client";
import type { Post } from "@/features/posts/types";
import { PaginationResponse } from "@/shared/types/types";

export const getMePreferredPosts = async (page = 1, limit = 8) => {
  const response = await apiClient.get("/posts/preferred", {
    params: {
      page,
      limit,
    },
  });
  return response.data as PaginationResponse<Post>;
};
