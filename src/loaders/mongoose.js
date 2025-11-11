import mongoose from 'mongoose'
import { config } from '../config/index.js'
import { logger } from '../config/logger.js'

let isConnected = false

export async function connectMongoose () {
  if (isConnected) return mongoose.connection
  const uri = `${config.mongo.uri}/${config.mongo.dbName}`
  await mongoose.connect(uri, {
    maxPoolSize: 20
  })
  isConnected = true
  logger.info('Conectado a MongoDB con Mongoose', { uri, db: config.mongo.dbName })
  return mongoose.connection
}

export default { connectMongoose }


