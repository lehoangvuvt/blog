import { apiClient } from "@/shared/api/client";
import type { GetPostCommentsResponse } from "@/features/posts/types";

export async function getPostComments(postId: number, page = 1, limit = 5) {
  const res = await apiClient.get(
    `/posts/${postId}/comments?page=${page}&limit=${limit}`,
  );
  return res.data as GetPostCommentsResponse;
}
