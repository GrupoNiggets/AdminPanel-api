import { badRequest, notFound } from '../../utils/AppError.js'
import { created, noContent, ok } from '../../utils/ApiResponse.js'
import { asyncHandler } from '../../middlewares/asyncHandler.js'
import { UserModel } from './status.mongoose.js'

// ========== MODEL ==========
export const userFields = {
  id: 'string',
  name: 'string',
  email: 'string',
  role: 'string',
  createdAt: 'date',
  updatedAt: 'date'
}

export function toPublicUser (user) {
  if (!user) return null
  const { id, name, email, role, createdAt, updatedAt } = user
  return { id, name, email, role, createdAt, updatedAt }
}

// ========== REPOSITORY ==========
export class UserRepository {
  async list () {
    const docs = await UserModel.find({}).lean().exec()
    return docs
  }

  async getById (id) {
    const doc = await UserModel.findOne({ id }).lean().exec()
    return doc || null
  }

  async getByEmail (email) {
    const doc = await UserModel.findOne({ email }).lean().exec()
    return doc || null
  }

  async create (data) {
    const created = await UserModel.create(data)
    return created.toObject()
  }

  async update (id, changes) {
    const updated = await UserModel.findOneAndUpdate(
      { id },
      { $set: changes },
      { new: true, lean: true }
    ).exec()
    return updated || null
  }

  async remove (id) {
    const res = await UserModel.deleteOne({ id }).exec()
    return res.deletedCount === 1
  }
}

// ========== SERVICE ==========
export class UserService {
  constructor (deps = {}) {
    this.userRepository = deps.userRepository || new UserRepository()
  }

  async listUsers () {
    const items = await this.userRepository.list()
    return items.map(toPublicUser)
  }

  async getUser (id) {
    const user = await this.userRepository.getById(id)
    if (!user) {
      throw notFound('Usuario no encontrado')
    }
    return toPublicUser(user)
  }

  async createUser (payload) {
    const existing = await this.userRepository.getByEmail(payload.email)
    if (existing) {
      throw badRequest('El email ya está en uso', 'EMAIL_IN_USE')
    }
    const created = await this.userRepository.create(payload)
    return toPublicUser(created)
  }

  async updateUser (id, payload) {
    const updated = await this.userRepository.update(id, payload)
    if (!updated) {
      throw notFound('Usuario no encontrado')
    }
    return toPublicUser(updated)
  }

  async deleteUser (id) {
    const ok = await this.userRepository.remove(id)
    if (!ok) {
      throw notFound('Usuario no encontrado')
    }
    return true
  }
}

// ========== CONTROLLER ==========
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
