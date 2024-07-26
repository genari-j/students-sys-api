import express from 'express'

import { authMiddleware } from '../../middlewares/auth'

import { StudentsClassController } from '../../controllers/students-class'
import { StudentsClassRepository } from '../../repositories/students-class'

export const studentsClassRoutes = express.Router()
const controller = new StudentsClassController(StudentsClassRepository)

studentsClassRoutes.get('/students-class', authMiddleware, controller.getAllStudentsClass.bind(controller))