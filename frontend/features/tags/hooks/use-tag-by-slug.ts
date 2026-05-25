import { useQuery } from "@tanstack/react-query";
import { getTagBySlug } from "@/features/tags/api/get-tag-by-slug";

export default function useTagBySlug(slug: string) {
  return useQuery({
    queryKey: ["tag-info", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const data = await getTagBySlug(slug);
      return data;
    },
  });
}
