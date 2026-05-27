import { apiClient } from "@/shared/api/client";

export async function getUserPostHighlights(postId: number) {
  const res = await apiClient.get(`/posts/${postId}/highlights`);
  return res.data;
}