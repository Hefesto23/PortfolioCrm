// src/modules/deals/repositories/deal.repository.ts

import prisma from "@config/prisma"
import { Deal, DealStage, Prisma } from "@prisma/client"
import { ICreateDealDto, IDealFilters } from "../interfaces/deal.interface"

export class DealRepository {
  async create(data: ICreateDealDto): Promise<Deal> {
    return prisma.deal.create({
      data: {
        title: data.title,
        value: data.value,
        assignedTo: { connect: { id: data.userId } },
        client: { connect: { id: data.clientId } },
        closeDate: data.closeDate,
        stage: DealStage.INITIAL_CONTACT,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
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

  async findById(id: string): Promise<Deal | null> {
    return prisma.deal.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        notes: true,
      },
    })
  }

  async findAll(filters: IDealFilters): Promise<Deal[]> {
    const where: Prisma.DealWhereInput = {}

    // Aplicando filtros
    if (filters.stage) {
      where.stage = filters.stage
    }

    if (filters.clientId) {
      where.clientId = filters.clientId
    }

    if (filters.assignedTo) {
      where.userId = filters.assignedTo
    }

    if (filters.minValue || filters.maxValue) {
      where.value = {}
      if (filters.minValue) {
        where.value.gte = filters.minValue
      }
      if (filters.maxValue) {
        where.value.lte = filters.maxValue
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { client: { name: { contains: filters.search, mode: "insensitive" } } },
        {
          client: {
            company: { contains: filters.search, mode: "insensitive" },
          },
        },
      ]
    }

    return prisma.deal.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: [{ stage: "asc" }, { value: "desc" }],
    })
  }

  async update(id: string, data: Prisma.DealUpdateInput): Promise<Deal> {
    return prisma.deal.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
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

  async delete(id: string): Promise<Deal> {
    return prisma.deal.delete({
      where: { id },
    })
  }

  async getDealsByStage() {
    const result = await prisma.$queryRaw<
      Array<{
        stage: DealStage
        count: bigint
        totalValue: Prisma.Decimal
      }>
    >`
      SELECT
        stage,
        COUNT(*)::bigint as count,
        COALESCE(SUM(value), 0) as "totalValue"
      FROM deals
      GROUP BY stage
      ORDER BY stage
    `

    return result
  }
}
