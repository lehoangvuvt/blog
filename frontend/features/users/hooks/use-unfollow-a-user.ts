import { useMutation } from "@tanstack/react-query";
import { unfollowAUser } from "@/features/users/api/unfollow-a-user";

export default function useUnfollowAUser() {
  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const data = await unfollowAUser(targetUserId);
      return data;
    },
  });
}
