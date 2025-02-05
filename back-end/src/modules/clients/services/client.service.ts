// src/modules/clients/services/client.service.ts

import ApiError from "@shared/error/api.error"
import httpStatus from "http-status"
import {
  ICreateClientDto,
  IUpdateClientDto,
  IClientFilters,
} from "../interfaces/client.interface"
import { ClientRepository } from "../repositories/client.repository"

class ClientService {
  private clientRepository: ClientRepository

  constructor() {
    this.clientRepository = new ClientRepository()
  }

  async createClient(createClientDto: ICreateClientDto) {
    // Verificar se já existe um cliente com o mesmo email
    const existingClient = await this.clientRepository.findByEmail(
      createClientDto.email,
    )
    if (existingClient) {
      throw new ApiError("Email já está cadastrado", httpStatus.CONFLICT) // 409 Conflict
    }

    return this.clientRepository.create(createClientDto)
  }

  async getClientById(id: string) {
    const client = await this.clientRepository.findById(id)
    if (!client) {
      throw new ApiError("Cliente não encontrado", httpStatus.NOT_FOUND)
    }
    return client
  }

  async getClients(filters: IClientFilters) {
    return this.clientRepository.findAll(filters)
  }

  async updateClient(id: string, updateClientDto: IUpdateClientDto) {
    await this.getClientById(id) // Verifica se o cliente existe
    return this.clientRepository.update(id, updateClientDto)
  }

  async deleteClient(id: string) {
    await this.getClientById(id) // Verifica se o cliente existe
    return this.clientRepository.delete(id)
  }
}

export default new ClientService()
