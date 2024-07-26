import express from 'express'

import { authMiddleware } from '../../middlewares/auth'

import { StudentsTeachersController } from '../../controllers/students-teachers'
import { StudentsTeachersRepository } from '../../repositories/students-teachers'

export const studentsTeachersRoutes = express.Router()
const controller = new StudentsTeachersController(StudentsTeachersRepository)

studentsTeachersRoutes.get('/students-teachers', authMiddleware, controller.getAllStudentsTeachers.bind(controller))