import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/features/auth/api/update-password";

export default function useUpdatePassword() {
  return useMutation({
    mutationFn: async (params: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return await updatePassword(params.currentPassword, params.newPassword);
    },
  });
}
