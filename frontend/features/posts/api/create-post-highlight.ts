import { apiClient } from "@/shared/api/client";
import type { HighlightRect } from "@/features/posts/types";

export async function createHighlight(payload: {
  postId: number;
  text: string;
  note?: string;
  rects: HighlightRect[];
}) {
  const res = await apiClient.post(
    `/posts/${payload.postId}/highlights`,
    payload,
  );
  return res.data;
}
