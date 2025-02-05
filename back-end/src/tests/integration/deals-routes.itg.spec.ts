// src/tests/integration/deals-routes.itg.spec.ts

import { DealStage, TokenType } from "@prisma/client"
import request from "supertest"
import { clientOne, createTestClient } from "../fixtures/client.fixtures"
import {
  createMultipleTestDeals,
  createTestDeal,
  dealOne,
  dealThree,
  dealTwo,
} from "../fixtures/deal.fixtures"
import { gerarTokenTeste } from "../fixtures/token.fixtures"
import {
  admin,
  criarUsuarioTeste,
  user1,
  user2,
  user3,
} from "../fixtures/user.fixtures"
import { server, setupTest } from "../helpers/setupTest"

setupTest()

describe("Rotas de Negócios", () => {
  describe("GET /api/deals", () => {
    it("Deve retornar uma lista de negócios para um administrador", async () => {
      const adm = await criarUsuarioTeste(admin)
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, adm.id)
      await createMultipleTestDeals(
        [dealOne, dealTwo, dealThree],
        adm.id,
        client.id,
      )

      const res = await request(server)
        .get("/api/deals")
        .set("Authorization", `Bearer ${adminAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(3)
      expect(res.body[0]).toHaveProperty("id")
      expect(res.body[0]).toHaveProperty("title")
      expect(res.body[0]).toHaveProperty("value")
      expect(res.body[0]).toHaveProperty("stage")
    })

    it("Deve retornar apenas negócios atribuídos ao usuário regular", async () => {
      const regularUser = await criarUsuarioTeste(user2)
      const userAccessToken = await gerarTokenTeste(
        regularUser.id,
        TokenType.ACCESS,
      )

      const clientRegular = await createTestClient(clientOne, regularUser.id)
      await createMultipleTestDeals(
        [dealOne, dealTwo],
        regularUser.id,
        clientRegular.id,
      )

      const anotherUser = await criarUsuarioTeste({
        ...user3,
        email: "another@example.com",
      })
      const clientAnother = await createTestClient(
        { ...clientOne, email: "another@client.com" },
        anotherUser.id,
      )
      await createTestDeal(dealThree, anotherUser.id, clientAnother.id)

      const res = await request(server)
        .get("/api/deals")
        .set("Authorization", `Bearer ${userAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(2)
    })

    it("Deve filtrar negócios por estágio", async () => {
      const adm = await criarUsuarioTeste(admin)
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, adm.id)
      await createMultipleTestDeals(
        [dealOne, dealTwo, dealThree],
        adm.id,
        client.id,
      )

      const res = await request(server)
        .get("/api/deals")
        .query({ stage: DealStage.INITIAL_CONTACT })
        .set("Authorization", `Bearer ${adminAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].stage).toBe(DealStage.INITIAL_CONTACT)
    })
  })

  describe("POST /api/deals", () => {
    it("Deve criar um novo negócio", async () => {
      const user = await criarUsuarioTeste(admin)
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, user.id)

      const res = await request(server)
        .post("/api/deals")
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send({
          ...dealOne,
          clientId: client.id,
        })

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty("id")
      expect(res.body.title).toBe(dealOne.title)
      expect(Number(res.body.value)).toBe(Number(dealOne.value))
      expect(res.body.stage).toBe(DealStage.INITIAL_CONTACT)
    })

    it("Deve retornar erro ao tentar criar negócio com valor negativo", async () => {
      const user = await criarUsuarioTeste(admin)
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, user.id)

      const res = await request(server)
        .post("/api/deals")
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send({
          ...dealOne,
          value: -1000,
          clientId: client.id,
        })

      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toContain("valor")
    })
  })

  describe("PATCH /api/deals/:dealId", () => {
    it("Deve atualizar um negócio existente", async () => {
      const user = await criarUsuarioTeste(admin)
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, user.id)
      const deal = await createTestDeal(dealOne, user.id, client.id)

      const updateData = {
        title: "Título Atualizado",
        stage: DealStage.NEGOTIATION,
      }

      const res = await request(server)
        .patch(`/api/deals/${deal.id}`)
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send(updateData)

      expect(res.statusCode).toEqual(200)
      expect(res.body.title).toBe(updateData.title)
      expect(res.body.stage).toBe(updateData.stage)
    })

    it("Não deve permitir atualizar negócio de outro usuário", async () => {
      const usuario1 = await criarUsuarioTeste({
        ...user1,
        email: "user1@example.com",
      })
      const usuario2 = await criarUsuarioTeste({
        ...user2,
        email: "user2@example.com",
      })

      const client = await createTestClient(clientOne, usuario2.id)
      const deal = await createTestDeal(dealOne, usuario2.id, client.id)

      const user1Token = await gerarTokenTeste(usuario1.id, TokenType.ACCESS)

      const res = await request(server)
        .patch(`/api/deals/${deal.id}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ title: "Novo Título" })

      expect(res.statusCode).toEqual(403)
    })
  })

  describe("DELETE /api/deals/:dealId", () => {
    it("Deve deletar um negócio existente", async () => {
      const user = await criarUsuarioTeste(admin)
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, user.id)
      const deal = await createTestDeal(dealOne, user.id, client.id)

      const res = await request(server)
        .delete(`/api/deals/${deal.id}`)
        .set("Authorization", `Bearer ${userAccessToken}`)

      expect(res.statusCode).toEqual(204)
    })

    it("Não deve permitir deletar negócio de outro usuário", async () => {
      const usuario1 = await criarUsuarioTeste({
        ...user1,
        email: "user1@example.com",
      })
      const usuario2 = await criarUsuarioTeste({
        ...user2,
        email: "user2@example.com",
      })

      const client = await createTestClient(clientOne, usuario2.id)
      const deal = await createTestDeal(dealOne, usuario2.id, client.id)

      const user1Token = await gerarTokenTeste(usuario1.id, TokenType.ACCESS)

      const res = await request(server)
        .delete(`/api/deals/${deal.id}`)
        .set("Authorization", `Bearer ${user1Token}`)

      expect(res.statusCode).toEqual(403)
    })
  })

  describe("GET /api/deals/pipeline-metrics", () => {
    it("Deve retornar métricas do pipeline", async () => {
      const user = await criarUsuarioTeste(admin)
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, user.id)
      await createMultipleTestDeals(
        [dealOne, dealTwo, dealThree],
        user.id,
        client.id,
      )

      const res = await request(server)
        .get("/api/deals/pipeline-metrics")
        .set("Authorization", `Bearer ${userAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty("totalDeals")
      expect(res.body).toHaveProperty("totalValue")
      expect(res.body).toHaveProperty("avgDealValue")
      expect(res.body).toHaveProperty("dealsByStage")
    })
  })
})
