import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePost } from "@/features/posts/api/save-post";
import type { MeQueryData, MutationContext } from "@/features/posts/types";

export default function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, number, MutationContext>({
    mutationFn: async (postId: number) => {
      const data = await savePost(postId);
      return data;
    },

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["me"] });

      const previousMe = queryClient.getQueryData<MeQueryData>(["me"]);

      queryClient.setQueryData<MeQueryData>(["me"], (old) => {
        if (!old) return old;

        return {
          ...old,
          savedPostIds: Array.from(
            new Set([...(old.savedPostIds ?? []), postId])
          ),
        };
      });

      return { previousMe };
    },

    onError: (_error, _postId, context) => {
      queryClient.setQueryData(["me"], context?.previousMe);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-saved-posts"] });
    },
  });
}
