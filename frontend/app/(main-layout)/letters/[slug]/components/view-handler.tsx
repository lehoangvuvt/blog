"use client";

import { apiClient } from "@/shared/api/client";
import { useEffect, useRef } from "react";

export default function ViewHandler({ postId }: { postId: number }) {
  const viewedPostId = useRef<number | null>(null);

  useEffect(() => {
    if (viewedPostId.current === postId) return;

    viewedPostId.current = postId;

    apiClient.post(`/post-statistics/${postId}/view`);
  }, [postId]);

  return null;
}
