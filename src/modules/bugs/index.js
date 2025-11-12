import { notFound, badRequest } from '../../utils/AppError.js'
import { created, noContent, ok } from '../../utils/ApiResponse.js'
import { asyncHandler } from '../../middlewares/asyncHandler.js'
import { BugsModel } from './bugs.mongoose.js'

// ========== MODEL ==========
export const bugsFields = {
  id: 'string',
  name: 'string',
  email: 'string',
  role: 'string',
  createdAt: 'date',
  updatedAt: 'date'
}

export function toPublicBugs (bug) {
  if (!bug) return null
  const { id, name, email, role, createdAt, updatedAt } = bug
  return { id, name, email, role, createdAt, updatedAt }
}

// ========== REPOSITORY ==========
export class BugsRepository {
  async list () {
    const docs = await BugsModel.find({}).lean().exec()
    return docs
  }

  async getById (id) {
    const doc = await BugsModel.findOne({ id }).lean().exec()
    return doc || null
  }

  async getByEmail (email) {
    const doc = await BugsModel.findOne({ email }).lean().exec()
    return doc || null
  }

  async create (data) {
    const created = await BugsModel.create(data)
    return created.toObject()
  }

  async update (id, changes) {
    const updated = await BugsModel.findOneAndUpdate(
      { id },
      { $set: changes },
      { new: true, lean: true }
    ).exec()
    return updated || null
  }

  async remove (id) {
    const res = await BugsModel.deleteOne({ id }).exec()
    return res.deletedCount === 1
  }
}

// ========== SERVICE ==========
export class BugsService {
  constructor (deps = {}) {
    this.bugsRepository = deps.bugsRepository || new BugsRepository()
  }

  async listBugs () {
    const items = await this.bugsRepository.list()
    return items.map(toPublicBugs)
  }

  async getBugs (id) {
    const bug = await this.bugsRepository.getById(id)
    if (!bug) {
      throw notFound('Bug no encontrado')
    }
    return toPublicBugs(bug)
  }

  async createBugs (payload) {
    const existing = await this.bugsRepository.getByEmail(payload.email)
    if (existing) {
      throw badRequest('El email ya está en uso', 'EMAIL_IN_USE')
    }
    const created = await this.bugsRepository.create(payload)
    return toPublicBugs(created)
  }

  async updateBugs (id, payload) {
    const updated = await this.bugsRepository.update(id, payload)
    if (!updated) {
      throw notFound('Bug no encontrado')
    }
    return toPublicBugs(updated)
  }

  async deleteBugs (id) {
    const ok = await this.bugsRepository.remove(id)
    if (!ok) {
      throw notFound('Bug no encontrado')
    }
    return true
  }
}

// ========== CONTROLLER ==========
const bugsService = new BugsService()

export const listBugs = asyncHandler(async (req, res) => {
  const data = await bugsService.listBugs()
  ok(res, data)
})

export const getBugs = asyncHandler(async (req, res) => {
  const data = await bugsService.getBugs(req.params.id)
  ok(res, data)
})

export const createBugs = asyncHandler(async (req, res) => {
  const data = await bugsService.createBugs(req.body)
  created(res, data)
})

export const updateBugs = asyncHandler(async (req, res) => {
  const data = await bugsService.updateBugs(req.params.id, req.body)
  ok(res, data)
})

export const deleteBugs = asyncHandler(async (req, res) => {
  await bugsService.deleteBugs(req.params.id)
  noContent(res)
})
