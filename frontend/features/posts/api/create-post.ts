import { apiClient } from "@/shared/api/client";
import { CreatePostInput } from "../types";

export const createPost = async (data: CreatePostInput) => {
  return await apiClient.post("/posts", data);
};
