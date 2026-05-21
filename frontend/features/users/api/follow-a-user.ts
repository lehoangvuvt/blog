import { apiClient } from "@/shared/api/client"

export const followAUser = async (targetUserId: string) => {
    const response = await apiClient.post(`/users/${targetUserId}/follow`);
    return response.data;
}