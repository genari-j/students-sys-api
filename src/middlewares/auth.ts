import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const bearerToken = request.headers.authorization

  if (!bearerToken) {
    return response.status(401).json({
      error: true,
      message: 'Não autorizado!'
    })
  }

  const [, token] = bearerToken.split(' ')

  try {
    jwt.verify(token, process.env.APP_SECRET as string)
    return next()
  } catch (error) {
    return response.status(401).json({
      error: true,
      message: 'Não autorizado!'
    })
  }
}
