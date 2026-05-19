import { useMutation } from "@tanstack/react-query";
import type { CreatePostCommentPayload } from "@/features/posts/types";
import { createPostComment } from "@/features/posts/api/create-post-comment";

export function useCreatePostComment() {
  return useMutation({
    mutationFn: async (payload: CreatePostCommentPayload) => {
      const data = await createPostComment(payload);
      return data;
    },
  });
}
