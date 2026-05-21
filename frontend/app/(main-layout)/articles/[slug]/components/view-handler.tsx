"use client";

import axios from "axios";
import { useEffect, useRef } from "react";

export default function ViewHandler({ postId }: { postId: number }) {
  const trackedPostId = useRef<number | null>(null);

  useEffect(() => {
    if (trackedPostId.current === postId) return;

    trackedPostId.current = postId;

    (async () => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/post-statistics/${postId}/view`
      );
    })();
  }, [postId]);

  return null;
}
