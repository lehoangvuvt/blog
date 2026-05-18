import { apiClient } from "@/shared/api/client";
import type { LoginPayload, LoginResponse } from "@/features/auth/types";
import type { AxiosResponse } from "axios";

export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post<
    LoginPayload,
    AxiosResponse<LoginResponse>
  >("/auth/login", payload);
  return response.data;
};
