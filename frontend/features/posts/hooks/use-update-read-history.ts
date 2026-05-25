import { useMutation } from "@tanstack/react-query";
import { updateReadHistory } from "@/features/posts/api/update-read-history";

export default function useUpdateReadHistory() {
  return useMutation({
    mutationFn: async (postId: number) => {
      const data = await updateReadHistory(postId);
      return data;
    },
  });
}
