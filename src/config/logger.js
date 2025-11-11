import winston from 'winston'
import { config } from './index.js'

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, { message: info.message, stack: info.stack })
  }
  return info
})

export const logger = winston.createLogger({
  level: config.log.level,
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: config.app.name, env: config.env },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
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

export default logger


