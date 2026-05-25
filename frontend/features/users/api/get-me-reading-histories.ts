import { apiClient } from "@/shared/api/client";
import type { ReadingHistoryItem } from "@/features/users/types";

export const getMeReadingHistories = async () => {
  const response = await apiClient("/users/me/reading-histories");
  return response.data as ReadingHistoryItem[];
};