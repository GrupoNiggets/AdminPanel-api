//DEFINICIÓN Y EXPORTACIÓN DE swaggerDefinition
export const swaggerDefinition = {
  //VERSIÓN OpenAPI
  openapi: '3.0.0',
  //INFORMACIÓN
  info: {
    //TÍTULO
    title: 'AdminPanel API',
    //VERSIÓN
    version: '0.1.0',
    //DESCRIPCIÓN
    description: 'API enterprise de ejemplo con Express'
  },

  //LISTA DE SERVIDORES
  servers: [
    //URL Y DESCRIPCIÓN
    { url: '/api', description: 'API Base' }
  ],

  //DEFINICIÓN DE LOS ESQUEMAS REUTILIZABLES
  components: {
    schemas: {
      User: {
        type: 'object',
        //PROPIEDADES
        properties: {
          //ID
          id: { type: 'string', format: 'uuid' },
          //NOMBRE
          name: { type: 'string' },
          //EMAIL
          email: { type: 'string', format: 'email' },
          //ROL
          role: { type: 'string', enum: ['admin', 'user'] },
          //TIEMPO DE CREACIÓN
          createdAt: { type: 'string', format: 'date-time' },
          //TIEMPO DE ACTUALIZACIÓN
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
}

//EXPORT swaggerDefinition
export default swaggerDefinition


