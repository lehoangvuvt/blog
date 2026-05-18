import { apiClient } from "@/shared/api/client";
import axios from "axios";

export const sendVerifyEmail = async (email: string) => {
  try {
    await apiClient.post("/auth/register/email", { email });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message;
      throw new Error(message);
    }
  }
};
