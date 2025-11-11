export class AppError extends Error {
  constructor (message, statusCode = 500, code = 'APP_ERROR') {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
  }
}

export function badRequest (message, code = 'BAD_REQUEST') {
  return new AppError(message, 400, code)
}

export function notFound (message, code = 'NOT_FOUND') {
  return new AppError(message, 404, code)
}

export function unauthorized (message, code = 'UNAUTHORIZED') {
  return new AppError(message, 401, code)
}

export function forbidden (message, code = 'FORBIDDEN') {
  return new AppError(message, 403, code)
}

export default AppError


