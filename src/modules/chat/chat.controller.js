import { created, noContent, ok } from '../../utils/ApiResponse.js'
import { asyncHandler } from '../../middlewares/asyncHandler.js'
import { ChatService } from './chat.service.js'

const chatService = new ChatService()

export const listMessages = asyncHandler(async (req, res) => {
  const data = await chatService.listMessages()
  ok(res, data)
})

export const getMessage = asyncHandler(async (req, res) => {
  const data = await chatService.getMessage(req.params.id)
  ok(res, data)
})

export const createMessage = asyncHandler(async (req, res) => {
  const data = await chatService.createMessage(req.body)
  created(res, data)
})

export const updateMessage = asyncHandler(async (req, res) => {
  const data = await chatService.updateMessage(req.params.id, req.body)
  ok(res, data)
})

export const deleteMessage = asyncHandler(async (req, res) => {
  await chatService.deleteMessage(req.params.id)
  noContent(res)
})
