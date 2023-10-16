interface RelColabAddress {
  id?: number
  colabId?: number
  colabAddressId?: number
  createdAt?: string
}

interface RelColabAddressRepository {
  create(payload: RelColabAddress): Promise<RelColabAddress[]>
}

export {
  RelColabAddress,
  RelColabAddressRepository
}
