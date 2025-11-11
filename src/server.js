import http from 'http'
import buildApp from './app.js'
import { config } from './config/index.js'
import { logger } from './config/logger.js'
import { connectMongoose } from './loaders/mongoose.js'

async function startServer () {
  try {
    await connectMongoose()
  } catch (err) {
    logger.error('Error conectando a MongoDB', { error: err })
    process.exit(1)
  }

  const app = await buildApp()
  const server = http.createServer(app)

  server.listen(config.app.port, () => {
    logger.info(`Servidor iniciado en ${config.app.url} (env: ${config.env})`)
  })
}

startServer()

process.on('unhandledRejection', (reason) => {
  if (reason instanceof Error) {
    logger.error(`Unhandled Rejection: ${reason.message}`, { error: reason })
  } else {
    logger.error('Unhandled Rejection', { reason })
  }
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err })
  process.exit(1)
})
