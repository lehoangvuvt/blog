import { apiClient } from "@/shared/api/client";
import type { GetUserInfoResponse } from "@/features/users/types";

export const getUserInfo = async (slug: string) => {
  const response = await apiClient.get(`/users/${slug}`);
  return response.data as GetUserInfoResponse;
};
