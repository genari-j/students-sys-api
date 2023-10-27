interface NewColaborator {
  id?: number
  name: string
  email: string
  cpf: string
  password: string
  departmentId: number
  street: string
  number: string
  neighborhood: string
  complement: string
  city: string
  state: string
  cep: string
}

interface Colaborators {
  id: number
  name: string
  email: string
  cpf: string
  active: number
  avatar: string | null
  createdAt: string
  updatedAt: string | null
  departmentId: number
  departmentName: string
  addressId: number
  addressStreet: string
  addressNumber: string
  addressNeighborhood: string
  addressComplement: string
  addressCity: string
  addressState: string
  addressCep: string
}

interface ColaboratorById {
  id: number
  name: string
  email: string
  cpf: string
  active: number
  avatar: string | null
  createdAt: string
  updatedAt: string | null
  departmentId: string
  departmentName: string
  addressId: number
  addressStreet: string
  addressNumber: string
  addressNeighborhood: string
  addressComplement: string
  addressCity: string
  addressState: string
  addressCep: string
}

interface ColaboratorWithEmail {
  id: number
  name: string
  email: string
  cpf: string
  active: number
  avatar: string | null
  createdAt: string
  updatedAt: string | null
  departmentId: string
  departmentName: string
  addressId: number
  addressStreet: string
  addressNumber: string
  addressNeighborhood: string
  addressComplement: string
  addressCity: string
  addressState: string
  addressCep: string
}

interface ColaboratorByField {
  id: number
  name: string
  email: string
  password: string
  cpf: string
  active: number
  avatar: string | null
  departmentId: number
  createdAt: string
  updatedAt: string | null
}

interface Colaborator {
  id?: number
  name?: string
  email?: string
  cpf?: string
  password?: string
  active?: number
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
  findOneBy (field: string, value: unknown): Promise<ColaboratorByField[]>
  create(payload: Colaborator): Promise<NewColaborator[]>
  findAllColaborators (filters: any, count?: boolean): Promise<Colaborators[]>
  findColaboratorById (id: number): Promise<ColaboratorById[]>
  findColaboratorWithExistingEmail (id: number, email: string): Promise<ColaboratorWithEmail[]>
  findByIdAndUpdate (id: number, payload: {}): Promise<ColaboratorById[]>
  disableColaborator (id: number): Promise<Colaborator[]>
}

export {
  Colaborator,
  ColaboratorsRepository
}
