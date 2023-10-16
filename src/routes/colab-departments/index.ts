import express from 'express'

import { ColabDepartmentsController } from '../../controllers/colab-departments'
import { ColabDepartmentsRepository } from '../../repositories/colab-departments'

export const colabDepartmentsRoutes = express.Router()
const controller = new ColabDepartmentsController(ColabDepartmentsRepository)

colabDepartmentsRoutes.get('/departments', controller.getAllDepartments.bind(controller))