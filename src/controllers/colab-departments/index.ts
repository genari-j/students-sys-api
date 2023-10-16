import { Request, Response } from 'express'

import { ColabDepartmentsRepository } from '../../repositories/interfaces/colab-departments'

export class ColabDepartmentsController {
  private readonly colabDepartmentsRepository: ColabDepartmentsRepository

  constructor (colabDepartmentsRepository: ColabDepartmentsRepository) {
    this.colabDepartmentsRepository = colabDepartmentsRepository
  }

  async getAllDepartments (_request: Request, response: Response) {
    try {
      const colabDepartments = await this.colabDepartmentsRepository.findAll()

      return response.json({
        error: false,
        data: colabDepartments
      })
    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: `Algo saiu como não esperado: ${err}`
      })
    }
  }
}