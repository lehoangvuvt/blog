import { apiClient } from "@/shared/api/client";
import type { GetTagsParams } from "@/features/tags/types";

export const getTags = async (params: GetTagsParams) => {
  const response = await apiClient.get("/tags", { params });
  return response.data;
};
