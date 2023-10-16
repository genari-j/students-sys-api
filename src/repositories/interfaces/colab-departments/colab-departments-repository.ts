interface ColabDepartment {
  id?: number
  name?: string
  active?: number
  createdAt?: string
}

interface ColabDepartmentsRepository {
  findAll (): Promise<ColabDepartment[]>
}

export {
  ColabDepartment,
  ColabDepartmentsRepository
}