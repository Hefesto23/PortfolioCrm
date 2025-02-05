import Joi from "joi"

// Constantes para mensagens de validação
const VALIDATION_MESSAGES = {
  CONTENT_MIN: "O conteúdo deve ter pelo menos 3 caracteres",
  NOTE_ID_INVALID: "ID da nota deve ser um UUID válido",
  ID_REQUIRED: "ID é obrigatório e deve ser um UUID válido",
  MUST_HAVE_REFERENCE: "Deve fornecer clientId ou dealId",
  END_DATE_AFTER: "Data final deve ser posterior à data inicial",
  LIMIT_RANGE: "Limite deve estar entre 1 e 100 registros",
  PAGE_MIN: "Página deve ser maior ou igual a 1",
  UUID_INVALID: "Deve ser um UUID válido",
}

// Schema comum para ID
const idSchema = Joi.string().uuid().required().messages({
  "string.guid": VALIDATION_MESSAGES.UUID_INVALID,
  "any.required": VALIDATION_MESSAGES.ID_REQUIRED,
})

// Schema comum para conteúdo
const contentSchema = Joi.string().required().min(3).messages({
  "string.min": VALIDATION_MESSAGES.CONTENT_MIN,
  "any.required": "O conteúdo é obrigatório",
})

// Schema comum para paginação
const paginationSchema = {
  page: Joi.number().integer().min(1).messages({
    "number.min": VALIDATION_MESSAGES.PAGE_MIN,
  }),
  limit: Joi.number().integer().min(1).max(100).messages({
    "number.min": VALIDATION_MESSAGES.LIMIT_RANGE,
    "number.max": VALIDATION_MESSAGES.LIMIT_RANGE,
  }),
}

const noteValidation = {
  createNote: {
    body: Joi.object()
      .keys({
        content: contentSchema,
        clientId: Joi.string().uuid().messages({
          "string.guid": VALIDATION_MESSAGES.UUID_INVALID,
        }),
        dealId: Joi.string().uuid().messages({
          "string.guid": VALIDATION_MESSAGES.UUID_INVALID,
        }),
      })
      .or("clientId", "dealId") // Requer que pelo menos um dos campos esteja presente
      .messages({
        "object.missing": VALIDATION_MESSAGES.MUST_HAVE_REFERENCE,
      }),
  },

  updateNote: {
    params: Joi.object().keys({
      id: idSchema,
    }),
    body: Joi.object().keys({
      content: contentSchema,
    }),
  },

  getNote: {
    params: Joi.object().keys({
      id: idSchema,
    }),
  },

  getNotes: {
    query: Joi.object().keys({
      clientId: Joi.string().uuid().messages({
        "string.guid": VALIDATION_MESSAGES.UUID_INVALID,
      }),
      dealId: Joi.string().uuid().messages({
        "string.guid": VALIDATION_MESSAGES.UUID_INVALID,
      }),
      startDate: Joi.date().messages({
        "date.base": "Data inicial deve ser uma data válida",
      }),
      endDate: Joi.date().min(Joi.ref("startDate")).messages({
        "date.base": "Data final deve ser uma data válida",
        "date.min": VALIDATION_MESSAGES.END_DATE_AFTER,
      }),
      ...paginationSchema,
    }),
  },

  deleteNote: {
    params: Joi.object().keys({
      id: idSchema,
    }),
  },
}

export default noteValidation
