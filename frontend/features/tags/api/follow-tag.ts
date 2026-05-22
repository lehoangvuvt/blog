import { apiClient } from "@/shared/api/client";

export const followTag = async (tagId: string) => {
  const response = await apiClient.post(`/tags/${tagId}/follow`);
  return response.data;
};
