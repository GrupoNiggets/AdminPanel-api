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
      //CHAT
      Chat: {
        type: 'object',
        //PROPIEDADES
        properties: {
          //ID
          id: { type: 'string', format: 'uuid' },
          //USERID
          userId: { type: 'string', format: 'uuid' },
          //MESSAGEID
          messageId: { type: 'string', format: 'uuid' },
          //CONTENT
          content: { type: 'string' },
          //TIEMPO DE CREACIÓN
          createdAt: { type: 'date' },
          //TIEMPO DE ACTUALIZACIÓN
          updatedAt: { type: 'date' }
        }
      },
      //POSTS
      Posts: {
        type: 'object',
        //PROPIEDADES
        properties: {
          //USERID
          userId: { type: 'string', format: 'uuid' },
          //CONTENT
          content: { type: 'string' },
          //COORDINATES
          coordinates: { type: 'coordinates' },
          //POSTID
          postId: { type: 'string', format: 'uuid' },
          //TIEMPO DE CREACIÓN
          createdAt: { type: 'string', format: 'date-time' },
          //TIEMPO DE ACTUALIZACIÓN
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      //STATUS
      Status: {
        type: 'object',
        //PROPIEDADES
        properties: {
          //ID
          _id: { type: 'string', format: 'uuid' },
          //RESPONSECODE
          responseCode: { type: 'int32' },
          //RESPONSETIME
          responseTime: { type: 'int32' },
          //TIMESTAMP
          timestamp: { type: 'string', format: 'date-time' },
          //__V
          __v: { type: 'int32' }
        }
      },
      //USER
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
          updatedAt: { type: 'string', format: 'date-time' },
          //PREMIUM
          premium: { type: 'boolean', default: false }
        }
      }
    }
  }
}

//EXPORT swaggerDefinition
export default swaggerDefinition
