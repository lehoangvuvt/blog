import type { UpdateProfilePayload } from "@/features/users/types";
import { apiClient } from "@/shared/api/client";
import axios from "axios";

export const updateProfile = async (data: UpdateProfilePayload) => {
  try {
    const response = await apiClient.patch("/users/me/profile", data);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data.message);
    }

    throw new Error("Failed to update profile");
  }
};
