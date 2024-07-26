interface StudentsClass {
  id: number
  code: string
  model: string
  floor: string
  studentsAmount: string
  startDate: Date
  endDate: Date
  createdAt: string
}

interface StudentsClassRepository {
  findAllStudentsClasses (filters: any, count?: boolean): Promise<StudentsClass[]>
}

export {
  StudentsClass,
  StudentsClassRepository
}