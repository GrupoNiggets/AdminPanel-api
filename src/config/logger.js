//IMPORTS
import winston from 'winston'
import { config } from './index.js'

//DETECCIÓN DE LOG (ERROR O NO)
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, { message: info.message, stack: info.stack })
  }
  return info
})

//CREAR LOGGER
export const logger = winston.createLogger({
  //USO DE DEBUG O INFO
  level: config.log.level,
  //FORMATO COMBINADO
  format: winston.format.combine(
    //DETECCIÓN DE LOG (ERROR O NO)
    enumerateErrorFormat(),
    //MARCA DE TIEMPO
    winston.format.timestamp(),
    //INCLUIR LA TRAZA DE PILA DEL ERROR PARA TENER EL RASTRO COMPLETO
    winston.format.errors({ stack: true }),
    //FORMATO EN JSON
    winston.format.json()
  ),
  
  //METADATOS POR DEFECTO
  defaultMeta: { service: config.app.name, env: config.env },
  
  //LISTA DE SALIDAS
  transports: [
    //SALIDA EN CONSOLA
    new winston.transports.Console({
      //FORMATO COMBINADO
      format: winston.format.combine(
        //AÑADE COLOR AL FORMATO
        winston.format.colorize(),
        //IMPRESIÓN EN CONSOLA
        winston.format.printf((info) => {
          const { level, message, timestamp, stack, ...meta } = info
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
          return stack
            ? `${timestamp} ${level}: ${message}\n${stack}${metaStr}`
            : `${timestamp} ${level}: ${message}${metaStr}`
        })
      )
    })
  ]
})

//EXPORT logger
export default logger


