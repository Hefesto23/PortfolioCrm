// src/hooks/useDeals.ts
import { dealsService } from "@/services/deals";
import { CreateDealData, UpdateDealData } from "@/types/deal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDeals() {
  const queryClient = useQueryClient();

  // Query principal para buscar todos os deals
  const {
    data,
    isLoading: dealsLoading,
    error: dealsError,
    refetch: refetchDeals,
  } = useQuery({
    queryKey: ["deals"],
    queryFn: dealsService.list,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query para métricas dos deals
  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery({
    queryKey: ["dealMetrics"],
    queryFn: dealsService.getMetrics,
    staleTime: 1000 * 60 * 5,
  });

  // Mutation para criar um novo deal
  const createDeal = useMutation({
    mutationFn: (data: CreateDealData) => dealsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["dealMetrics"] });
    },
  });

  // Mutation para atualizar um deal
  const updateDeal = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDealData }) =>
      dealsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["dealMetrics"] });
    },
  });

  // Mutation para deletar um deal
  const deleteDeal = useMutation({
    mutationFn: (id: string) => dealsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["dealMetrics"] });
    },
  });

  return {
    deals: {
      data,
      isLoading: dealsLoading,
      error: dealsError,
      refetch: refetchDeals,
    },
    dealMetrics: {
      data: metricsData,
      isLoading: metricsLoading,
      error: metricsError,
    },
    createDeal,
    updateDeal,
    deleteDeal,
    // Para compatibilidade com a interface que você está usando
    isLoading: dealsLoading || metricsLoading,
    error: dealsError || metricsError,
  };
}
