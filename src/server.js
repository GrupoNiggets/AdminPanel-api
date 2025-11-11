import http from 'http'
import buildApp from './app.js'
import { config } from './config/index.js'
import { logger } from './config/logger.js'

const app = buildApp()
const server = http.createServer(app)

server.listen(config.app.port, () => {
  logger.info(`Servidor iniciado en ${config.app.url} (env: ${config.env})`)
})

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason })
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err })
  process.exit(1)
})


