import { pool, querySQL } from '../adapters/mysql'

export class RestRepository {
  public readonly entity: string
  public readonly pool: any
  public readonly query: any

  constructor (entity: string) {
    this.entity = entity
    this.pool = pool
    this.query = querySQL
  }

  async create (data: {} = {}) {
    const columns = Object.keys(data).map(k => `${this.pool.escapeId(k)}`).join(', ')
    const values = Object.values(data).map(v => `${this.pool.escape(v)}`).join(', ')

    const query = `INSERT INTO ${this.entity} (${columns}) VALUES (${values})`
    const { insertId } = await this.query(query)

    const getLastRow = `SELECT * FROM ${this.entity} WHERE id = ${insertId}`
    return this.query(getLastRow)
  }

  async findOneBy (prop: string, value: number | string) {
    if (!prop || !value) {
      throw new Error('Property and value must be specified.')
    }

    const query = `SELECT * FROM ${this.entity} WHERE ${this.pool.escapeId(prop)} = ${this.pool.escape(value)} AND deletedAt IS NULL`
    return this.query(query)
  }

  async findAll () {
    const query = `SELECT * FROM ${this.entity} WHERE deletedAt IS NULL`
    return this.query(query)
  }

  async findByIdAndUpdate (id: number, data: {} = {}) {
    if (!id) {
      throw new Error('Id must be specified.')
    }

    const {...payload} = data
    const transform = (obj: {}) => Object.entries(obj).map(([k, v]) => `${this.pool.escapeId(k)} = ${this.pool.escape(v)}`).join(', ')

    const query = `UPDATE ${this.entity} SET ${transform(payload)} WHERE id = ${this.pool.escape(id)}`
    return this.query(query)
  }
}
