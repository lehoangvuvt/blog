"use client";

import { useMe } from "@/features/auth/hooks/use-me";
import useUpdateReadHistory from "@/features/posts/hooks/use-update-read-history";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";

export default function ViewHandler({ postId }: { postId: number }) {
  const queryClient = useQueryClient();
  const { data: meData } = useMe();

  const viewedPostId = useRef<number | null>(null);
  const readingHistoryPostId = useRef<number | null>(null);

  const { mutate: updateReadHistory } = useUpdateReadHistory();

  useEffect(() => {
    if (viewedPostId.current === postId) return;

    viewedPostId.current = postId;

    axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/post-statistics/${postId}/view`
    );
  }, [postId]);

  useEffect(() => {
    if (!meData?.id) return;
    if (readingHistoryPostId.current === postId) return;

    updateReadHistory(postId, {
      onSuccess: async () => {
        readingHistoryPostId.current = postId;

        await queryClient.invalidateQueries({
          queryKey: ["me-reading-histories"],
        });
      },
    });
  }, [postId, meData?.id, updateReadHistory, queryClient]);

  return null;
}