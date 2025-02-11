// src/services/clients.ts
import { api } from "@/lib/axios";
import type {
  Client,
  CreateClientData,
  UpdateClientData,
} from "@/types/client";

export const clientsService = {
  async list() {
    const response = await api.get<Client[]>("/clients");
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  async create(data: CreateClientData) {
    const response = await api.post<Client>("/clients", data);
    return response.data;
  },

  async update(id: string, data: UpdateClientData) {
    const response = await api.patch<Client>(`/clients/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/clients/${id}`);
  },
};
