// src/services/deals.ts
import { api } from "@/lib/axios";
import type { Deal, CreateDealData, UpdateDealData } from "@/types/deal";

interface DealMetrics {
  totalDeals: number;
  totalValue: number;
  avgDealValue: number;
  dealsByStage: {
    [key: string]: {
      count: number;
      value: number;
    };
  };
}

export const dealsService = {
  async list() {
    const response = await api.get<Deal[]>("/deals");
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<Deal>(`/deals/${id}`);
    return response.data;
  },

  async create(data: CreateDealData) {
    const response = await api.post<Deal>("/deals", data);
    return response.data;
  },

  async update(id: string, data: UpdateDealData) {
    const response = await api.patch<Deal>(`/deals/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/deals/${id}`);
  },

  async getMetrics() {
    const response = await api.get<DealMetrics>("/deals/pipeline-metrics");
    return response.data;
  },
};
