import { apiClient } from "@/shared/api/client";
import axios from "axios";

export const unlikePost = async (postId: number) => {
  try {
    const response = await apiClient.delete(`/posts/${postId}/like`);
    const data = response.data;
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data.message;
      throw new Error(msg);
    }
    throw new Error("Cannot like post. Please try again.");
  }
};
