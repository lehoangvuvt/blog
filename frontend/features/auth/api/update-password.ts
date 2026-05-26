import { apiClient } from "@/shared/api/client";

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const response = await apiClient.put("/auth/password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};
