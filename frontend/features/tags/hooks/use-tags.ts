import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getTags } from "@/features/tags/api/get-tags";
import type { GetTagsParams, GetTagsResponse } from "@/features/tags/types";

export function useTags(params?: Omit<GetTagsParams, "page">, enabled = true) {
  return useInfiniteQuery<GetTagsResponse>({
    queryKey: ["tags", params],

    queryFn: ({ pageParam = 1 }) => {
      return getTags({
        ...params,
        page: pageParam as number,
      });
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextPage;
    },

    enabled,

    placeholderData: keepPreviousData,
  });
}
