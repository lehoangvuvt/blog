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

export type PublicUserInfo = {
  id: string;
  slug: string;
  email: string;
  fullName: string;
  avatar: string;
  introduction: string;
  createdAt: string;
}