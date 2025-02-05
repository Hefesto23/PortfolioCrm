// src/tests/integration/clients-routes.itg.spec.ts

import { ClientStatus, TokenType } from "@prisma/client"
import request from "supertest"
import {
  clientOne,
  clientThree,
  clientTwo,
  createMultipleTestClients,
  createTestClient,
} from "../fixtures/client.fixtures"
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

describe("Rotas de Clientes", () => {
  describe("GET /api/clients", () => {
    it("Deve retornar uma lista de clientes para um administrador", async () => {
      // Criamos um admin e geramos seu token
      const adm = await criarUsuarioTeste(admin)
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS)

      // Criamos alguns clientes de teste
      await createMultipleTestClients(
        [clientOne, clientTwo, clientThree],
        adm.id,
      )

      const res = await request(server)
        .get("/api/clients")
        .set("Authorization", `Bearer ${adminAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(3)
      expect(res.body[0]).toHaveProperty("id")
      expect(res.body[0]).toHaveProperty("name")
      expect(res.body[0]).toHaveProperty("email")
      expect(res.body[0]).toHaveProperty("status")
    })

    it("Deve retornar apenas clientes atribuídos ao usuário regular", async () => {
      // Criamos um usuário regular
      const regularUser = await criarUsuarioTeste(user2)
      const userAccessToken = await gerarTokenTeste(
        regularUser.id,
        TokenType.ACCESS,
      )

      // Criamos clientes atribuídos a este usuário
      await createMultipleTestClients([clientOne, clientTwo], regularUser.id)

      // Criamos um cliente atribuído a outro usuário
      const anotherUser = await criarUsuarioTeste({
        ...user3,
        email: "another@example.com",
      })
      await createTestClient(clientThree, anotherUser.id)

      const res = await request(server)
        .get("/api/clients")
        .set("Authorization", `Bearer ${userAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(2) // Apenas os clientes do usuário
    })

    it("Deve filtrar clientes por status", async () => {
      const adm = await criarUsuarioTeste(admin)
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS)

      await createMultipleTestClients(
        [clientOne, clientTwo, clientThree],
        adm.id,
      )

      const res = await request(server)
        .get("/api/clients")
        .query({ status: ClientStatus.LEAD })
        .set("Authorization", `Bearer ${adminAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].status).toBe(ClientStatus.LEAD)
    })

    it("Deve buscar clientes por termo de pesquisa", async () => {
      const adm = await criarUsuarioTeste(admin)
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS)

      await createMultipleTestClients(
        [clientOne, clientTwo, clientThree],
        adm.id,
      )

      const res = await request(server)
        .get("/api/clients")
        .query({ search: "ABC" })
        .set("Authorization", `Bearer ${adminAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].name).toContain("ABC")
    })
  })

  describe("POST /api/clients", () => {
    it("Deve criar um novo cliente", async () => {
      const user = await criarUsuarioTeste(admin)
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)

      const res = await request(server)
        .post("/api/clients")
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send(clientOne)

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty("id")
      expect(res.body.name).toBe(clientOne.name)
      expect(res.body.email).toBe(clientOne.email)
      expect(res.body.status).toBe(ClientStatus.LEAD)
    })

    it("Deve retornar erro ao tentar criar cliente com email duplicado", async () => {
      const user = await criarUsuarioTeste(admin)
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)

      // Primeiro cliente
      await createTestClient(clientOne, user.id)

      // Tentativa de criar cliente com mesmo email
      const res = await request(server)
        .post("/api/clients")
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send(clientOne)

      expect(res.statusCode).toEqual(409)
      expect(res.body.message).toContain("já está cadastrado")
    })
  })

  describe("PATCH /api/clients/:clientId", () => {
    it("Deve atualizar um cliente existente", async () => {
      const user = await criarUsuarioTeste(admin)
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, user.id)

      const updateData = {
        name: "Novo Nome da Empresa",
        status: ClientStatus.CLIENT,
      }

      const res = await request(server)
        .patch(`/api/clients/${client.id}`)
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send(updateData)

      expect(res.statusCode).toEqual(200)
      expect(res.body.name).toBe(updateData.name)
      expect(res.body.status).toBe(updateData.status)
    })

    it("Não deve permitir atualizar cliente de outro usuário", async () => {
      const usuario1 = await criarUsuarioTeste({
        ...user1,
        email: "user1@example.com",
      })
      const usuario2 = await criarUsuarioTeste({
        ...user2,
        email: "user2@example.com",
      })

      const user1Token = await gerarTokenTeste(usuario1.id, TokenType.ACCESS)
      const client = await createTestClient(clientOne, usuario2.id)

      const res = await request(server)
        .patch(`/api/clients/${client.id}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ name: "Novo Nome" })

      expect(res.statusCode).toEqual(403)
    })
  })

  describe("DELETE /api/clients/:clientId", () => {
    it("Deve deletar um cliente existente", async () => {
      const user = await criarUsuarioTeste(admin)
      const userAccessToken = await gerarTokenTeste(user.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, user.id)

      const res = await request(server)
        .delete(`/api/clients/${client.id}`)
        .set("Authorization", `Bearer ${userAccessToken}`)

      expect(res.statusCode).toEqual(204)
    })

    it("Não deve permitir deletar cliente de outro usuário", async () => {
      const usuario1 = await criarUsuarioTeste({
        ...user1,
        email: "user1@example.com",
      })
      const usuario2 = await criarUsuarioTeste({
        ...user2,
        email: "user2@example.com",
      })

      const user1Token = await gerarTokenTeste(usuario1.id, TokenType.ACCESS)
      const client = await createTestClient(clientOne, usuario2.id)

      const res = await request(server)
        .delete(`/api/clients/${client.id}`)
        .set("Authorization", `Bearer ${user1Token}`)

      expect(res.statusCode).toEqual(403)
    })
  })
})
