import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (localStorage.getItem("accessToken")) {
    const accessToken = localStorage.getItem("accessToken");
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    config.headers.delete("Authorization");
  }
  return config;
});
