import { useMutation } from "@tanstack/react-query";
import { unRepost } from "@/features/posts/api/un-repost";

export function useUnRepost() {
  return useMutation({
    mutationFn: async (postId: number) => {
      return await unRepost(postId);
    },
  });
}
