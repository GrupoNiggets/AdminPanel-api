import { Router } from 'express'
import Joi from 'joi'
import { getStatus, pingStatus, getPingHistory } from '../../modules/status/status.index.js'

const router = Router()

function validate(schema) {
  return (req, res, next) => {
    const toValidate = ["GET", "DELETE"].includes(req.method) ? req.params : req.body
    const result = schema.validate(toValidate, { abortEarly: false, stripUnknown: true })

    if (result.error) {
      const details = result.error.details.map(d => d.message)
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Datos inválidos", details }
      })
    }

    if (["POST", "PUT", "PATCH"].includes(req.method)) req.body = result.value
    else req.params = result.value

    next()
  }
}

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
 *   get:
 *     summary: Ping al sistema (GET)
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Pong recibido exitosamente
 *   post:
 *     summary: Ping al sistema (POST)
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Pong recibido exitosamente
 */
router.get('/ping', validate(Joi.object({})), pingStatus)
router.post('/ping', validate(Joi.object({})), pingStatus)

/**
 * @swagger
 * /v1/status/history:
 *   get:
 *     summary: Obtener historial de pings
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Historial de pings obtenido exitosamente
 */
router.get('/history', getPingHistory)

export default router
