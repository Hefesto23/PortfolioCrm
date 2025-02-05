// src/modules/clients/controllers/client.controller.ts

import { ClientStatus, Role } from "@prisma/client"
import ApiError from "@shared/error/api.error"
import catchAsync from "@shared/http/middlewares/catch-async"
import httpStatus from "http-status"
import { IClientFilters } from "../interfaces/client.interface"
import clientService from "../services/client.service"

const createClient = catchAsync(async (req, res) => {
  // Pegamos os dados do corpo da requisição
  const { name, email, phone, company, status } = req.body
  // O userId vem do usuário autenticado
  const userId = req.user!.id

  const client = await clientService.createClient({
    name,
    email,
    phone,
    company,
    userId,
    status,
  })

  // Retornamos o cliente criado com status 201 (Created)
  res.status(httpStatus.CREATED).send(client)
})

const getClients = catchAsync(async (req, res) => {
  // Obtemos o papel e ID do usuário atual
  const { role, id: userId } = req.user!
  // Extraímos os filtros da query string
  const { status, search } = req.query

  // Montamos o objeto de filtros
  const filters: IClientFilters = {
    status: status as ClientStatus,
    search: search as string,
    // Se não for admin, só vê seus próprios clientes
    assignedTo: role === Role.ADMIN ? undefined : userId,
  }

  const clients = await clientService.getClients(filters)
  res.send(clients)
})

const getClient = catchAsync(async (req, res) => {
  const client = await clientService.getClientById(req.params.id)

  // Verifica se o usuário tem permissão para ver este cliente
  if (req.user!.role !== Role.ADMIN && client.userId !== req.user!.id) {
    throw new ApiError("Acesso não autorizado", httpStatus.FORBIDDEN)
  }

  res.send(client)
})

const updateClient = catchAsync(async (req, res) => {
  const { id } = req.params
  const updateData = req.body

  // Primeiro verifica se o cliente existe e se o usuário tem acesso
  const client = await clientService.getClientById(id)
  if (req.user!.role !== Role.ADMIN && client.userId !== req.user!.id) {
    throw new ApiError("Acesso não autorizado", httpStatus.FORBIDDEN)
  }

  const updatedClient = await clientService.updateClient(id, updateData)
  res.send(updatedClient)
})

const deleteClient = catchAsync(async (req, res) => {
  const { id } = req.params

  // Verifica permissões antes de deletar
  const client = await clientService.getClientById(id)
  if (req.user!.role !== Role.ADMIN && client.userId !== req.user!.id) {
    throw new ApiError("Acesso não autorizado", httpStatus.FORBIDDEN)
  }

  await clientService.deleteClient(id)
  res.status(httpStatus.NO_CONTENT).send()
})

export default {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
}
