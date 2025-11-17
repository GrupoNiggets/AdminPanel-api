//IMPORTS
import Joi from "joi";

//EXPORT createUserSchema (CREAR PLANTILLA)
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "user").default("user"),
  premium: Joi.boolean().default(false),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden(),
});

//EXPORT updateUserSchema (ACTUALIZAR PLANTILLA)
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid("admin", "user"),
  premium: Joi.boolean(),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden(),
}).min(1);

//EXPORT DE createUserSchema Y updateUserSchema
export default { createUserSchema, updateUserSchema };
