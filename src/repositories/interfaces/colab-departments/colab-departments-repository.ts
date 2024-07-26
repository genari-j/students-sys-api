interface NewColabDepartment {
  id?: number
  name: string
  active?: number
  createdAt?: string
}

interface ColabDepartment {
  id?: number
  name?: string
  active?: number
  createdAt?: string
}

interface ColabDepartmentsRepository {
  findAll (): Promise<ColabDepartment[]>
  create(payload: NewColabDepartment): Promise<NewColabDepartment[]>
}

export {
  ColabDepartment,
  ColabDepartmentsRepository
}