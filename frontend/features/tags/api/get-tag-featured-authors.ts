import { apiClient } from "@/shared/api/client";
import type { FeaturedAuthor } from "@/features/tags/types";

export const getTagFeaturedAuthors = async (slug: string) => {
  const response = await apiClient.get(`/tags/${slug}/featured/authors`);
  return response.data as FeaturedAuthor[];
};
