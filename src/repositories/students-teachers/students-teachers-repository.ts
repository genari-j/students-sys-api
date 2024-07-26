import { RestRepository } from '../rest-repository'
import { getLimit, compactObject, isEmpty } from '../../helpers'

interface FiltersProps {
  name?: string
  email?: string
  cpf?: string
}

class Repository extends RestRepository {
  buildFilters (query: any) {
    const filters: FiltersProps = compactObject(query)
    const arr: any = []

    if (!isEmpty(filters)) {
      const { name, email, cpf } = filters

      if (name) { arr.push(`AND st.code LIKE ${this.pool.escape('%' + name + '%')}`) }
      if (email) { arr.push(`AND st.model LIKE ${this.pool.escape('%' + email + '%')}`) }
      if (cpf) { arr.push(`AND st.floor LIKE ${this.pool.escape('%' + cpf + '%')}`) }
    }

    return arr
  }

  async findAllStudentsTeachers (query: any, count: boolean) {
    const filters = this.buildFilters(query)
    const sqlCount = 'SELECT COUNT(*) AS total'
    const sqlSelect = `
      SELECT
      st.id,
      st.name,
      st.email,
      st.cpf,
      st.genre,
      st.birth,
      st.classId,
      st.avatar,
      st.createdAt,
      st.updatedAt
    `
    const sql = `
      ${count ? sqlCount : sqlSelect}

      FROM ${this.entity} st

      WHERE st.deletedAt IS NULL

      ${!isEmpty(filters) ? filters.join(' '): ''}

      ORDER BY createdAt DESC

      ${!count ? getLimit(query) : ''}
    `
    return this.query(sql)
  }
}

const StudentsTeachersRepository = new Repository('students_teachers')

export default StudentsTeachersRepository