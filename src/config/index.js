//IMPORTS
import dotenv from 'dotenv'

//CARGA DE VARIABLES DE ENTORNO DESDE .env A process.env
dotenv.config()

//DETERMINACIÓN DE ENTORNO
const nodeEnv = process.env.NODE_ENV || 'development'

//CONFIGURACIÓN
export const config = {
  //ENTORNO ACTUAL
  env: nodeEnv,
  //BOOLEANOS PARA CONDICIONALES DEL ENTORNO
  isDev: nodeEnv === 'development',
  isTest: nodeEnv === 'test',
  isProd: nodeEnv === 'production',

  //APP
  app: {
    //NOMBRE
    name: process.env.APP_NAME || 'adminpanel-api',
    //URL
    url: process.env.APP_URL || 'http://localhost:3000',
    //PUERTO
    port: parseInt(process.env.PORT || '3000', 10)
  },

  //MONGODB
  mongo: {
    //URI
    uri: process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017',
    //NOMBRE BASE DE DATOS
    dbName: process.env.MONGO_DB || 'radius'
  },

  //LOG
  log: {
    //NIVEL
    level: process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug')
  }
}

//EXPORT config
export default config


