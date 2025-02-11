// src/services/notes.ts
import { api } from "@/lib/axios";
import { CreateNoteData, Note } from "@/types/note";

export const notesService = {
  async create(data: CreateNoteData): Promise<Note> {
    const response = await api.post<Note>("/notes", data);
    return response.data;
  },

  async delete(noteId: string): Promise<void> {
    await api.delete(`/notes/${noteId}`);
  },

  async listByClient(clientId: string): Promise<Note[]> {
    const response = await api.get<{ notes: Note[] }>("/notes", {
      params: { clientId },
    });
    return response.data.notes;
  },

  async listByDeal(dealId: string): Promise<Note[]> {
    const response = await api.get<{ notes: Note[] }>("/notes", {
      params: { dealId },
    });
    return response.data.notes;
  },
};
