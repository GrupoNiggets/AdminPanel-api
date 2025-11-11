import Joi from 'joi'

export const createMessageSchema = Joi.object({
  messageId: Joi.string().optional(),
  content: Joi.string().min(1).max(2000).required(),
  userId: Joi.string().uuid().required(),
  meta: Joi.object().optional()
})

export const updateMessageSchema = Joi.object({
  content: Joi.string().min(1).max(2000),
  meta: Joi.object()
}).min(1)

export default { createMessageSchema, updateMessageSchema }