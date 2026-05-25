import type { Post } from "@/features/posts/types";

export type GetUserInfoResponse = {
  id: string;
  slug: string;
  avatar: string | null;
  introduction: string | null;
  fullName: string;
  createdAt: string;
  backgroundImage: string | null;
  statistics: {
    postsCount: number;
    followersCount: number;
  };
  social: {
    facebook: string | null;
    x: string | null;
    linkedin: string | null;
    website: string | null;
    youtube: string | null;
  };
  followers: PublicUserInfo[];
  followings: PublicUserInfo[];
};

export type GetMeResponse = {
  savedPostIds: number[];
} & GetUserInfoResponse;

export type PublicUserInfo = {
  id: string;
  slug: string;
  email: string;
  fullName: string;
  avatar: string;
  introduction: string;
  createdAt: string;
};

export type UpdateProfilePayload = {
  fullName?: string;
  slug?: string;
  email?: string;
  avatarUrl?: string;
  backgroundImage?: string;
  introduction?: string;
  facebookLink?: string;
  xLink?: string;
  youtubeLink?: string;
  linkedinLink?: string;
  websiteLink?: string;
};

export type ReadingHistoryItem = {
  readAt: string;
  post: Post;
};
