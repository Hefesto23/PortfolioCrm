// src/tests/fixtures/note.fixtures.ts

import prisma from "@config/prisma"

export const noteOne = {
  content: "Nota de teste um",
}

export const noteTwo = {
  content: "Nota de teste dois",
}

export const noteThree = {
  content: "Nota de teste três - ABC Corp",
}

export const createTestNote = async (
  note: typeof noteOne,
  userId: string,
  clientId?: string,
  dealId?: string,
) => {
  return await prisma.note.create({
    data: {
      ...note,
      userId,
      clientId,
      dealId,
    },
  })
}

export const createMultipleTestNotes = async (
  notes: (typeof noteOne)[],
  userId: string,
  clientId?: string,
  dealId?: string,
) => {
  return await Promise.all(
    notes.map((note) => createTestNote(note, userId, clientId, dealId)),
  )
}
