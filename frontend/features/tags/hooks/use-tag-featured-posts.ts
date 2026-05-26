import { useQuery } from "@tanstack/react-query";
import { getTagFeaturedPosts } from "@/features/tags/api/get-tag-featured-posts";

export default function useTagFeaturedPosts(slug: string, enabled = true) {
  return useQuery({
    queryKey: ["tag-featured-posts", slug],
    enabled: Boolean(enabled),
    queryFn: async () => {
      const data = await getTagFeaturedPosts(slug);
      return data;
    },
  });
}
