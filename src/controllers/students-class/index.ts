import { Request, Response } from 'express'

import { StudentsClassRepository } from '../../repositories/interfaces/students-class'
import { getPages } from '../../helpers'

export class StudentsClassController {
  private readonly studentsClassRepository: StudentsClassRepository

  constructor (studentsClassRepository: StudentsClassRepository) {
    this.studentsClassRepository = studentsClassRepository
  }

  async getAllStudentsClass (request: Request, response: Response) {
    try {
      const { code, model, floor, studentsAmount, limit, page } = request.query
      const filters = { code, model, floor, studentsAmount, limit, page }

      const [total] = await this.studentsClassRepository.findAllStudentsClasses(filters, true)
      const allStudentsClass = await this.studentsClassRepository.findAllStudentsClasses(filters)

      const mappedStudentsClass = allStudentsClass.map((classe) => {
        return {
          classes: {
            id: classe.id,
            code: classe.code,
            model: classe.model,
            floor: classe.floor,
            studentsAmount: classe.studentsAmount,
            startDate: classe.startDate,
            endDate: classe.endDate,
            createdAt: classe.createdAt
          }
        }
      })

      return response.json({
        error: false,
        data: mappedStudentsClass,
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