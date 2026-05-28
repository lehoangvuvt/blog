import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followTag } from "@/features/tags/api/follow-tag";
import type { Tag } from "@/features/tags/types";
import type { MeQueryData } from "@/features/posts/types";

export default function useFollowTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagToFollow: Tag) => {
      const data = await followTag(tagToFollow.id);
      return data;
    },

    onMutate: async (tagToFollow: Tag) => {
      queryClient.cancelQueries({ queryKey: ["me"] });

      const previousMe = queryClient.getQueryData<MeQueryData>(["me"]);

      queryClient.setQueryData<MeQueryData>(["me"], (old) => {
        if (!old) return old;

        return {
          ...old,
          followedTags: [
            ...old.followedTags,
            {
              id: tagToFollow.id,
              isEmailNotify: false,
            },
          ],
        };
      });

      return { previousMe };
    },

    onError: (_error, _postId, context) => {
      queryClient.setQueryData(["me"], context?.previousMe);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me-preferred-posts"] });
    },
  });
}
