import { createExpressApp } from './loaders/express.js'
import { setupSwagger } from './loaders/swagger.js'

export function buildApp () {
  const app = createExpressApp()
  setupSwagger(app)
  return app
}

export default buildApp


