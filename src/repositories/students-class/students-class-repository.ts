import { RestRepository } from '../rest-repository'
import { getLimit, compactObject, isEmpty } from '../../helpers'

interface FiltersProps {
  code?: string
  model?: string
  floor?: string
  studentsAmount?: string
}

class Repository extends RestRepository {
  buildFilters (query: any) {
    const filters: FiltersProps = compactObject(query)
    const arr: any = []

    if (!isEmpty(filters)) {
      const { code, model, floor, studentsAmount } = filters

      if (code) { arr.push(`AND sc.code LIKE ${this.pool.escape('%' + code + '%')}`) }
      if (model) { arr.push(`AND sc.model LIKE ${this.pool.escape('%' + model + '%')}`) }
      if (floor) { arr.push(`AND sc.floor LIKE ${this.pool.escape('%' + floor + '%')}`) }
      if (studentsAmount) { arr.push(`AND sc.studentsAmount LIKE ${this.pool.escape('%' + studentsAmount + '%')}`) }
    }

    return arr
  }

  async findAllStudentsClasses (query: any, count: boolean) {
    const filters = this.buildFilters(query)
    const sqlCount = 'SELECT COUNT(*) AS total'
    const sqlSelect = `
      SELECT
      sc.id,
      sc.code,
      sc.model,
      sc.floor,
      sc.studentsAmount,
      sc.startDate,
      sc.endDate,
      sc.createdAt
    `
    const sql = `
      ${count ? sqlCount : sqlSelect}

      FROM ${this.entity} sc

      WHERE sc.deletedAt IS NULL

      ${!isEmpty(filters) ? filters.join(' '): ''}

      ORDER BY startDate DESC

      ${!count ? getLimit(query) : ''}
    `
    return this.query(sql)
  }
}

const StudentsClassRepository = new Repository('students_class')

export default StudentsClassRepository