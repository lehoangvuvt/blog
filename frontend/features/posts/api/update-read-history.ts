import { apiClient } from "@/shared/api/client";

export const updateReadHistory = async (postId: number, progress: number) => {
  const response = await apiClient.post(`/posts/${postId}/read`, { progress });
  return response.data;
};
