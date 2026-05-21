import type { Post } from "@/features/posts/types"
import { apiClient } from "@/shared/api/client"

export const getUserRepostedPosts = async (slug: string) => {
    const response = await apiClient.get(`/users/${slug}/reposted-posts`)
    return response.data as Post[]
}