import { apiClient } from "@/shared/api/client";

export const getUploadPresignedUrl = async (
  fileName: string,
  mimeType: string
) => {
  const response = await apiClient.post("/files/upload-url", {
    fileName,
    mimeType,
  });
  return response.data;
};

export const uploadFile = async (file: File, presignedUrl: string) => {
  await apiClient.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};
