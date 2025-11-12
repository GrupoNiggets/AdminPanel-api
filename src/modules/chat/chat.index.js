import { notFound } from '../../utils/AppError.js'
import { created, noContent, ok } from '../../utils/ApiResponse.js'
import { asyncHandler } from '../../middlewares/asyncHandler.js'
import { ChatModel } from './chat.mongoose.js'
import { toPublicUser } from '../users/users.index.js'
import { UserRepository } from '../users/users.index.js'

// ========== MODEL ==========
const userRepo = new UserRepository()

export function toPublicMessage (msg) {
  if (!msg) return null
  const { id, messageId, content, userId, meta, createdAt, updatedAt } = msg
  return { id, messageId, content, userId, meta, createdAt, updatedAt }
}

export async function toPublicMessageWithUser (msg) {
  if (!msg) return null
  const base = toPublicMessage(msg)
  const user = await userRepo.getById(base.userId)
  base.user = toPublicUser(user)
  return base
}

// ========== REPOSITORY ==========
export class ChatRepository {
  async list () {
    const docs = await ChatModel.find({}).sort({ createdAt: -1 }).lean().exec()
    return docs
  }

  async getById (id) {
    const doc = await ChatModel.findOne({ id }).lean().exec()
    return doc || null
  }

  async create (data) {
    const created = await ChatModel.create(data)
    return created.toObject()
  }

  async update (id, changes) {
    const updated = await ChatModel.findOneAndUpdate(
      { id },
      { $set: changes },
      { new: true, lean: true }
    ).exec()
    return updated || null
  }

  async remove (id) {
    const res = await ChatModel.deleteOne({ id }).exec()
    return res.deletedCount === 1
  }
}

// ========== SERVICE ==========
export class ChatService {
  constructor (deps = {}) {
    this.chatRepository = deps.chatRepository || new ChatRepository()
    this.userRepository = deps.userRepository || new UserRepository()
  }

  async listMessages () {
    const items = await this.chatRepository.list()
    const results = await Promise.all(items.map((i) => toPublicMessageWithUser(i)))
    return results
  }

  async getMessage (id) {
    const msg = await this.chatRepository.getById(id)
    if (!msg) throw notFound('Mensaje no encontrado')
    return toPublicMessageWithUser(msg)
  }

  async createMessage (payload) {
    const user = await this.userRepository.getById(payload.userId)
    if (!user) throw notFound('Usuario asociado no encontrado')
    const created = await this.chatRepository.create(payload)
    return toPublicMessageWithUser(created)
  }

  async updateMessage (id, payload) {
    const updated = await this.chatRepository.update(id, payload)
    if (!updated) throw notFound('Mensaje no encontrado')
    return toPublicMessageWithUser(updated)
  }

  async deleteMessage (id) {
    const ok = await this.chatRepository.remove(id)
    if (!ok) throw notFound('Mensaje no encontrado')
    return true
  }
}

// ========== CONTROLLER ==========
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
