import { useQuery } from "@tanstack/react-query";
import { getTagFeaturedPosts } from "@/features/tags/api/get-tag-featured-posts";

export default function useTagFeaturedPosts(slug: string) {
  return useQuery({
    queryKey: ["tag-featured-posts", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const data = await getTagFeaturedPosts(slug);
      return data;
    },
  });
}
