import { apiClient } from "@/shared/api/client";
import type { PostCollection } from "@/features/post-collections/types";

export const getPostCollections = async () => {
  const response = await apiClient.get("/post-collections");
  return response.data as PostCollection[];
};
