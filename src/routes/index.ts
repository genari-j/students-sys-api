import express, { Request, Response } from 'express'
import { colaboratorsRoutes } from './colaborators'
import { colabDepartmentsRoutes } from './colab-departments'

const routes = express.Router()

routes.get('/', (_request: Request, response: Response) => {
  return response.json({
    error: false,
    message: 'API is running 💻'
  })
})

routes.use(colaboratorsRoutes)
routes.use(colabDepartmentsRoutes)

export default routes
