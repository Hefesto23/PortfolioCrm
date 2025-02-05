// src/tests/fixtures/client.fixtures.ts

import { Client, ClientStatus } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { prisma } from "../helpers/setupTest"

export const clientOne = {
  name: "Empresa ABC Ltda",
  email: "contato@empresaabc.com",
  phone: "11999887766",
  company: "ABC Corporação",
  status: ClientStatus.LEAD,
}

export const clientTwo = {
  name: "XYZ Tecnologia",
  email: "contato@xyztech.com",
  phone: "11998765432",
  company: "XYZ Tech",
  status: ClientStatus.PROSPECT,
}

export const clientThree = {
  name: "Inovação SA",
  email: "contato@inovacao.com",
  phone: "11997654321",
  company: "Inovação Company",
  status: ClientStatus.CLIENT,
}

export const createTestClient = async (
  clientData: Partial<Client>,
  userId: string,
) => {
  return prisma.client.create({
    data: {
      name: clientData.name || faker.company.name(),
      email: clientData.email || faker.internet.email().toLowerCase(),
      phone: clientData.phone || faker.phone.number(),
      company: clientData.company || faker.company.name(),
      status: clientData.status || ClientStatus.LEAD,
      userId,
    },
  })
}

export const createMultipleTestClients = async (
  clients: Partial<Client>[],
  userId: string,
) => {
  return Promise.all(clients.map((client) => createTestClient(client, userId)))
}
