// src/modules/notes/services/note.service.ts

import clientService from "@modules/clients/services/client.service"
import dealService from "@modules/deals/services/deal.service"
import { Note, Role } from "@prisma/client"
import ApiError from "@shared/error/api.error"
import httpStatus from "http-status"
import {
  ICreateNoteDto,
  INoteFilters,
  IUpdateNoteDto,
} from "../interfaces/note.interface"
import { NoteRepository } from "../repositories/note.repository"

class NoteService {
  private noteRepository: NoteRepository

  constructor() {
    this.noteRepository = new NoteRepository()
  }

  async createNote(createNoteDto: ICreateNoteDto): Promise<Note> {
    // Verificamos se a nota está associada a um cliente ou negócio existente
    if (createNoteDto.clientId) {
      await clientService.getClientById(createNoteDto.clientId)
    }

    if (createNoteDto.dealId) {
      const { userId, role } = createNoteDto
      await dealService.getDealById(createNoteDto.dealId, userId, role)
    }

    return this.noteRepository.create(createNoteDto)
  }

  async getNoteById(id: string, userId: string, userRole: Role): Promise<Note> {
    const note = await this.noteRepository.findById(id)
    if (!note) {
      throw new ApiError("Nota não encontrada", httpStatus.NOT_FOUND)
    }

    // Verificamos se o usuário tem acesso à nota
    if (userRole !== Role.ADMIN && note.userId !== userId) {
      const hasAccess = await this.userHasAccessToNote(note, userId)
      if (!hasAccess) {
        throw new ApiError("Acesso não autorizado", httpStatus.FORBIDDEN)
      }
    }

    return note
  }

  private async userHasAccessToNote(
    note: Note,
    userId: string,
  ): Promise<boolean> {
    if (note.clientId) {
      const client = await clientService.getClientById(note.clientId)
      if (client.userId === userId) return true
    }

    if (note.dealId) {
      const deal = await dealService.getDealById(note.dealId, userId, Role.USER)
      if (deal.userId === userId) return true
    }

    return false
  }

  async getNotes(
    filters: INoteFilters,
    userId: string,
    userRole: Role,
  ): Promise<{ notes: Note[] }> {
    // Se não for admin, só pode ver suas próprias notas ou notas de seus clientes/negócios
    if (userRole !== Role.ADMIN) {
      filters.userId = userId
    }

    const notes = await this.noteRepository.findAll(filters)
    return { notes }
  }

  async updateNote(
    id: string,
    updateNoteDto: IUpdateNoteDto,
    userId: string,
    userRole: Role,
  ): Promise<Note> {
    // Verificamos se a nota existe e se o usuário tem acesso
    const note = await this.getNoteById(id, userId, userRole)

    // Apenas o criador da nota ou um admin pode modificá-la
    if (userRole !== Role.ADMIN && note.userId !== userId) {
      throw new ApiError("Acesso não autorizado", httpStatus.FORBIDDEN)
    }

    return this.noteRepository.update(id, updateNoteDto)
  }

  async deleteNote(id: string, userId: string, userRole: Role): Promise<Note> {
    // Verificamos se a nota existe e se o usuário tem acesso
    const note = await this.getNoteById(id, userId, userRole)

    // Apenas o criador da nota ou um admin pode deletá-la
    if (userRole !== Role.ADMIN && note.userId !== userId) {
      throw new ApiError("Acesso não autorizado", httpStatus.FORBIDDEN)
    }

    return this.noteRepository.delete(id)
  }
}

export default new NoteService()
