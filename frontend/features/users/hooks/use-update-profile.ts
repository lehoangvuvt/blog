import { useMutation } from "@tanstack/react-query";
import type { UpdateProfilePayload } from "@/features/users/types";
import { updateProfile } from "@/features/users/api/update-profile";

export default function useUpdateProfile() {
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const data = await updateProfile(payload);
      return data;
    },
  });
}
