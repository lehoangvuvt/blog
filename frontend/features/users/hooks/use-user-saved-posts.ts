import { useQuery } from "@tanstack/react-query";
import { getUserSavedPosts } from "@/features/users/api/get-user-saved-posts";

export default function useUserSavedPosts(enabled = false) {
  return useQuery({
    queryKey: ["user-saved-posts"],
    enabled: Boolean(enabled),
    queryFn: async () => {
      const data = await getUserSavedPosts();
      return data;
    },
  });
}
