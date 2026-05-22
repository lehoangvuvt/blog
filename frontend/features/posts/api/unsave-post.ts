import { apiClient } from "@/shared/api/client";

export const unsavePost = async (postId: number) => {
  const res = await apiClient.delete(`/posts/${postId}/save`);
  const data = res.data;
  return data;
};
