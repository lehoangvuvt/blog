import { useMutation } from "@tanstack/react-query";
import { sendVerifyEmail } from "@/features/auth/api/send-verify-email";

export function useSendVerifyEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const data = await sendVerifyEmail(email);
      return data;
    },
  });
}
