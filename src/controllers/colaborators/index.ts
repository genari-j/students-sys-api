import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { Colaborator, ColaboratorsRepository } from '../../repositories/interfaces/colaborators'
import { ColabAddress, ColabAddressRepository } from '../../repositories/interfaces/colab-address'
import { RelColabAddress, RelColabAddressRepository } from '../../repositories/interfaces/rel-colab-address'

import { cryptPassword, getPages } from '../../helpers'
import { validateSignInSchema, validateSignUpSchema } from '../../validators/colaborators'

export class ColaboratorsController {
  private readonly colaboratorsRepository: ColaboratorsRepository
  private readonly colabAddressRepository: ColabAddressRepository
  private readonly relColabAddressRepository: RelColabAddressRepository

  constructor (
    colaboratorsRepository: ColaboratorsRepository,
    colabAddressRepository: ColabAddressRepository,
    relColabAddressRepository: RelColabAddressRepository
  ) {
    this.colaboratorsRepository = colaboratorsRepository,
    this.colabAddressRepository = colabAddressRepository,
    this.relColabAddressRepository = relColabAddressRepository
  }

  async login (request: Request, response: Response) {
    try {
      const { error } = validateSignInSchema.validate(request.body)
      if (error) {
        const msg = error.details[0].message.replace(/"/g, '')
        return response.status(400).json({
          error: true,
          message: msg
        })
      }

      const { email, password } = request.body

      const [user] = await this.colaboratorsRepository.findOneBy('email', email)
      if (!user) {
        return response.status(401).json({
          error: true,
          message: 'Não autorizado!'
        })
      }

      if (user.active !== 1) {
        return response.status(401).json({
          error: true,
          message: 'Não autorizado!'
        })
      }

      const compareUserPassword = await bcrypt.compare(
        String(password),
        String(user.password)
      )

      if (!compareUserPassword) {
        return response.status(401).json({
          error: true,
          message: 'Não autorizado!'
        })
      }

      const token = jwt.sign(
        {sub: user.id},
        process.env.APP_SECRET as string,
        {expiresIn: '12h'}
      )

      return response.json({
        error: false,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            active: user.active,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          department: {
            departmentId: user.departmentId,
          },
          token
        }
      })

    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: `Algo saiu como não esperado: ${err}`
      })
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { error } = validateSignUpSchema.validate(request.body)
      if (error) {
        const msg = error.details[0].message.replace(/"/g, '')
        return response.status(400).json({
          error: true,
          message: msg
        })
      }

      const {
        name,
        email,
        cpf,
        password,
        departmentId,
        addressStreet,
        addressNumber,
        addressNeighborhood,
        addressComplement,
        addressCity,
        addressState,
        addressCep,
      }: Colaborator = request.body

      const [userWithEmail] = await this.colaboratorsRepository.findOneBy('email', email)
      if (userWithEmail) {
        return response.status(400).json({
          error: true,
          message: 'O e-mail informado já existe.'
        })
      }

      const [userWithCpf] = await this.colaboratorsRepository.findOneBy('cpf', cpf)
      if (userWithCpf) {
        return response.status(400).json({
          error: true,
          message: 'O CPF informado já existe.'
        })
      }

      const encryptedPassword = cryptPassword(password)

      const colabPayload: Colaborator = {
        name, email, cpf, password: encryptedPassword, departmentId
      }
      const [colabCreated] = await this.colaboratorsRepository.create(colabPayload)

      const colabAddressPayload: ColabAddress = {
        street: addressStreet,
        number: addressNumber,
        neighborhood: addressNeighborhood,
        complement: addressComplement,
        city: addressCity,
        state: addressState,
        cep: addressCep
      }
      const [colabAddressCreated] = await this.colabAddressRepository.create(colabAddressPayload)

      const relColabAddressPayload: RelColabAddress = {
        colabId: colabCreated.id,
        colabAddressId: colabAddressCreated.id
      }
      await this.relColabAddressRepository.create(relColabAddressPayload)

      return response.status(201).json({
        error: false,
        data: colabCreated
      })

    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: `Algo saiu como não esperado: ${err}`
      })
    }
  }

  async getAll (request: Request, response: Response) {
    try {
      const { limit, page } = request.query

      const filters = { limit, page }
      
      const [total] = await this.colaboratorsRepository.findAllColaborators(filters, true)
      const allColaborators = await this.colaboratorsRepository.findAllColaborators(filters)

      const mappedColaborators = allColaborators?.map((colaborator) => {
        return {
          colaborator: {
            id: colaborator.id,
            name: colaborator.name,
            email: colaborator.email,
            cpf: colaborator.cpf,
            active: colaborator.active,
            avatar: colaborator.avatar,
            createdAt: colaborator.createdAt,
            updatedAt: colaborator.updatedAt,
          },
          department: {
            id: colaborator.departmentId,
            name: colaborator.departmentName
          },
          address: {
            id: colaborator.addressId,
            street: colaborator.addressStreet,
            number: colaborator.addressNumber,
            neighborhood: colaborator.addressNeighborhood,
            complement: colaborator.addressComplement,
            city: colaborator.addressCity,
            state: colaborator.addressState,
            cep: colaborator.addressCep
          }
        }
      })

      return response.json({
        error: false,
        data: mappedColaborators,
        ...total,
        limit: Number(limit) || Number(process.env.LIST_PER_PAGE),
        pages: getPages(total, Number(limit)),
        page: page ? Number(page) : 1
      })
    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: `Algo saiu como não esperado: ${err}`
      })
    }
  }

  async getById (request: Request, response: Response) {
    try {
      const { id } = request.params

      const [colaboratorById] = await this.colaboratorsRepository.findColaboratorById(Number(id))
      if (!colaboratorById) {
        return response.status(404).json({
          error: true,
          message: 'O colaborador especificado não existe.'
        })
      }

      const colaborator = {
        colaborator: {
          id: colaboratorById.id,
          name: colaboratorById.name,
          email: colaboratorById.email,
          cpf: colaboratorById.cpf,
          active: colaboratorById.active,
          avatar: colaboratorById.avatar,
          createdAt: colaboratorById.createdAt,
          updatedAt: colaboratorById.updatedAt,
        },
        department: {
          id: colaboratorById.departmentId,
          name: colaboratorById.departmentName
        },
        address: {
          id: colaboratorById.addressId,
          street: colaboratorById.addressStreet,
          number: colaboratorById.addressNumber,
          neighborhood: colaboratorById.addressNeighborhood,
          complement: colaboratorById.addressComplement,
          city: colaboratorById.addressCity,
          state: colaboratorById.addressState,
          cep: colaboratorById.addressCep
        }
      }

      return response.json({
        error: false,
        data: colaborator
      })

    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: `Algo saiu como não esperado: ${err}`
      })
    }
  }

  async update (request: Request, response: Response) {
    try {
      const { id } = request.params
      const {
        name,
        email,
        cpf,
        departmentId,
        active
      }: Colaborator = request.body

      const [colaboratorById] = await this.colaboratorsRepository.findColaboratorById(Number(id))
      if (!colaboratorById) {
        return response.status(404).json({
          error: true,
          message: 'O colaborador especificado não existe.'
        })
      }
      const payload: Colaborator = {}

      if (name) { payload.name = name }
      if (email) {
        const [colaboratorWithEmail] = await this.colaboratorsRepository.findColaboratorWithExistingEmail(Number(id), email)
        if (colaboratorWithEmail) {
          return response.status(400).json({
            error: true,
            message: 'O email informado já existe.'
          })
        }
        payload.email = email
      }
      if (cpf) { payload.cpf = cpf }
      if (departmentId) { payload.departmentId = departmentId }

      if (active || String(active) === '0') { payload.active = active }

      if (Object.keys(payload).length) {
        await this.colaboratorsRepository.findByIdAndUpdate(Number(id), payload)
      }

      return response.json({
        error: false,
        message: 'O colaborador foi atualizado.'
      })

    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: `Algo saiu como não esperado: ${err}`
      })
    }
  }

  async delete (request: Request, response: Response) {
    try {
      const { id } = request.params

      if (!id) {
        return response.status(400).json({
          error: true,
          message: 'ID do colaborador não especificado.'
        })
      }

      const [colaborator] = await this.colaboratorsRepository.findOneBy('id', Number(id))
      if (!colaborator) {
        response.status(404).json({
          error: true,
          message: 'O colaborador especificado não existe.'
        })
      }

      await this.colaboratorsRepository.disableColaborator(Number(id))
      return response.status(204).send()

    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: `Algo saiu como não esperado: ${err}`
      })
    }
  }
}
