export type CreatePostInput = {
  title: string;
  content: string;
  subTitle: string;
  tags: string[];
  published: boolean;
  thumbnailImage?: string;
};

export type GetPostsParams = {
  search?: string;
  tag?: string;
  authorId?: string;
  published?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "latest" | "oldest";
};
