import { apiClient } from "@/shared/api/client";

export const sendVerifyEmail = async (email: string) => {
  return await apiClient.post("/auth/register/email", { email });
};
