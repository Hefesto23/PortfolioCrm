// src/types/auth.ts
export interface User {
  id: string;
  nome: string;
  email: string;
  cnpj: string;
  role: "ADMIN" | "USER" | "FINANCEIRO" | "MARKETING";
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  cnpj: string;
  senha: string;
}

export interface AuthTokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}
