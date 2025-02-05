// src/modules/clients/routes/client.routes.ts

import auth from '@shared/http/middlewares/auth';
import validate from '@shared/http/middlewares/validate';
import express from 'express';
import clientController from '../controllers/client.controller';
import clientValidation from '../validations/client.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageClients'),
    validate(clientValidation.createClient),
    clientController.createClient
  )
  .get(
    auth('getClients'),
    validate(clientValidation.getClients),
    clientController.getClients
  );

router
  .route('/:id')
  .get(
    auth('getClients'),
    validate(clientValidation.getClient),
    clientController.getClient
  )
  .patch(
    auth('manageClients'),
    validate(clientValidation.updateClient),
    clientController.updateClient
  )
  .delete(
    auth('manageClients'),
    validate(clientValidation.deleteClient),
    clientController.deleteClient
  );

export default router;
