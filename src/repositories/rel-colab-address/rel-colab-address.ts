import { RestRepository } from '../rest-repository'

class Repository extends RestRepository {}

const RelColabAddressRepository = new Repository('rel_colab_address')

export default RelColabAddressRepository