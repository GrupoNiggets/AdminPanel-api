import mongoose from 'mongoose'
import { logger } from '../config/logger.js'

/**
 * Conecta a MongoDB usando mongoose.
 * Lanza el error si la conexión falla para que el proceso padre pueda decidir.
 */
export async function connectMongo () {
  const uri = process.env.MONGO_URI

  if (!uri) {
    logger.error('MONGO_URI no está configurada. Añade MONGO_URI en el archivo .env')
    throw new Error('MONGO_URI no configurada')
  }

  // Redactamos credenciales para el log (no imprimir usuario/password en logs)
  const redactedUri = uri.replace(/:\/\/([^:@]+):([^@]+)@/, '://***:***@')
  logger.info(`Usando MONGO_URI: ${redactedUri}`)

  try {
    await mongoose.connect(uri)
    logger.info('Conectado a MongoDB')

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err })
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })
  } catch (err) {
    logger.error('Error conectando a MongoDB', { error: err })
    throw err
  }
}

export async function disconnectMongo () {
  try {
    await mongoose.disconnect()
    logger.info('Desconectado de MongoDB')
  } catch (err) {
    logger.error('Error al desconectar MongoDB', { error: err })
  }
}

export default connectMongo
