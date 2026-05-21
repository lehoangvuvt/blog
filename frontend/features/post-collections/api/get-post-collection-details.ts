import { apiClient } from "@/shared/api/client";

export const getPostCollectionDetails = async (slug: string) => {
  const response = await apiClient.get(`/post-collections/${slug}`);
  return response.data;
};
