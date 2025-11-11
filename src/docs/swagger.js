export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AdminPanel API',
    version: '0.1.0',
    description: 'API enterprise de ejemplo con Express'
  },
  servers: [
    { url: '/api', description: 'API Base' }
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['admin', 'user'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
}

export default swaggerDefinition


