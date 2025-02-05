// src/modules/clients/repositories/client.repository.ts

import prisma from "@config/prisma"
import { Client, Prisma } from "@prisma/client"
import {
  IClientFilters,
  ICreateClientDto,
} from "../interfaces/client.interface"

export class ClientRepository {
  async create(data: ICreateClientDto): Promise<Client> {
    const { userId, ...clientData } = data
    return prisma.client.create({
      data: {
        ...clientData,
        assignedTo: { connect: { id: userId } },
      },
    })
  }

  async findByEmail(email: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { email },
    })
  }

  async findById(id: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    })
  }

  async findAll(filters: IClientFilters): Promise<Client[]> {
    const where: Prisma.ClientWhereInput = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.assignedTo) {
      where.userId = filters.assignedTo
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { company: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    return prisma.client.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async update(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
    return prisma.client.update({
      where: { id },
      data,
      include: {
        assignedTo: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    })
  }

  async delete(id: string): Promise<Client> {
    return prisma.client.delete({
      where: { id },
    })
  }
}
