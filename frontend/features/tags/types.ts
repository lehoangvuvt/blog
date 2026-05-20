export type GetTagsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type GetTagsResponse = {
  data: Tag[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    nextPage: number | null;
  };
};
