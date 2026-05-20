import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/features/users/api/get-user-info";

export function useUserInfo(slug: string) {
  return useQuery({
    queryKey: ["user-info", slug],
    queryFn: async () => {
      const data = await getUserInfo(slug);
      return data;
    },
  });
}
