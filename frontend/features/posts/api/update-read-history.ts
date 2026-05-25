import { apiClient } from "@/shared/api/client";

export const updateReadHistory = async (postId: number) => {
  const response = await apiClient.post(`/posts/${postId}/read`);
  return response.data;
};
