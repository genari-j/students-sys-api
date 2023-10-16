interface ColabAddress {
  id?: number
  street?: string
  number?: string
  neighborhood?: string
  complement?: string
  city?: string
  state?: string
  cep?: string
  createdAt?: string
}

interface ColabAddressRepository {
  create(payload: ColabAddress): Promise<ColabAddress[]>
}

export {
  ColabAddress,
  ColabAddressRepository
}
