import dotenv from 'dotenv'

dotenv.config()

const nodeEnv = process.env.NODE_ENV || 'development'

export const config = {
  env: nodeEnv,
  isDev: nodeEnv === 'development',
  isTest: nodeEnv === 'test',
  isProd: nodeEnv === 'production',
  app: {
    name: process.env.APP_NAME || 'adminpanel-api',
    url: process.env.APP_URL || 'http://localhost:3000',
    port: parseInt(process.env.PORT || '3000', 10)
  },
  db: {
    uri: process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/adminpanel',
    name: process.env.MONGO_DB || 'adminpanel'
  },
  log: {
    level: process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug')
  }
}

export default config


