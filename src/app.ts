import express, { Express } from 'express'
import cors from 'cors'
import routes from './routes'

class Application {
  public readonly express: Express

  constructor () {
    this.express = express()
    this.userCors()
    this.middlewares()
    this.routes()
  }

  userCors() {
    this.express.use(cors())
  }

  middlewares() {
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
  }

  routes() {
    this.express.use(routes)
  }
}

export default new Application()
