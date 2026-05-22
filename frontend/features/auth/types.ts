import type { PublicUserInfo } from "@/features/users/types";

interface IAuthFormInput {
  email: string;
  password?: string;
  fullName?: string;
  agreeTerms?: boolean;
}

type RegisterPayload = {
  token: string;
  password: string;
  fullName: string;
};

type RegisterResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
};

type LoginResponse = {
  token: string;
  user: {
    fullName: string;
    avatar: string | null;
    email: string;
    slug: string;
    createdAt: string;
  };
};

type LoginPayload = {
  email: string;
  password: string;
};

type User = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  slug: string;
  followers: PublicUserInfo[];
  followings: PublicUserInfo[];
  savedPostIds: number[];
};

export type {
  RegisterPayload,
  RegisterResponse,
  IAuthFormInput,
  LoginResponse,
  LoginPayload,
  User,
};
