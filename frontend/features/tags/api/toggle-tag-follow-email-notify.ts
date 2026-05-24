import { apiClient } from "@/shared/api/client";

export const toggleTagFollowNotify = async (
  tagId: string,
  state: "on" | "off"
) => {
  if (state === "on") {
    const response = await apiClient.post(`/tags/${tagId}/follow/email-notify`);
    return response.data;
  } else {
    const response = await apiClient.delete(
      `/tags/${tagId}/follow/email-notify`
    );
    return response.data;
  }
};
