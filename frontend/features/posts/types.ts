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
  id: number;
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

export type CreatePostCommentPayload = {
  postId: number;
  content: string;
  replyToCommentId?: string;
};

export type PostComment = {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    avatar: string | null;
  };
  replies: PostComment[];
  _count: {
    replies: number;
  };
};

export type GetPostCommentsResponse = {
  data: PostComment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    nextPage: number | null;
  };
};

export type GetPostStasisticsResponse = {
  likesCount: number;
  repostsCount: number;
  commentsCount: number;
  liked: boolean;
  reposted: boolean;
};
