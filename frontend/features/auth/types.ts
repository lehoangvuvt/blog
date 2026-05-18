interface IAuthFormInput {
  email: string;
  password: string;
  fullName: string;
}

type RegisterPayload = {
  email: string;
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

export type {
  RegisterPayload,
  RegisterResponse,
  IAuthFormInput,
  LoginResponse,
  LoginPayload,
};
