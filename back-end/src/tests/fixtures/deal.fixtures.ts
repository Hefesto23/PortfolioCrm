// src/tests/fixtures/deal.fixtures.ts

import { faker } from "@faker-js/faker"
import { Deal, DealStage, Prisma } from "@prisma/client"
import { prisma } from "../helpers/setupTest"
// Função auxiliar para criar data futura
const getFutureDate = (months: number = 1) => {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date
}

export const dealOne = {
  title: "Implementação ERP",
  value: new Prisma.Decimal(50000),
  stage: DealStage.INITIAL_CONTACT,
  closeDate: getFutureDate(6), // 6 meses no futuro
}

export const dealTwo = {
  title: "Consultoria Estratégica",
  value: new Prisma.Decimal(25000),
  stage: DealStage.PROPOSAL_SENT,
  closeDate: getFutureDate(3), // 3 meses no futuro
}

export const dealThree = {
  title: "Desenvolvimento Mobile",
  value: new Prisma.Decimal(75000),
  stage: DealStage.NEGOTIATION,
  closeDate: getFutureDate(9), // 9 meses no futuro
}

export const createTestDeal = async (
  dealData: Partial<Deal>,
  userId: string,
  clientId: string,
) => {
  return prisma.deal.create({
    data: {
      title: dealData.title || faker.company.catchPhrase(),
      value: dealData.value || Number(faker.finance.amount(10000, 100000, 2)),
      stage: dealData.stage || DealStage.INITIAL_CONTACT,
      closeDate: dealData.closeDate || getFutureDate(),
      userId,
      clientId,
    },
  })
}

export const createMultipleTestDeals = async (
  deals: Partial<Deal>[],
  userId: string,
  clientId: string,
) => {
  return Promise.all(
    deals.map((deal) => createTestDeal(deal, userId, clientId)),
  )
}
