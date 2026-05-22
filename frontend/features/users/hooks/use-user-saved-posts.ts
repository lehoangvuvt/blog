import { useQuery } from "@tanstack/react-query";
import { getUserSavedPosts } from "@/features/users/api/get-user-saved-posts";

export default function useUserSavedPosts() {
  return useQuery({
    queryKey: ["user-saved-posts"],
    queryFn: async () => {
      const data = await getUserSavedPosts();
      return data;
    },
  });
}
