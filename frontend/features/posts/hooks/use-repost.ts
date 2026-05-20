import { useMutation } from "@tanstack/react-query";
import { repost } from "@/features/posts/api/repost";

export function useRepost() {
  return useMutation({
    mutationFn: async (postId: number) => {
      return await repost(postId);
    },
  });
}
