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
    email: string;
    slug: string;
    fullName?: string;
    avatar?: string;
  };
};

export type PostDetails = {
  title: string;
  subTitle?: string;
  htmlContent?: string;
  thumbnailImage?: string;
  createdAt?: string;
  author?: {
    email: string;
    slug: string;
    fullName?: string;
    avatar?: string;
  };
  tags?: Tag[];
  postsByAuthor: {
    title: string;
    slug: string;
    subTitle?: string | null;
    thumbnailImage?: string | null;
  }[];
};

export type Tag = {
  id: string;
  name: string;
};
