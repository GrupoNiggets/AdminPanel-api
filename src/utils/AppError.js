//MENSAJE DE ERROR EN LA APP
export class AppError extends Error {
  constructor(message, statusCode = 500, code = "APP_ERROR") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

//FUNCIÓN badRequest (CONSULTA ERRÓNEA)
export function badRequest(message, code = "BAD_REQUEST") {
  return new AppError(message, 400, code);
}

//FUNCIÓN notFound (RESULTADO DE CONSULTA NO ENCONTRADO)
export function notFound(message, code = "NOT_FOUND") {
  return new AppError(message, 404, code);
}

//FUNCIÓN unauthorized (CONSULTA NO AUTORIZADA)
export function unauthorized(message, code = "UNAUTHORIZED") {
  return new AppError(message, 401, code);
}

//FUNCIÓN forbidden (CONSULTA PROHIBIDA)
export function forbidden(message, code = "FORBIDDEN") {
  return new AppError(message, 403, code);
}

export default AppError;
