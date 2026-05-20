import type { Post } from "@/features/posts/types";

export type CreatePostCollectionPayload = {
  name: string;
  description: string;
};

export type PostCollection = {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  posts: Post[];
  slug: string;
};
