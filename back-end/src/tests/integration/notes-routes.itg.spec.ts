// src/tests/integration/notes-routes.itg.spec.ts

import { TokenType } from "@prisma/client"
import request from "supertest"
import { clientOne, createTestClient } from "../fixtures/client.fixtures"
import { createTestDeal, dealOne } from "../fixtures/deal.fixtures"
import {
  createMultipleTestNotes,
  createTestNote,
  noteOne,
  noteThree,
  noteTwo,
} from "../fixtures/note.fixtures"
import { gerarTokenTeste } from "../fixtures/token.fixtures"
import {
  admin,
  criarUsuarioTeste,
  user1,
  user2,
} from "../fixtures/user.fixtures"
import { server, setupTest } from "../helpers/setupTest"

setupTest()

describe("Rotas de Notas", () => {
  describe("GET /api/notes", () => {
    it("Deve retornar uma lista de notas para um administrador", async () => {
      const adm = await criarUsuarioTeste(admin)
      const adminAccessToken = await gerarTokenTeste(adm.id, TokenType.ACCESS)

      const client = await createTestClient(clientOne, adm.id)
      await createMultipleTestNotes(
        [noteOne, noteTwo, noteThree],
        adm.id,
        client.id,
      )

      const res = await request(server)
        .get("/api/notes")
        .set("Authorization", `Bearer ${adminAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body.notes).toHaveLength(3)
      expect(res.body.notes[0]).toHaveProperty("id")
      expect(res.body.notes[0]).toHaveProperty("content")
    })

    it("Deve retornar apenas notas do cliente específico", async () => {
      const usuario = await criarUsuarioTeste(user1)
      const userAccessToken = await gerarTokenTeste(
        usuario.id,
        TokenType.ACCESS,
      )

      const client = await createTestClient(clientOne, usuario.id)
      const deal = await createTestDeal(dealOne, usuario.id, client.id)

      await createTestNote(noteOne, usuario.id, client.id)
      await createTestNote(noteTwo, usuario.id, client.id)
      await createTestNote(noteThree, usuario.id, undefined, deal.id)

      const res = await request(server)
        .get("/api/notes")
        .query({ clientId: client.id })
        .set("Authorization", `Bearer ${userAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body.notes).toHaveLength(2)
      expect(
        res.body.notes.every((note: any) => note.clientId === client.id),
      ).toBe(true)
    })

    it("Deve filtrar notas por deal", async () => {
      const usuario = await criarUsuarioTeste(user1)
      const userAccessToken = await gerarTokenTeste(
        usuario.id,
        TokenType.ACCESS,
      )

      const client = await createTestClient(clientOne, usuario.id)
      const deal = await createTestDeal(dealOne, usuario.id, client.id)

      await createTestNote(noteOne, usuario.id, undefined, deal.id)
      await createTestNote(noteTwo, usuario.id, client.id)

      const res = await request(server)
        .get("/api/notes")
        .query({ dealId: deal.id })
        .set("Authorization", `Bearer ${userAccessToken}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body.notes).toHaveLength(1)
      expect(res.body.notes[0].dealId).toBe(deal.id)
    })
  })

  describe("POST /api/notes", () => {
    it("Deve criar uma nova nota para um cliente", async () => {
      const usuario = await criarUsuarioTeste(user1)
      const userAccessToken = await gerarTokenTeste(
        usuario.id,
        TokenType.ACCESS,
      )
      const client = await createTestClient(clientOne, usuario.id)

      const res = await request(server)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send({
          content: noteOne.content,
          clientId: client.id,
        })

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty("id")
      expect(res.body.content).toBe(noteOne.content)
      expect(res.body.clientId).toBe(client.id)
    })

    it("Deve criar uma nova nota para um deal", async () => {
      const usuario = await criarUsuarioTeste(user1)
      const userAccessToken = await gerarTokenTeste(
        usuario.id,
        TokenType.ACCESS,
      )
      const client = await createTestClient(clientOne, usuario.id)
      const deal = await createTestDeal(dealOne, usuario.id, client.id)

      const res = await request(server)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send({
          content: noteOne.content,
          dealId: deal.id,
        })

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty("id")
      expect(res.body.content).toBe(noteOne.content)
      expect(res.body.dealId).toBe(deal.id)
    })

    it("Deve retornar erro ao tentar criar nota sem referência", async () => {
      const usuario = await criarUsuarioTeste(user1)
      const userAccessToken = await gerarTokenTeste(
        usuario.id,
        TokenType.ACCESS,
      )

      const res = await request(server)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send({
          content: noteOne.content,
        })

      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toContain("Deve fornecer clientId ou dealId")
    })
  })

  describe("PATCH /api/notes/:noteId", () => {
    it("Deve atualizar uma nota existente", async () => {
      const usuario = await criarUsuarioTeste(user1)
      const userAccessToken = await gerarTokenTeste(
        usuario.id,
        TokenType.ACCESS,
      )
      const client = await createTestClient(clientOne, usuario.id)
      const note = await createTestNote(noteOne, usuario.id, client.id)

      const updateData = {
        content: "Conteúdo atualizado da nota",
      }

      const res = await request(server)
        .patch(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send(updateData)

      expect(res.statusCode).toEqual(200)
      expect(res.body.content).toBe(updateData.content)
    })

    it("Não deve permitir atualizar nota de outro usuário", async () => {
      const usuario1 = await criarUsuarioTeste(user1)
      const usuario2 = await criarUsuarioTeste(user2)
      const client = await createTestClient(clientOne, usuario2.id)
      const note = await createTestNote(noteOne, usuario2.id, client.id)

      const user1Token = await gerarTokenTeste(usuario1.id, TokenType.ACCESS)

      const res = await request(server)
        .patch(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ content: "Nova nota" })

      expect(res.statusCode).toEqual(403)
    })
  })

  describe("DELETE /api/notes/:noteId", () => {
    it("Deve deletar uma nota existente", async () => {
      const usuario = await criarUsuarioTeste(user1)
      const userAccessToken = await gerarTokenTeste(
        usuario.id,
        TokenType.ACCESS,
      )
      const client = await createTestClient(clientOne, usuario.id)
      const note = await createTestNote(noteOne, usuario.id, client.id)

      const res = await request(server)
        .delete(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userAccessToken}`)

      expect(res.statusCode).toEqual(204)
    })

    it("Não deve permitir deletar nota de outro usuário", async () => {
      const usuario1 = await criarUsuarioTeste(user1)
      const usuario2 = await criarUsuarioTeste(user2)
      const client = await createTestClient(clientOne, usuario2.id)
      const note = await createTestNote(noteOne, usuario2.id, client.id)

      const user1Token = await gerarTokenTeste(usuario1.id, TokenType.ACCESS)

      const res = await request(server)
        .delete(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${user1Token}`)

      expect(res.statusCode).toEqual(403)
    })
  })
})
