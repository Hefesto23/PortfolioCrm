// src/modules/notes/repositories/note.repository.ts

import prisma from "@config/prisma"
import { Note, Prisma } from "@prisma/client"
import { ICreateNoteDto, INoteFilters } from "../interfaces/note.interface"

export class NoteRepository {
  async create(data: ICreateNoteDto): Promise<Note> {
    return prisma.note.create({
      data: {
        content: data.content,
        createdBy: { connect: { id: data.userId } },
        ...(data.clientId && { client: { connect: { id: data.clientId } } }),
        ...(data.dealId && { deal: { connect: { id: data.dealId } } }),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            value: true,
          },
        },
      },
    })
  }

  async findById(id: string): Promise<Note | null> {
    return prisma.note.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            value: true,
          },
        },
      },
    })
  }

  async findAll(filters: INoteFilters): Promise<Note[]> {
    const where: Prisma.NoteWhereInput = {}

    if (filters.clientId) {
      where.clientId = filters.clientId
    }

    if (filters.dealId) {
      where.dealId = filters.dealId
    }

    if (filters.userId) {
      where.userId = filters.userId
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate
      }
    }

    return prisma.note.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            value: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async update(id: string, data: Prisma.NoteUpdateInput): Promise<Note> {
    return prisma.note.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            value: true,
          },
        },
      },
    })
  }

  async delete(id: string): Promise<Note> {
    return prisma.note.delete({
      where: { id },
    })
  }
}
