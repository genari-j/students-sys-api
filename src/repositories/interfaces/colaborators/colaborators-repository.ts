interface Colaborator {
  id?: number
  name?: string
  email?: string
  cpf?: string
  password?: string
  active?: string
  avatar?: null
  departmentId?: string
  departmentName?: string
  addressId?: number
  addressStreet?: string
  addressNumber?: string
  addressNeighborhood?: string
  addressComplement?: string
  addressCity?: string
  addressState?: string
  addressCep?: string
  createdAt?: string
}

interface ColaboratorsRepository {
  findOneBy (field: string, value: unknown): Promise<Colaborator[]>
  create(payload: Colaborator): Promise<Colaborator[]>
  findAllColaborators (filters: any, count?: boolean): Promise<Colaborator[]>
  findColaboratorById (id: number): Promise<Colaborator[]>
  findColaboratorWithExistingEmail (id: number, email: string): Promise<Colaborator[]>
  findByIdAndUpdate (id: number, payload: {}): Promise<Colaborator[]>
  disableColaborator (id: number): Promise<Colaborator[]>
}

export {
  Colaborator,
  ColaboratorsRepository
}
