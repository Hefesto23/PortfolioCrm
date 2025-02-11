// src/lib/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Implementar refresh token
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await api.post("/auth/refresh-tokens", {
            refreshToken,
          });
          const { access } = response.data.tokens;
          localStorage.setItem("accessToken", access.token);
          error.config.headers.Authorization = `Bearer ${access.token}`;
          return api(error.config);
        } catch {
          // Redirecionar para login
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
