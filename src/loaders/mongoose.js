import mongoose from 'mongoose'
import { logger } from '../config/logger.js'
import { config } from '../config/index.js'

/**
 * Conecta a MongoDB usando mongoose.
 * Lanza el error si la conexión falla para que el proceso padre pueda decidir.
 */
export async function connectMongoose () {
  const uri = process.env.MONGO_URI || config.db?.uri || 'mongodb://localhost:27017/adminpanel'
  try {
    await mongoose.connect(uri)
    logger.info(`Conectado a MongoDB: ${uri}`)

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

export async function disconnectMongoose () {
  try {
    await mongoose.disconnect()
    logger.info('Desconectado de MongoDB')
  } catch (err) {
    logger.error('Error al desconectar MongoDB', { error: err })
  }
}

export default connectMongoose


