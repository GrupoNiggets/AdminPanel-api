import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { notFoundHandler } from '../middlewares/notFound.js'
import { errorHandler } from '../middlewares/errorHandler.js'
import { setupSwagger } from './swagger.js'
import config from '../config/index.js'

export async function createExpressApp() {
  const app = express()

  app.set('trust proxy', 1)
  // Disable Helmet for Swagger docs and force HSTS expiry
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/docs')) {
      // Force browser to clear HSTS cache
      res.setHeader('Strict-Transport-Security', 'max-age=0')
      return next()
    }
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:']
        }
      },
      hsts: false, // Disable HSTS to prevent forcing HTTPS in development
      crossOriginOpenerPolicy: false, // Disable COOP header
      crossOriginResourcePolicy: false // Disable CORP header
    })(req, res, next)
  })

  app.use(cors())
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(compression())

  if (!config.isProd) {
    app.use(morgan('dev'))
  }

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
  app.use(limiter)

  // Setup Swagger documentation
  setupSwagger(app)

  const { default: routes } = await import('../routes/index.js')
  app.use('/api', routes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

export default createExpressApp


