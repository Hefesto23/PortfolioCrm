// src/hooks/useClients.ts
import { clientsService } from "@/services/clients";
import { CreateClientData, UpdateClientData } from "@/types/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useClients() {
  const queryClient = useQueryClient();

  // Query principal para buscar todos os clientes
  const {
    data,
    isLoading,
    error,
    refetch: refetchClients,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsService.list,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutation para criar um novo cliente
  const createClient = useMutation({
    mutationFn: (data: CreateClientData) => clientsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  // Mutation para atualizar um cliente
  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) =>
      clientsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  // Mutation para deletar um cliente
  const deleteClient = useMutation({
    mutationFn: (id: string) => clientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return {
    clients: {
      data,
      isLoading,
      error,
      refetch: refetchClients,
    },
    createClient,
    updateClient,
    deleteClient,
    // Para compatibilidade com a interface que você está usando
    isLoading,
    error,
  };
}
