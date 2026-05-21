import { apiClient } from "@/shared/api/client";
import axios from "axios";

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
  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};
