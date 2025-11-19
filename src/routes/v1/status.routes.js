import { Router } from 'express'
import Joi from 'joi'
import { getStatus, pingStatus } from '../../modules/status/status.index.js'

const router = Router()

function validate(schema) {
  return (req, res, next) => {
    const toValidate = ["GET", "DELETE"].includes(req.method) ? req.params : req.body
    const result = schema.validate(toValidate, { abortEarly: false, stripUnknown: true })
    if (result.error) {
      const details = result.error.details.map(d => d.message)
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Datos inválidos", details } })
    }
    if (["POST", "PUT", "PATCH"].includes(req.method)) req.body = result.value
    else req.params = result.value
    next()
  }
}

// RUTAS STATUS
/**
 * @swagger
 * /v1/status:
 *   get:
 *     summary: Obtener estado del sistema
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Estado del sistema obtenido exitosamente
 */
router.get('/', getStatus)

/**
 * @swagger
 * /v1/status/ping:
 *   post:
 *     summary: Ping al sistema
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Pong recibido exitosamente
 */
router.post('/ping', validate(Joi.object({})), pingStatus)

export default router