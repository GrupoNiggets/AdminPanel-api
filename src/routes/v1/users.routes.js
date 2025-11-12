import { Router } from 'express'
import { listUsers, getUser, createUser, updateUser, deleteUser } from '../../modules/users/user.index.js'
import { createUserSchema, updateUserSchema } from '../../modules/users/user.validator.js'
import Joi from 'joi'

const router = Router();

//FUNCIÓN validate (VALIDACIÓN DE DATOS CON [GET, DELETE, POST, PUT, PATCH])
function validate(schema) {
  return (req, res, next) => {
    const toValidate = ["GET", "DELETE"].includes(req.method) ? req.params : req.body;
    const result = schema.validate(toValidate, { abortEarly: false, stripUnknown: true });
    if (result.error) {
      const details = result.error.details.map((d) => d.message);
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Datos inválidos", details } });
    }
    if (["POST", "PUT", "PATCH"].includes(req.method)) req.body = result.value;
    else req.params = result.value;
    next();
  };
}

//RUTAS USUARIOS
//MUESTRA LA LISTA DE USUARIOS
router.get("/", listUsers);

//MUESTRA UN USUARIO POR ID
router.get("/:id", validate(Joi.object({ id: Joi.string().uuid().required() })), getUser );

//VALIDA Y ENVÍA LOS USUARIOS
router.post("/", validate(createUserSchema), createUser);

//VALIDA Y ACTUALIZA UN USUARIO POR ID
router.put( "/:id", validate(Joi.object({ id: Joi.string().uuid().required() })), validate(updateUserSchema), updateUser );

//VALIDA Y ELIMINA UN USUARIO POR ID
router.delete( "/:id", validate(Joi.object({ id: Joi.string().uuid().required() })), deleteUser );

export default router;
