// src/types/note.ts
export interface Note {
  id: string;
  content: string;
  clientId?: string;
  dealId?: string;
  userId: string;
  createdAt: string;
}

export interface CreateNoteData {
  content: string;
  clientId?: string;
  dealId?: string;
}
