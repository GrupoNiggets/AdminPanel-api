import { Router } from 'express'
import Joi from 'joi'
import {
  listMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage
} from '../../modules/chat/chat.controller.js'
import { createMessageSchema, updateMessageSchema } from '../../modules/chat/chat.validator.js'

const router = Router()

function validate (schema) {
  return (req, res, next) => {
    const toValidate = ['GET', 'DELETE'].includes(req.method) ? req.params : req.body
    const result = schema.validate(toValidate, { abortEarly: false, stripUnknown: true })
    if (result.error) {
      const details = result.error.details.map(d => d.message)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details } })
    }
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) req.body = result.value
    else req.params = result.value
    next()
  }
}

router.get('/', listMessages)
router.get('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), getMessage)
router.post('/', validate(createMessageSchema), createMessage)
router.put('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), validate(updateMessageSchema), updateMessage)
router.delete('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), deleteMessage)

export default router
