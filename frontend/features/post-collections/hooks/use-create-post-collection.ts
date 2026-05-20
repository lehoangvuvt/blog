import type { CreatePostCollectionPayload } from "@/features/post-collections/types";
import { useMutation } from "@tanstack/react-query";
import { createPostCollection } from "@/features/post-collections/api/create-post-collection";

export default function useCreatePostCollection() {
  return useMutation({
    mutationFn: async (payload: CreatePostCollectionPayload) => {
      return await createPostCollection(payload);
    },
  });
}
