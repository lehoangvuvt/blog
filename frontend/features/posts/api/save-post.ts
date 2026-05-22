import { apiClient } from "@/shared/api/client";

export const savePost = async (postId: number) => {
  const res = await apiClient.post(`/posts/${postId}/save`);
  const data = res.data;
  return data;
};
