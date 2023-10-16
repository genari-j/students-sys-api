import { RestRepository } from '../rest-repository'
import { getLimit } from '../../helpers/get-limit'

class Repository extends RestRepository {
  async disableColaborator (id: number) {
    const sql = `
      UPDATE ${this.entity} u
      SET active = 0
      WHERE id = ${this.pool.escape(id)}
    `
    return this.query(sql)
  }

  async findAllColaborators (filters: any, count: boolean) {
    const sqlCount = 'SELECT COUNT(*) AS total'
    const sqlSelect = `
      SELECT
      c.id,
      c.name,
      c.email,
      c.active,
      c.departmentId,
      c.avatar,
      c.createdAt,
      cdpt.name AS departmentName,
      ca.id AS addressId,
      ca.street AS addressStreet,
      ca.number AS addressNumber,
      ca.neighborhood AS addressNeighborhood,
      ca.complement AS addressComplement,
      ca.city AS addressCity,
      ca.state AS addressState,
      ca.cep AS addressCep
    `

    const sql = `
      ${count ? sqlCount : sqlSelect}

      FROM ${this.entity} c

      INNER JOIN colab_departments cdpt
      ON c.departmentId = cdpt.id

      INNER JOIN rel_colab_address rca
      ON c.id = rca.colabId

      INNER JOIN colab_address ca
      ON rca.colabAddressId = ca.id

      WHERE c.deletedAt IS NULL
      AND c.active = 1

      ${!count ? getLimit(filters) : ''}
    `
    return this.query(sql)
  }

  async findColaboratorById (id: number) {
    const sql = `
      SELECT
      c.id,
      c.name,
      c.email,
      c.active,
      c.departmentId,
      c.avatar,
      c.createdAt,
      cdpt.name AS departmentName,
      ca.id AS addressId,
      ca.street AS addressStreet,
      ca.number AS addressNumber,
      ca.neighborhood AS addressNeighborhood,
      ca.complement AS addressComplement,
      ca.city AS addressCity,
      ca.state AS addressState,
      ca.cep AS addressCep

      FROM ${this.entity} c

      INNER JOIN colab_departments cdpt
      ON c.departmentId = cdpt.id

      INNER JOIN rel_colab_address rca
      ON c.id = rca.colabId

      INNER JOIN colab_address ca
      ON rca.colabAddressId = ca.id

      WHERE c.deletedAt IS NULL
      AND c.id = ${this.pool.escape(id)}
    `
    return this.query(sql)
  }

  async findColaboratorWithExistingEmail (id: number, email: string) {
    const sql = `
      SELECT id
      FROM ${this.entity}
      WHERE email = ${this.pool.escape(email)}
      AND id <> ${this.pool.escape(id)}
    `
    return this.query(sql)
  }
}

const ColaboratorsRepository = new Repository('colaborators')

export default ColaboratorsRepository
