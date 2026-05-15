import { apiClient } from "@/shared/api/client";
import { GetPostsParams } from "../types";

export const getPosts = async (params?: GetPostsParams) => {
  return await apiClient.get("/posts", { params });
};
