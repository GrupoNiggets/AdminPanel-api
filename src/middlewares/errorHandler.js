import { AppError } from '../utils/AppError.js'
import { logger } from '../config/logger.js'

// eslint-disable-next-line no-unused-vars
export function errorHandler (err, req, res, next) {
  const isKnown = err instanceof AppError
  const status = isKnown ? err.statusCode : 500
  const code = isKnown ? err.code : 'INTERNAL_SERVER_ERROR'
  const message = isKnown ? err.message : 'Ha ocurrido un error interno'

  logger.error('Request error', {
    path: req.originalUrl,
    method: req.method,
    status,
    code,
    message,
    stack: isKnown ? undefined : err.stack
  })

  res.status(status).json({
    success: false,
    error: { code, message }
  })
}

export default errorHandler


