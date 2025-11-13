//IMPORTS
import Joi from "joi";

//EXPORT createUserSchema (CREAR PLANTILLA)
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "user").default("user"),
});

//EXPORT updateUserSchema (ACTUALIZAR PLANTILLA)
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid("admin", "user"),
}).min(1);

//EXPORT DE createUserSchema Y updateUserSchema
export default { createUserSchema, updateUserSchema };
