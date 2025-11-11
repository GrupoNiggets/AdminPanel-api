import Joi from 'joi'

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'user').default('user')
})

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid('admin', 'user')
}).min(1)

export default { createUserSchema, updateUserSchema }


