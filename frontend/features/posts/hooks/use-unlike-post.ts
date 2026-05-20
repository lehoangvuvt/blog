import { useMutation } from "@tanstack/react-query";
import { unlikePost } from "@/features/posts/api/unlike-post";

export function useUnlikePost() {
  return useMutation({
    mutationFn: async (postId: number) => {
      return await unlikePost(postId);
    },
  });
}
