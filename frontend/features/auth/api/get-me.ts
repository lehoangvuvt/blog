import type { User } from "@/features/auth/types";
import { apiClient } from "@/shared/api/client";

export async function getMe(): Promise<User> {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/me`
    );
    return res.data as User;
  } catch {
    throw new Error("Fail to get user info");
  }
}
