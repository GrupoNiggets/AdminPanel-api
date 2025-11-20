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

router.get('/', getStatus)
router.get('/ping', validate(Joi.object({})), pingStatus)
router.get('/history', getPingHistory)
router.get('/forzar-403', (req, res) => {
  res.status(403).json({ error: "forzado 403" })
})
router.get('/forzar-500', (req, res) => {
  res.status(500).json({ error: "forzado 500 Internal Server Error" })
})


export default router
