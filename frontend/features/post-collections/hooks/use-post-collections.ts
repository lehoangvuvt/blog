import { useQuery } from "@tanstack/react-query";
import { getPostCollections } from "@/features/post-collections/api/get-post-collections";

export default function usePostCollections(userId?: string, enabled = true) {
  return useQuery({
    queryKey: ["post-collections", userId],
    enabled: Boolean(userId) && enabled,
    queryFn: async () => {
      const data = await getPostCollections();
      return data;
    },
  });
}
