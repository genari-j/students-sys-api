import { RestRepository } from '../rest-repository'

class Repository extends RestRepository {}

const ColabAddressRepository = new Repository('colab_address')

export default ColabAddressRepository