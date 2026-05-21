import { useQuery } from "@tanstack/react-query";
import { getUserRepostedPosts } from "@/features/users/api/get-user-reposted-posts";

export default function useUserRepostedPosts(slug: string, enabled = true) {
  return useQuery({
    queryKey: ["user-reposted-posts", slug],
    enabled: !!enabled && !!slug,
    queryFn: async () => {
      const repostedPosts = await getUserRepostedPosts(slug);
      return repostedPosts;
    },
  });
}
