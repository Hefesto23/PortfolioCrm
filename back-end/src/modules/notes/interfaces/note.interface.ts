// src/modules/notes/interfaces/note.interface.ts

import { Note, Role } from "@prisma/client"

export interface ICreateNoteDto {
  content: string
  userId: string
  clientId?: string
  dealId?: string
  role: Role
  type?: Note
}

export interface IUpdateNoteDto {
  content: string
}

export interface INoteFilters {
  clientId?: string
  dealId?: string
  userId?: string
  type?: Note
  startDate?: Date
  endDate?: Date
}
