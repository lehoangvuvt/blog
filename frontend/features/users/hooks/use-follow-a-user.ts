import { useMutation } from "@tanstack/react-query";
import { followAUser } from "@/features/users/api/follow-a-user";

export default function useFollowAUser() {
  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const data = await followAUser(targetUserId);
      return data;
    },
  });
}
