import { useQuery } from "@tanstack/react-query";
import { getUserLikedPosts } from "@/features/users/api/get-user-liked-posts";

export default function useUserLikedPosts(slug: string, enabled = true) {
  return useQuery({
    queryKey: ["user-liked-posts", slug],
    enabled: !!enabled && !!slug,
    queryFn: async () => {
      const likedPosts = await getUserLikedPosts(slug);
      return likedPosts;
    },
  });
}
