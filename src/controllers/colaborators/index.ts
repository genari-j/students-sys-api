import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { mailService } from '../../services/send-email'

import ExcelJS from 'exceljs'
import { format } from 'date-fns'

import { Colaborator, ColaboratorsRepository } from '../../repositories/interfaces/colaborators'
import { ColabAddress, ColabAddressRepository } from '../../repositories/interfaces/colab-address'
import { RelColabAddress, RelColabAddressRepository } from '../../repositories/interfaces/rel-colab-address'

import { cryptPassword, getPages } from '../../helpers'
import { validateSignInSchema, validateSignUpSchema } from '../../validators/colaborators'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

  async updatePassword (request: Request, response: Response) {
    try {
      const bearerToken: any = request.headers.authorization
      const [, token] = bearerToken.split(' ')
      const result = jwt.verify(token, process.env.APP_SECRET as string)
      const { sub } = result

      const { password, confirmPassword } = request.body

      const [user] = await this.colaboratorsRepository.findOneBy('id', sub)
      if (!user) {
        return response.status(404).json({
          error: true,
          message: 'O Usuário especificado não foi encontrada.'
        })
      }

      if (password !== confirmPassword) {
        return response.status(400).json({
          error: true,
          message: 'As senhas especificadas não conferem.'
        })
      }

      if (password.length < 6) {
        return response.status(400).json({
          error: true,
          message: 'A senha deve conter no mínimo 6 caracteres.'
        })
      }

      const encryptedPassword = cryptPassword(password)
      const payload = { password: encryptedPassword }
      await this.colaboratorsRepository.findByIdAndUpdate(Number(sub), payload)

      return response.status(200).json({
        error: false,
        message: 'A senha foi atualizada.'
      })
    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: err.toString()
      })
    }
  }

  async verifyToken (_request: Request, response: Response) {
    try {
      return response.status(200).send()
    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: err.toString()
      })
    }
  }

  async solicitationReset (request: Request, response: Response) {
    try {
      const { email } = request.body

      const [userWithEmail] = await this.colaboratorsRepository.findOneBy('email', email)
      if (!userWithEmail) {
        return response.status(404).json({
          error: true,
          message: 'O E-mail especificado não foi encontrado.'
        })
      }

      const token = jwt.sign(
        { sub: userWithEmail.id },
        process.env.APP_SECRET as string,
        {expiresIn: process.env.EXPIRATION_TO_RESET_PASSWORD_TOKEN as string}
      )

      // COMO FUNCIONOU NA AWS
      // const emailPath = path.resolve(__dirname, '..', 'src', 'solicitation-reset.html')
      const emailPath = path.resolve(__dirname, '..', '..', 'emails', 'solicitation-reset.html')
      const [firstName] = userWithEmail.name.split(' ')

      const html = fs.readFileSync(emailPath, { encoding: 'utf-8' })
        .replace('{{ emailLink }}', `${process.env.URL_FRONTEND}/confirmacao-nova-senha?token=${token}`)
        .replace('{{ name }}', firstName)

      await mailService(email, 'Students Sys - Recuperação de Senha', html)

      return response.status(200).json({
        data: {
          error: false,
          message: 'Um e-mail de recuperação de senha foi enviado.'
        }
      })

    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: err.toString()
      })
    }
  }

  async exportColaboratorsToExcel (_request: Request, response: Response) {
    try {
      const colaborators = await this.colaboratorsRepository.findAllColaborators({}, false)
      const mappedColaborators = colaborators.map(colaborator => ({
        ID: colaborator.id,
        Nome: colaborator.name,
        Email: colaborator.email,
        Ativo: colaborator.active,
        Departamento: colaborator.departmentName,
        Rua: colaborator.addressStreet,
        Nº: colaborator.addressNumber,
        Bairro: colaborator.addressNeighborhood,
        Complemento: colaborator.addressComplement,
        Cidade: colaborator.addressCity,
        Estado: colaborator.addressState,
        CEP: colaborator.addressCep,
        Cadastro: format(new Date(colaborator.createdAt), 'dd/MM/yyyy')
      }))

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Sheet1')

      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 13, column: 13 }
      }

      worksheet.getColumn(1).width = 8
      worksheet.getColumn(2).width = 30
      worksheet.getColumn(3).width = 30
      worksheet.getColumn(4).width = 8
      worksheet.getColumn(5).width = 30
      worksheet.getColumn(6).width = 12
      worksheet.getColumn(7).width = 20
      worksheet.getColumn(8).width = 15
      worksheet.getColumn(9).width = 20
      worksheet.getColumn(10).width = 20
      worksheet.getColumn(11).width = 20
      worksheet.getColumn(12).width = 20
      worksheet.getColumn(13).width = 20

      const headerRow = worksheet.addRow(Object.keys(mappedColaborators[0]))
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '1B8C76' }
        };
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFF' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })

      mappedColaborators.forEach((colaborator, index) => {
        const rowValues = Object.values(colaborator)
        const row = worksheet.addRow(rowValues)

        const rowColor = index % 2 === 0 ? 'FFFFFF' : '3CB19C50'

        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: rowColor }
          }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })
      })

      const excelBuffer = await workbook.xlsx.writeBuffer()

      response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      response.setHeader('Contet-Disposition', 'attachment. filename="colaborators.xlsx"')

      response.send(excelBuffer)

    } catch (err: any) {
      return response.status(500).json({
        error: true,
        message: err.toString()
      })
    }
  }
}
