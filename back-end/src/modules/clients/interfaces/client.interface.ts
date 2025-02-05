// src/modules/clients/interfaces/client.interface.ts

import { ClientStatus } from "@prisma/client"

export interface ICreateClientDto {
  name: string
  email: string
  phone?: string
  company?: string
  userId: string
  status?: ClientStatus
}

export interface IUpdateClientDto {
  name?: string
  email?: string
  phone?: string
  company?: string
  status?: ClientStatus
}

export interface IClientFilters {
  status?: ClientStatus
  assignedTo?: string
  search?: string
}
