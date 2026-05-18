import { useMutation } from "@tanstack/react-query";
import { login } from "@/features/auth/api/login";
import type { LoginPayload } from "@/features/auth/types";

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await login(payload);
      return data;
    },
  });
}
