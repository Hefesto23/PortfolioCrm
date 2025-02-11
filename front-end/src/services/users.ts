// src/services/users.ts
import { api } from "@/lib/axios";
import type { User } from "@/types/auth";

interface UpdateUserData {
  nome?: string;
  email?: string;
  senha?: string;
}

export const usersService = {
  async list() {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateUserData) {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete<User>(`/users/${id}`);
    return response.data;
  },
};
