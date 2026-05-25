import { useQuery } from "@tanstack/react-query";
import { getMeReadingHistories } from "@/features/users/api/get-me-reading-histories";

export default function useMeReadingHistories(enabled = false) {
  return useQuery({
    queryKey: ["me-reading-histories"],
    enabled: !!enabled,
    queryFn: async () => {
      const data = await getMeReadingHistories();
      return data;
    },
  });
}
