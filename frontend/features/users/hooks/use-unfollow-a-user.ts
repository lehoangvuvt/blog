import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowAUser } from "@/features/users/api/unfollow-a-user";
import { GetUserInfoResponse } from "../types";
import { User } from "@/features/auth/types";

export default function useUnfollowAUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUser: GetUserInfoResponse) => {
      const data = await unfollowAUser(targetUser.id);
      return data;
    },

    onMutate: async (targetUser: GetUserInfoResponse) => {
      await queryClient.cancelQueries({ queryKey: ["me"] });

      const prevMe = queryClient.getQueryData<User>(["me"]);

      queryClient.setQueryData<User>(["me"], (old) => {
        if (!old) return old;

        return {
          ...old,
          followings: old.followings.filter((old) => old.id !== targetUser.id),
        };
      });

      return { prevMe };
    },

    onError: (_err, _targetUser, context) => {
      queryClient.setQueryData(["me"], context?.prevMe);
    },
  });
}
