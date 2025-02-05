import { DealStage } from "@prisma/client"
import Joi from "joi"

// Constantes para validações comuns
const VALIDATION_MESSAGES = {
  TITLE_MIN: "O título deve ter pelo menos 3 caracteres",
  VALUE_POSITIVE: "O valor deve ser um número positivo",
  CLIENT_ID_REQUIRED: "ID do cliente é obrigatório e deve ser um UUID válido",
  DEAL_ID_INVALID: "ID da oportunidade deve ser um UUID válido",
  CLOSE_DATE_FUTURE: "A data de fechamento deve ser futura",
  MAX_VALUE_GREATER: "O valor máximo deve ser maior que o valor mínimo",
  LIMIT_RANGE: "Limite deve estar entre 1 e 100 registros",
  USER_ID_REQUIRED:
    "ID do usuário responsável é obrigatório e deve ser um UUID válido",
  STAGE_REQUIRED: "O estágio do negócio é obrigatório",
  VALUE_DECIMAL: "O valor deve ter no máximo 10 dígitos com 2 casas decimais",
}

// Schema comum para ID
const idSchema = Joi.string().uuid().required().messages({
  "string.guid": VALIDATION_MESSAGES.DEAL_ID_INVALID,
  "any.required": VALIDATION_MESSAGES.DEAL_ID_INVALID,
})

const decimalSchema = Joi.number()
  .precision(2)
  .positive()
  .max(99999999.99) // Máximo para decimal(10,2)
  .messages({
    "number.positive": VALIDATION_MESSAGES.VALUE_POSITIVE,
    "number.max": VALIDATION_MESSAGES.VALUE_DECIMAL,
    "number.precision": VALIDATION_MESSAGES.VALUE_DECIMAL,
  })

// Schema comum para ordenação
const orderSchema = {
  orderBy: Joi.string().valid("value", "closeDate", "createdAt"),
  order: Joi.string().valid("asc", "desc"),
}

const dealValidation = {
  createDeal: {
    body: Joi.object().keys({
      title: Joi.string().required().min(3).messages({
        "string.min": VALIDATION_MESSAGES.TITLE_MIN,
        "any.required": "O título é obrigatório",
      }),
      value: decimalSchema.required().messages({
        "any.required": "O valor é obrigatório",
      }),
      clientId: Joi.string().uuid().required().messages({
        "string.guid": VALIDATION_MESSAGES.CLIENT_ID_REQUIRED,
        "any.required": VALIDATION_MESSAGES.CLIENT_ID_REQUIRED,
      }),
      userId: Joi.string().uuid().messages({
        "string.guid": VALIDATION_MESSAGES.USER_ID_REQUIRED,
      }),
      stage: Joi.string()
        .valid(...Object.values(DealStage))
        .default(DealStage.INITIAL_CONTACT)
        .messages({
          "any.only": `Estágio deve ser um dos seguintes: ${Object.values(DealStage).join(", ")}`,
        }),
      closeDate: Joi.date()
        .min("now")
        .messages({
          "date.min": VALIDATION_MESSAGES.CLOSE_DATE_FUTURE,
        })
        .allow(null),
    }),
  },

  updateDeal: {
    params: Joi.object().keys({
      id: idSchema,
    }),
    body: Joi.object()
      .keys({
        title: Joi.string().min(3).messages({
          "string.min": VALIDATION_MESSAGES.TITLE_MIN,
        }),
        value: decimalSchema,
        stage: Joi.string()
          .valid(...Object.values(DealStage))
          .messages({
            "any.only": `Estágio deve ser um dos seguintes: ${Object.values(DealStage).join(", ")}`,
          }),
        userId: Joi.string().uuid().messages({
          "string.guid": VALIDATION_MESSAGES.USER_ID_REQUIRED,
        }),
        closeDate: Joi.date().min("now").allow(null).messages({
          "date.min": VALIDATION_MESSAGES.CLOSE_DATE_FUTURE,
        }),
      })
      .min(1)
      .messages({
        "object.min": "Pelo menos um campo deve ser fornecido para atualização",
      }),
  },

  getDeals: {
    query: Joi.object().keys({
      stage: Joi.string().valid(...Object.values(DealStage)),
      clientId: Joi.string().uuid(),
      userId: Joi.string().uuid(),
      minValue: decimalSchema,
      maxValue: decimalSchema.greater(Joi.ref("minValue")),
      search: Joi.string(),
      orderBy: Joi.string().valid(
        "title",
        "value",
        "stage",
        "closeDate",
        "createdAt",
        "updatedAt",
      ),
      order: Joi.string().valid("asc", "desc"),
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(100),
      startDate: Joi.date(),
      endDate: Joi.date().min(Joi.ref("startDate")),
    }),
  },

  getDeal: {
    params: Joi.object().keys({
      id: idSchema,
    }),
  },

  deleteDeal: {
    params: Joi.object().keys({
      id: idSchema,
    }),
  },
}

export default dealValidation
