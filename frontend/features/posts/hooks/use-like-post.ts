import { useMutation } from "@tanstack/react-query";
import { likePost } from "@/features/posts/api/like-post";

export function useLikePost() {
  return useMutation({
    mutationFn: async (postId: number) => {
      return await likePost(postId);
    },
  });
}
