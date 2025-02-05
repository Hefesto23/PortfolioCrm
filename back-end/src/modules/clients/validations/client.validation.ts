// src/modules/clients/validations/client.validation.ts

import { ClientStatus } from "@prisma/client"
import Joi from "joi"

const createClient = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    company: Joi.string(),
    status: Joi.string().valid(...Object.values(ClientStatus)),
  }),
}

const getClients = {
  query: Joi.object().keys({
    status: Joi.string().valid(...Object.values(ClientStatus)),
    search: Joi.string(),
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
}

const getClient = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
}

const updateClient = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      company: Joi.string(),
      status: Joi.string().valid(...Object.values(ClientStatus)),
    })
    .min(1),
}

const deleteClient = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
}

export default {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
}
