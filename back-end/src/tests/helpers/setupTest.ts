import prisma from "@config/prisma"
import { afterAll, beforeAll, beforeEach } from "@jest/globals"
import app from "../../shared/http/app"

let server: any
const setupTest = () => {
  beforeAll(async () => {
    server = await app.listen(3001)
    await prisma.$connect()
  })

  beforeEach(async () => {
    await prisma.note.deleteMany()
    await prisma.deal.deleteMany()
    await prisma.token.deleteMany()
    await prisma.client.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.note.deleteMany()
    await prisma.deal.deleteMany()
    await prisma.token.deleteMany()
    await prisma.client.deleteMany()
    await prisma.user.deleteMany()
    await server.close()
    await prisma.$disconnect()
  })
}

export { prisma, server, setupTest }
