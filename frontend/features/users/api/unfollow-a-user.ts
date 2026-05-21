import { apiClient } from "@/shared/api/client";

export const unfollowAUser = async (targetUserId: string) => {
  const response = await apiClient.delete(`/users/${targetUserId}/follow`);
  return response.data;
};
