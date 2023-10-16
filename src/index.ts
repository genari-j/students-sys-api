import Application from './app'
import { databaseHealth } from './adapters/mysql'

Application.express.listen(process.env.APP_PORT, async () => {
  await databaseHealth()
  console.log('Application is running [ON] port:', process.env.APP_PORT)
})
