import { apiClient } from "@/shared/api/client";
import type { LoginPayload, LoginResponse } from "@/features/auth/types";
import type { AxiosResponse } from "axios";
import axios from "axios";

export const login = async (payload: LoginPayload) => {
  try {
    const response = await apiClient.post<
      LoginPayload,
      AxiosResponse<LoginResponse>
    >("/auth/login", payload);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data.message;
      throw new Error(msg);
    }
    throw new Error("Cannot login. Please try again")
  }
};
