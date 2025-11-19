import { createExpressApp } from './loaders/express.js'

export async function buildApp() {
  const app = await createExpressApp()
  return app
}

export default buildApp