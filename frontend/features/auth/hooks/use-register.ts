import { useMutation } from "@tanstack/react-query";
import type { RegisterPayload } from "@/features/auth/types";
import { register } from "@/features/auth/api/register";

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const data = await register(payload);
      return data;
    },
  });
}
