import { notFound, badRequest } from '../../utils/AppError.js'
import { created, noContent, ok } from '../../utils/ApiResponse.js'
import { asyncHandler } from '../../middlewares/asyncHandler.js'
import BugsModel from './bugs.mongoose.js'
import { createBugSchema, updateBugSchema } from './bugs.validator.js'

//MODEL
export const bugsFields = {
  id: 'string',
  title: 'string',
  description: 'string',
  reporter: 'string',
  status: 'string',
  priority: 'string',
  createdAt: 'date',
  updatedAt: 'date'
}

export function toPublicBug (bug) {
  if (!bug) return null
  const { id, title, description, reporter, status, priority, createdAt, updatedAt } = bug
  return { id, title, description, reporter, status, priority, createdAt, updatedAt }
}

//REPOSITORY
export class BugsRepository {
  async list () {
    return await BugsModel.find({}).lean().exec()
  }

  async getById (id) {
    return await BugsModel.findOne({ id }).lean().exec()
  }

  async create (data) {
    const doc = await BugsModel.create(data)
    return doc.toObject()
  }

  async update (id, changes) {
    return await BugsModel.findOneAndUpdate(
      { id },
      { $set: changes },
      { new: true, lean: true }
    ).exec()
  }

  async remove (id) {
    const res = await BugsModel.deleteOne({ id }).exec()
    return res.deletedCount === 1
  }
}

//SERVICE
export class BugsService {
  constructor (deps = {}) {
    this.bugsRepository = deps.bugsRepository || new BugsRepository()
  }

  async listBugs () {
    const items = await this.bugsRepository.list()
    return items.map(toPublicBug)
  }

  async getBug (id) {
    const bug = await this.bugsRepository.getById(id)
    if (!bug) throw notFound('Bug no encontrado')
    return toPublicBug(bug)
  }

  async createBug (payload) {
    const { error } = createBugSchema.validate(payload)
    if (error) throw badRequest(error.message)

    const created = await this.bugsRepository.create(payload)
    return toPublicBug(created)
  }

  async updateBug (id, payload) {
    const { error } = updateBugSchema.validate(payload)
    if (error) throw badRequest(error.message)

    const updated = await this.bugsRepository.update(id, payload)
    if (!updated) throw notFound('Bug no encontrado')

    return toPublicBug(updated)
  }

  async deleteBug (id) {
    const ok = await this.bugsRepository.remove(id)
    if (!ok) throw notFound('Bug no encontrado')
    return true
  }
}

//CONTROLLER
const bugsService = new BugsService()

export const listBugs = asyncHandler(async (req, res) => {
  ok(res, await bugsService.listBugs())
})

export const getBug = asyncHandler(async (req, res) => {
  ok(res, await bugsService.getBug(req.params.id))
})

export const createBug = asyncHandler(async (req, res) => {
  created(res, await bugsService.createBug(req.body))
})

export const updateBug = asyncHandler(async (req, res) => {
  ok(res, await bugsService.updateBug(req.params.id, req.body))
})

export const deleteBug = asyncHandler(async (req, res) => {
  await bugsService.deleteBug(req.params.id)
  noContent(res)
})
