// src/hooks/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { LoginCredentials, RegisterData } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUser, user } = useAuthContext();

  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.tokens.access.token);
      localStorage.setItem("refreshToken", data.tokens.refresh.token);
      setUser(data.user);
      navigate("/dashboard");
    },
  });

  const register = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.tokens.access.token);
      localStorage.setItem("refreshToken", data.tokens.refresh.token);
      setUser(data.user);
      navigate("/dashboard");
    },
  });

  const logout = useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.resolve();
      return authService.logout(refreshToken);
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      queryClient.clear();
      navigate("/login");
    },
  });

  const forgotPassword = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });

  const resetPassword = useMutation({
    mutationFn: ({ token, senha }: { token: string; senha: string }) =>
      authService.resetPassword(token, senha),
    onSuccess: () => {
      navigate("/login");
    },
  });

  return {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    user,
    isAuthenticated: !!user,
  };
}
