export type CreatePostInput = {
  title: string;
  jsonContent: string;
  htmlContent: string;
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

export type Post = {
  id: string;
  title: string;
  subTitle?: string;
  thumbnailImage?: string | null;
  postedDate: string;
  slug: string;
  author?: {
    id: string;
    email: string;
  };
};