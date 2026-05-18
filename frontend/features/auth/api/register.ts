import { apiClient } from "@/shared/api/client";
import type { RegisterResponse, RegisterPayload } from "@/features/auth/types";
import type { AxiosResponse } from "axios";

export const register = async (payload: RegisterPayload) => {
  const response = await apiClient.post<
    RegisterPayload,
    AxiosResponse<RegisterResponse>
  >("/auth/register", payload);
  return response.data;
};
