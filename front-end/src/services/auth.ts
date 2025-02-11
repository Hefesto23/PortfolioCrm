// src/services/auth.ts (atualizado)
import { api } from "@/lib/axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async logout(refreshToken: string) {
    await api.post("/auth/logout", { refreshToken });
  },

  async forgotPassword(email: string) {
    await api.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, senha: string) {
    await api.post("/auth/reset-password", { senha }, { params: { token } });
  },

  async refreshTokens(refreshToken: string) {
    const response = await api.post<AuthResponse>("/auth/refresh-tokens", {
      refreshToken,
    });
    return response.data;
  },
};
