// src/modules/deals/interfaces/deal.interface.ts

import { DealStage } from "@prisma/client"

export interface ICreateDealDto {
  title: string
  value: number
  clientId: string
  userId: string
  closeDate?: Date
}

export interface IUpdateDealDto {
  title?: string
  value?: number
  stage?: DealStage
  closeDate?: Date
}

export interface IDealFilters {
  stage?: DealStage
  clientId?: string
  minValue?: number
  maxValue?: number
  assignedTo?: string
  search?: string
}
