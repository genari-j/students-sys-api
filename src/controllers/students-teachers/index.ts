import { Request, Response } from 'express'

import { StudentsTeachersRepository } from '../../repositories/interfaces/students-teachers'
import { getPages } from '../../helpers'

export class StudentsTeachersController {
  private readonly studentsTeachersRepository: StudentsTeachersRepository

  constructor (studentsTeachersRepository: StudentsTeachersRepository) {
    this.studentsTeachersRepository = studentsTeachersRepository
  }

  async getAllStudentsTeachers (request: Request, response: Response) {
    try {
      const { limit, page } = request.query
      const filters = { limit, page }

      const [total] = await this.studentsTeachersRepository.findAllStudentsTeachers(filters, true)
      const allStudentsTeachers = await this.studentsTeachersRepository.findAllStudentsTeachers(filters)

      const mappedStudentsTeachers = allStudentsTeachers.map((teacher) => {
        return {
          teachers: {
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            cpf: teacher.cpf,
            genre: teacher.genre,
            birth: teacher.birth,
            classId: teacher.classId,
            avatar: teacher.avatar,
            createdAt: teacher.createdAt,
            updatedAt: teacher.updatedAt
          }
        }
      })

      return response.json({
        error: false,
        data: mappedStudentsTeachers,
        ...total,
        limit: Number(limit) || Number(process.env.LIST_PER_PAGE),
        pages: getPages(total, Number(limit)),
        page: page ? Number(page) : 1
      })
    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: `Algo saiu como não esperado: ${err}`
      })
    }
  }
}