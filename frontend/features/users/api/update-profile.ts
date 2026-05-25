import type { UpdateProfilePayload } from "@/features/users/types";
import { apiClient } from "@/shared/api/client";

export const updateProfile = async (data: UpdateProfilePayload) => {
  try {
    const response = await apiClient.patch("/users/me/profile", data);
    return response.data;
  } catch {
    throw new Error("Failed to update profile");
  }
};
