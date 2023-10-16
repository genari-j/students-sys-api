import Joi from 'joi'

export const validateSignInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'O e-mail precisa conter um domínio válido.',
    'any.required': 'O e-mail é obrigatório.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'A senha deve conter no mínimo 6 caracteres.',
    'any.required': 'A senha é obrigatória.'
  })
})

export const validateSignUpSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Nome inválido.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'O e-mail precisa conter um domínio válido.',
    'any.required': 'E-mail inválido.'
  }),
  cpf: Joi.string().required().messages({
    'any.required': 'CPF inválido.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'A senha deve conter no mínimo 6 caracteres.',
    'any.required': 'Senha inválida.'
  }),
  departmentId: Joi.number().required().messages({
    'any.required': 'Departamento inválido.'
  }),
  addressStreet: Joi.string().required().messages({
    'any.required': 'Rua inválida.'
  }),
  addressNumber: Joi.string().required().messages({
    'any.required': 'Número inválido.'
  }),
  addressNeighborhood: Joi.string().required().messages({
    'any.required': 'Bairro inválido.'
  }),
  addressComplement: Joi.string().required().messages({
    'any.required': 'Complemento inválido.'
  }),
  addressCity: Joi.string().required().messages({
    'any.required': 'Cidade inválida.'
  }),
  addressState: Joi.string().required().messages({
    'any.required': 'Estado inválido.'
  }),
  addressCep: Joi.string().required().messages({
    'any.required': 'CEP inválido.'
  })
})
