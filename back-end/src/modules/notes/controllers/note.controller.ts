// src/modules/notes/controllers/note.controller.ts

import ApiError from "@shared/error/api.error"
import catchAsync from "@shared/http/middlewares/catch-async"
import httpStatus from "http-status"
import noteService from "../services/note.service"

const createNote = catchAsync(async (req, res) => {
  const { content, clientId, dealId } = req.body
  const { role, id: userId } = req.user!

  // Verificamos se pelo menos um relacionamento foi fornecido
  if (!clientId && !dealId) {
    throw new ApiError(
      "A nota deve estar associada a um cliente ou negócio",
      httpStatus.BAD_REQUEST,
    )
  }

  const note = await noteService.createNote({
    content,
    userId,
    clientId,
    dealId,
    role,
  })

  res.status(httpStatus.CREATED).send(note)
})

const getNotes = catchAsync(async (req, res) => {
  const { role, id: userId } = req.user!
  const filters = req.query

  const results = await noteService.getNotes(filters, userId, role)
  res.status(200).send(results)
})

const getNote = catchAsync(async (req, res) => {
  const { id: noteId } = req.params
  const { role, id: userId } = req.user!

  const note = await noteService.getNoteById(noteId, userId, role)
  res.send(note)
})

const updateNote = catchAsync(async (req, res) => {
  const { id: noteId } = req.params
  const { role, id: userId } = req.user!
  const { content } = req.body

  const note = await noteService.updateNote(noteId, { content }, userId, role)
  res.send(note)
})

const deleteNote = catchAsync(async (req, res) => {
  const { id: noteId } = req.params
  const { role, id: userId } = req.user!

  await noteService.deleteNote(noteId, userId, role)
  res.status(httpStatus.NO_CONTENT).send()
})

export default {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
}
