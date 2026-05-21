import { apiClient } from "@/shared/api/client";
import type { GetPostsParams, Post } from "@/features/posts/types";
import type { PaginationResponse } from "@/shared/types/types";

export const getPosts = async (params?: GetPostsParams) => {
  const response = await apiClient.get("/posts", {
    params: {
      ...params,
      authorIds: params?.authorIds?.length
        ? params.authorIds.join(",")
        : undefined,
    },
  });

  const data = response.data as PaginationResponse<Post>;

  return data;
};