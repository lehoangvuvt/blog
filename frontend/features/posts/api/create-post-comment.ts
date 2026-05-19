import type { CreatePostCommentPayload } from "@/features/posts/types";
import { apiClient } from "@/shared/api/client";
import axios from "axios";

export const createPostComment = async (payload: CreatePostCommentPayload) => {
  try {
    const response = await apiClient.post("/post-comments", payload);
    const data = response.data;
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data.message;
      throw new Error(msg);
    }
    throw new Error("Cannot comment to post. Please try again.");
  }
};
