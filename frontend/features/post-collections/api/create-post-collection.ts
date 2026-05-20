import { apiClient } from "@/shared/api/client";
import type { CreatePostCollectionPayload } from "@/features/post-collections/types";

export const createPostCollection = async (
  payload: CreatePostCollectionPayload
) => {
  const response = await apiClient.post("/post-collections", payload);
  return response.data;
};
