import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followAUser } from "@/features/users/api/follow-a-user";
import { GetUserInfoResponse, PublicUserInfo } from "../types";
import { User } from "@/features/auth/types";

export default function useFollowAUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUser: GetUserInfoResponse) => {
      const data = await followAUser(targetUser.id);
      return data;
    },

    onMutate: async (targetUser: GetUserInfoResponse) => {
      await queryClient.cancelQueries({ queryKey: ["me"] });

      const prevMe = queryClient.getQueryData<User>(["me"]);

      queryClient.setQueryData<User>(["me"], (old) => {
        if (!old) return old;

        const _targetUser: PublicUserInfo = {
          avatar: targetUser.avatar || "",
          createdAt: targetUser.createdAt,
          fullName: targetUser.fullName,
          slug: targetUser.slug,
          id: targetUser.id,
          email: "",
          introduction: targetUser.introduction || "",
          statistics: {
            followersCount: targetUser.statistics.followersCount,
            postsCount: targetUser.statistics.postsCount,
          },
        };

        return {
          ...old,
          followings: [...old.followings, _targetUser],
        };
      });

      return { prevMe };
    },

    onError: (_error, _targetUser, context) => {
      queryClient.setQueryData(["me"], context?.prevMe);
    },
  });
}
