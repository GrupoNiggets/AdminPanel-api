import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { swaggerDefinition } from '../docs/swagger.js'

export function setupSwagger(app) {
  const specs = swaggerJSDoc({
    definition: swaggerDefinition,
    apis: ['./src/routes/**/*.js']
  })
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }))
}

export default setupSwagger


