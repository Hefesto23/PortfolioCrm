// src/modules/notes/routes/note.routes.ts

import { Router } from "express"
import auth from "@shared/http/middlewares/auth"
import validate from "@shared/http/middlewares/validate"
import noteController from "../controllers/note.controller"
import noteValidation from "../validations/note.validation"

const router = Router()

// Rotas para gerenciamento de notas
router
  .route("/")
  .post(
    auth("manageNotes"),
    validate(noteValidation.createNote),
    noteController.createNote,
  )
  .get(
    auth("getNotes"),
    validate(noteValidation.getNotes),
    noteController.getNotes,
  )

// Rotas para operações em notas específicas
router
  .route("/:id")
  .get(
    auth("getNotes"),
    validate(noteValidation.getNote),
    noteController.getNote,
  )
  .patch(
    auth("manageNotes"),
    validate(noteValidation.updateNote),
    noteController.updateNote,
  )
  .delete(
    auth("manageNotes"),
    validate(noteValidation.deleteNote),
    noteController.deleteNote,
  )

export default router
