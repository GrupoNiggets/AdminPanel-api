//IMPORTS
import { created, noContent, ok } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { UserService } from "./user.service.js";

const userService = new UserService();

//EXPORTS
//EXPORT DE listUsers (LISTAR USUARIOS)
export const listUsers = asyncHandler(async (req, res) => {
  const data = await userService.listUsers();
  ok(res, data);
});

//EXPORT DE getUser (CONSEGUIR USUARIO)
export const getUser = asyncHandler(async (req, res) => {
  const data = await userService.getUser(req.params.id);
  ok(res, data);
});

//EXPORT DE createUser (CREAR USUARIO)
export const createUser = asyncHandler(async (req, res) => {
  const data = await userService.createUser(req.body);
  created(res, data);
});

//EXPORT updateUser (ACTUALIZAR USUARIO)
export const updateUser = asyncHandler(async (req, res) => {
  const data = await userService.updateUser(req.params.id, req.body);
  ok(res, data);
});

//EXPORT deleteUser (ELIMINAR USUARIO)
export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  noContent(res);
});
