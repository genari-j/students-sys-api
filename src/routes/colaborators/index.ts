import express from 'express'

import { authMiddleware } from '../../middlewares/auth'

import { ColaboratorsController } from '../../controllers/colaborators'
import { ColaboratorsRepository } from '../../repositories/colaborators'
import { ColabAddressRepository } from '../../repositories/colab-address'
import { RelColabAddressRepository } from '../../repositories/rel-colab-address'

export const colaboratorsRoutes = express.Router()
const controller = new ColaboratorsController(
  ColaboratorsRepository,
  ColabAddressRepository,
  RelColabAddressRepository
)

colaboratorsRoutes.post('/signin', controller.login.bind(controller))
colaboratorsRoutes.post('/signup', controller.create.bind(controller))

colaboratorsRoutes.get('/colaborators', authMiddleware, controller.getAll.bind(controller))
colaboratorsRoutes.get('/colaborators/:id', authMiddleware, controller.getById.bind(controller))
colaboratorsRoutes.put('/colaborators/:id', authMiddleware, controller.update.bind(controller))
colaboratorsRoutes.delete('/colaborators/:id', authMiddleware, controller.delete.bind(controller))