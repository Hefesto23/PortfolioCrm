// src/modules/deals/routes/deal.routes.ts

import { Router } from "express"
import auth from "@shared/http/middlewares/auth"
import validate from "@shared/http/middlewares/validate"
import dealController from "../controllers/deal.controller"
import dealValidation from "../validations/deal.validation"

const router = Router()

/*
 * Definimos as rotas para o módulo de deals (oportunidades).
 * Cada rota possui:
 * 1. Middleware de autenticação com as permissões necessárias
 * 2. Middleware de validação dos dados da requisição
 * 3. Controller que processa a requisição
 */

// Rota para listagem e criação de oportunidades
router
  .route("/")
  .post(
    auth("manageDeals"), // Apenas usuários com permissão podem criar
    validate(dealValidation.createDeal),
    dealController.createDeal,
  )
  .get(
    auth("getDeals"), // Qualquer usuário autenticado pode listar
    validate(dealValidation.getDeals),
    dealController.getDeals,
  )

// Rota para métricas do pipeline
router
  .route("/pipeline-metrics")
  .get(auth("getDeals"), dealController.getPipelineMetrics)

// Rotas para operações em uma oportunidade específica
router
  .route("/:id")
  .get(
    auth("getDeals"),
    validate(dealValidation.getDeal),
    dealController.getDeal,
  )
  .patch(
    auth("manageDeals"),
    validate(dealValidation.updateDeal),
    dealController.updateDeal,
  )
  .delete(
    auth("manageDeals"),
    validate(dealValidation.deleteDeal),
    dealController.deleteDeal,
  )

export default router
