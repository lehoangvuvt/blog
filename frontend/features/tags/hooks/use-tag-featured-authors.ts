import { useQuery } from "@tanstack/react-query";
import { getTagFeaturedAuthors } from "@/features/tags/api/get-tag-featured-authors";

export default function useTagFeaturedAuthors(slug: string) {
  return useQuery({
    queryKey: ["tag-featured-authors", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const data = await getTagFeaturedAuthors(slug);
      return data;
    },
  });
}
