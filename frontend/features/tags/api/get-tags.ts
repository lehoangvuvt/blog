import { apiClient } from "@/shared/api/client";
import type { GetTagsParams } from "@/features/tags/types";

export const getTags = async (params: GetTagsParams) => {
  const response = await apiClient.get("/tags", {
    params: { ...params, ids: params.ids?.join(",") },
  });
  return response.data;
};
