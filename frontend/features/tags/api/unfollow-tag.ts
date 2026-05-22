import { apiClient } from "@/shared/api/client";

export const unfollowTag = async (tagId: string) => {
  const response = await apiClient.delete(`/tags/${tagId}/follow`);
  return response.data;
};
