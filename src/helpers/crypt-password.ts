import bcrypt from 'bcrypt'

export const cryptPassword = (password: string | undefined) => {
  const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUNDS))
  if (password) { return bcrypt.hashSync(password, salt) }
}
