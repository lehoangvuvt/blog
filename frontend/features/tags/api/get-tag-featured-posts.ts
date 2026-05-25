import type { Post } from "@/features/posts/types";
import { apiClient } from "@/shared/api/client";

export const getTagFeaturedPosts = async (slug: string) => {
  const response = await apiClient.get(`/tags/${slug}/featured/posts`);
  return response.data as Post[];
};
