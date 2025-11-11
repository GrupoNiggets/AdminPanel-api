import { created, noContent, ok } from '../../utils/ApiResponse.js'
import { asyncHandler } from '../../middlewares/asyncHandler.js'
import { UserService } from './user.service.js'

const userService = new UserService()

export const listUsers = asyncHandler(async (req, res) => {
  const data = await userService.listUsers()
  ok(res, data)
})

export const getUser = asyncHandler(async (req, res) => {
  const data = await userService.getUser(req.params.id)
  ok(res, data)
})

export const createUser = asyncHandler(async (req, res) => {
  const data = await userService.createUser(req.body)
  created(res, data)
})

export const updateUser = asyncHandler(async (req, res) => {
  const data = await userService.updateUser(req.params.id, req.body)
  ok(res, data)
})

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id)
  noContent(res)
})


