import { createExpressApp } from './loaders/express.js'
import { setupSwagger } from './loaders/swagger.js'

export async function buildApp () {
  const app = await createExpressApp()
  setupSwagger(app)
  return app
}

export default buildApp


