export type PaginationResponse<T> = {
    data: Array<T>;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
        nextPage: number | null;
    }
}