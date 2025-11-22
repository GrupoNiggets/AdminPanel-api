//IMPORTS
import Joi from "joi";

//EXPORT createBugSchema (CREAR PLANTILLA)
export const createBugSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(5).max(1000).required(),
  reporter: Joi.string().min(2).max(100).required(),
  status: Joi.string()
    .valid("ABIERTO", "EN PROGRESO", "RESUELTO")
    .default("ABIERTO"),
  priority: Joi.string().valid("ALTA", "MEDIA", "BAJA").default("MEDIA"),
});

//EXPORT updateBugSchema (ACTUALIZAR PLANTILLA)
export const updateBugSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  description: Joi.string().min(5).max(1000),
  reporter: Joi.string().min(2).max(100),
  status: Joi.string().valid("ABIERTO", "EN PROGRESO", "RESUELTO"),
  priority: Joi.string().valid("ALTA", "MEDIA", "BAJA"),
}).min(1);

//EXPORT DE createBugSchema Y updateBugSchema
export default { createBugSchema, updateBugSchema };
