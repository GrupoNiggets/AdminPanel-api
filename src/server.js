import http from 'http'
import buildApp from './app.js'
import { config } from './config/index.js'
import { logger } from './config/logger.js'
import { connectMongo } from './loaders/mongoose.js'

const app = buildApp()
const server = http.createServer(app)

async function start () {
  try {
    // Conectamos a Mongo antes de arrancar el servidor
    await connectMongo()

    server.listen(config.app.port, () => {
      logger.info(`Servidor iniciado en ${config.app.url} (env: ${config.env})`)
    })
  } catch (err) {
    logger.error('No se pudo iniciar la aplicación debido a un error de inicio', { error: err })
    process.exit(1)
  }
}

start()

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason })
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err })
  process.exit(1)
})


