import { apiClient } from "@/shared/api/client";
import type { Tag } from "@/features/tags/types";

export const getTagBySlug = async (slug: string) => {
  const response = await apiClient.get(`/tags/${slug}`);
  return response.data as Tag;
};
