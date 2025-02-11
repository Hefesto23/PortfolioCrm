// src/hooks/useNotes.ts
import { notesService } from "@/services/notes";
import type { CreateNoteData } from "@/types/note";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useNotes(clientId?: string, dealId?: string) {
  const queryClient = useQueryClient();

  const notes = useQuery({
    queryKey: ["notes", { clientId, dealId }],
    queryFn: () => {
      if (clientId) return notesService.listByClient(clientId);
      if (dealId) return notesService.listByDeal(dealId);
      return Promise.resolve([]);
    },
    enabled: Boolean(clientId || dealId),
  });

  const createNote = useMutation({
    mutationFn: (data: CreateNoteData) => notesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", { clientId, dealId }],
      });
    },
  });

  const deleteNote = useMutation({
    mutationFn: (id: string) => notesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", { clientId, dealId }],
      });
    },
  });

  return {
    notes,
    createNote,
    deleteNote,
  };
}
