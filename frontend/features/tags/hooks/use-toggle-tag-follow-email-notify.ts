import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTagFollowNotify } from "@/features/tags/api/toggle-tag-follow-email-notify";
import type { Tag } from "@/features/tags/types";
import type { MeQueryData } from "@/features/posts/types";

export default function useToggleTagFollowEmailNotify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { tag: Tag; state: "on" | "off" }) => {
      return toggleTagFollowNotify(params.tag.id, params.state);
    },

    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["me"] });

      const previousMe = queryClient.getQueryData<MeQueryData>(["me"]);

      queryClient.setQueryData<MeQueryData>(["me"], (old) => {
        if (!old?.followedTags) return old;

        return {
          ...old,
          followedTags: old.followedTags.map((tag) =>
            tag.id === params.tag.id
              ? {
                  ...tag,
                  isEmailNotify: params.state === "on",
                }
              : tag
          ),
        };
      });

      return { previousMe };
    },

    onError: (_error, _params, context) => {
      if (context?.previousMe) {
        queryClient.setQueryData(["me"], context.previousMe);
      }
    },
  });
}
