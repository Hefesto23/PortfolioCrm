// src/modules/deals/services/deal.service.ts

import clientService from "@modules/clients/services/client.service"
import { Deal, DealStage, Prisma, Role } from "@prisma/client"
import ApiError from "@shared/error/api.error"
import httpStatus from "http-status"
import {
  ICreateDealDto,
  IDealFilters,
  IUpdateDealDto,
} from "../interfaces/deal.interface"
import { DealRepository } from "../repositories/deal.repository"

class DealService {
  private dealRepository: DealRepository

  constructor() {
    this.dealRepository = new DealRepository()
  }

  async createDeal(createDealDto: ICreateDealDto): Promise<Deal> {
    // Primeiro verificamos se o cliente existe
    const client = await clientService.getClientById(createDealDto.clientId)
    if (!client) {
      throw new ApiError("Cliente não encontrado", httpStatus.NOT_FOUND)
    }

    // Verificamos se o valor é positivo
    if (createDealDto.value <= 0) {
      throw new ApiError(
        "O valor da oportunidade deve ser maior que zero",
        httpStatus.BAD_REQUEST,
      )
    }

    // Se houver data de fechamento, verificamos se é futura
    if (
      createDealDto.closeDate &&
      new Date(createDealDto.closeDate) < new Date()
    ) {
      throw new ApiError(
        "A data de fechamento deve ser futura",
        httpStatus.BAD_REQUEST,
      )
    }

    return this.dealRepository.create(createDealDto)
  }

  async getDealById(id: string, userId: string, userRole: Role): Promise<Deal> {
    const deal = await this.dealRepository.findById(id)
    if (!deal) {
      throw new ApiError("Oportunidade não encontrada", httpStatus.NOT_FOUND)
    }

    // Verificamos se o usuário tem acesso a esta oportunidade
    if (userRole !== Role.ADMIN && deal.userId !== userId) {
      throw new ApiError("Acesso não autorizado", httpStatus.FORBIDDEN)
    }

    return deal
  }

  async getDeals(
    filters: IDealFilters,
    userId: string,
    userRole: Role,
  ): Promise<Deal[]> {
    // Se não for admin, só pode ver suas próprias oportunidades
    if (userRole !== Role.ADMIN) {
      filters.assignedTo = userId
    }

    return this.dealRepository.findAll(filters)
  }

  async updateDeal(
    id: string,
    updateDealDto: IUpdateDealDto,
    userId: string,
    userRole: Role,
  ): Promise<Deal> {
    // Primeiro verificamos se a oportunidade existe e se o usuário tem acesso
    const deal = await this.getDealById(id, userId, userRole)

    // Validações específicas para atualização
    if (updateDealDto.value !== undefined && updateDealDto.value <= 0) {
      throw new ApiError(
        "O valor da oportunidade deve ser maior que zero",
        httpStatus.BAD_REQUEST,
      )
    }

    if (
      updateDealDto.closeDate &&
      new Date(updateDealDto.closeDate) < new Date()
    ) {
      throw new ApiError(
        "A data de fechamento deve ser futura",
        httpStatus.BAD_REQUEST,
      )
    }

    // Se estiver mudando para CLOSED_WON ou CLOSED_LOST, exigimos uma data de fechamento
    if (
      (updateDealDto.stage === DealStage.CLOSED_WON ||
        updateDealDto.stage === DealStage.CLOSED_LOST) &&
      !deal.closeDate &&
      !updateDealDto.closeDate
    ) {
      throw new ApiError(
        "Data de fechamento é obrigatória para oportunidades fechadas",
        httpStatus.BAD_REQUEST,
      )
    }

    return this.dealRepository.update(id, updateDealDto)
  }

  async deleteDeal(id: string, userId: string, userRole: Role): Promise<Deal> {
    // Verificamos se a oportunidade existe e se o usuário tem acesso
    await this.getDealById(id, userId, userRole)
    return this.dealRepository.delete(id)
  }

  async getDealSummaryByStage(): Promise<
    { stage: DealStage; count: number; totalValue: string }[]
  > {
    const result = await this.dealRepository.getDealsByStage()

    // Convertendo BigInt para Number e Decimal para String
    return result.map((item) => ({
      stage: item.stage,
      count: Number(item.count), // Convertendo BigInt para Number
      totalValue: item.totalValue.toString(), // Convertendo Decimal para String
    }))
  }

  async getPipelineMetrics(
    userId: string,
    userRole: Role,
  ): Promise<{
    totalDeals: number
    totalValue: string
    avgDealValue: string
    dealsByStage: { stage: DealStage; count: number; totalValue: string }[]
  }> {
    const deals = await this.getDeals({}, userId, userRole)

    const totalDeals = deals.length
    const totalValue = deals.reduce(
      (sum, deal) => sum.add(deal.value),
      new Prisma.Decimal(0),
    )
    const avgDealValue =
      totalDeals > 0 ? totalValue.dividedBy(totalDeals) : new Prisma.Decimal(0)

    const dealsByStage = await this.getDealSummaryByStage()

    return {
      totalDeals,
      totalValue: totalValue.toString(),
      avgDealValue: avgDealValue.toString(),
      dealsByStage,
    }
  }
}

export default new DealService()
