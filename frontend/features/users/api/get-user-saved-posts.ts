import type { Post } from "@/features/posts/types";
import { apiClient } from "@/shared/api/client";

export const getUserSavedPosts = async () => {
  const response = await apiClient.get("/users/me/saved-posts");
  const data = response.data;
  return data as Post[];
};
