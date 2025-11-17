import { Router } from 'express'
import Joi from 'joi'
import {
  listMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage
} from '../../modules/chat/chat.index.js'
import { createMessageSchema, updateMessageSchema } from '../../modules/chat/chat.validator.js'

const router = Router()

function validateBody (schema) {
  return (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false, stripUnknown: true })
    if (result.error) {
      const details = result.error.details.map(d => d.message)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details } })
    }
    req.body = result.value
    next()
  }
}

function validateParams (schema) {
  return (req, res, next) => {
    const result = schema.validate(req.params, { abortEarly: false, stripUnknown: true })
    if (result.error) {
      const details = result.error.details.map(d => d.message)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details } })
    }
    req.params = result.value
    next()
  }
}

const idSchema = Joi.object({ id: Joi.string().uuid().required() })

router.get('/', listMessages)
router.get('/:id', validateParams(idSchema), getMessage)
router.post('/', validateBody(createMessageSchema), createMessage)
router.put('/:id', validateParams(idSchema), validateBody(updateMessageSchema), updateMessage)
router.patch('/:id', validateParams(idSchema), validateBody(updateMessageSchema), updateMessage)
router.delete('/:id', validateParams(idSchema), deleteMessage)

export default router
