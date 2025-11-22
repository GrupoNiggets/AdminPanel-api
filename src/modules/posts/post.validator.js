//IMPORTS
import Joi from "joi";

//coordinatesSchema
const coordinatesSchema = Joi.object({
  type: Joi.string().valid("Point").default("Point"),
  coordinates: Joi.array()
    .items(Joi.number().min(-180).max(180), Joi.number().min(-90).max(90))
    .length(2)
    .required(),
});

//EXPORT createPostSchema (CREAR PLANTILLA)
export const createPostSchema = Joi.object({
  userId: Joi.string().trim().required(),
  content: Joi.string().trim().min(1).max(2000).required(),
  coordinates: coordinatesSchema.required(),
});

//EXPORT updatePostSchema (ACTUALIZAR PLANTILLA)
export const updatePostSchema = Joi.object({
  userId: Joi.string().trim(),
  content: Joi.string().trim().min(1).max(2000),
  coordinates: coordinatesSchema,
}).min(1);

//EXPORT DE createPostSchema Y updatePostSchema
export default { createPostSchema, updatePostSchema };
