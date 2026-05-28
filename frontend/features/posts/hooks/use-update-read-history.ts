import { useMutation } from "@tanstack/react-query";
import { updateReadHistory } from "@/features/posts/api/update-read-history";

export default function useUpdateReadHistory() {
  return useMutation({
    mutationFn: async (params: { postId: number; progress?: number }) => {
      const data = await updateReadHistory(params.postId, params.progress || 0);
      return data;
    },
  });
}
