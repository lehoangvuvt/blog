import { useQuery } from "@tanstack/react-query";
import { getPostStatistics } from "@/features/posts/api/get-post-stasistics";

export function usePostStatistics(postId: number) {
  return useQuery({
    queryKey: ["post-statistics", postId],
    queryFn: async () => {
      return await getPostStatistics(postId);
    },
    enabled: !!postId,
  });
}
