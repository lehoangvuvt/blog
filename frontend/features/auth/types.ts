type IAuthFormInput = {
  email: string;
  password?: string;
  fullName?: string;
};

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
};

export type {
  RegisterPayload,
  RegisterResponse,
  IAuthFormInput,
  LoginResponse,
  LoginPayload,
  User,
};
