import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowTag } from "@/features/tags/api/unfollow-tag";
import type { Tag } from "../types";
import type { MeQueryData } from "@/features/posts/types";

export default function useUnfollowTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: Tag) => {
      const data = await unfollowTag(tag.id);
      return data;
    },

    onMutate: async (tagToUnfollow: Tag) => {
      queryClient.cancelQueries({ queryKey: ["me"] });

      const previousMe = queryClient.getQueryData<MeQueryData>(["me"]);

      queryClient.setQueryData<MeQueryData>(["me"], (old) => {
        if (!old) return old;

        return {
          ...old,
          followedTagIds: old.followedTagIds.filter((id) => id !== tagToUnfollow.id),
        };
      });

      return { previousMe };
    },

    onError: (_error, _postId, context) => {
      queryClient.setQueryData(["me"], context?.previousMe);
    },
  });
}
