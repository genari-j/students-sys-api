interface StudentsTeachers {
  id: number
  name: string
  email: string
  cpf: string
  genre: string
  birth: Date
  classId: number
  avatar: string
  createdAt: string
  updatedAt: string
}

interface StudentsTeachersRepository {
  findAllStudentsTeachers (filters: any, count?: boolean): Promise<StudentsTeachers[]>
}

export {
  StudentsTeachers,
  StudentsTeachersRepository
}