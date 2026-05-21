import type { Post } from "@/features/posts/types";
import { apiClient } from "@/shared/api/client";

export const getUserLikedPosts = async (slug: string) => {
  const response = await apiClient.get(`/users/${slug}/liked-posts`);
  return response.data as Post[];
};
