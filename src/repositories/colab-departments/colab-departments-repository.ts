import { RestRepository } from '../rest-repository'

class Repository extends RestRepository {}

const ColabDepartmentsRepository = new Repository('colab_departments')

export default ColabDepartmentsRepository