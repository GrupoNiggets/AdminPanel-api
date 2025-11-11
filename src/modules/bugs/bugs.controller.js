import { created, noContent, ok } from '../../utils/ApiResponse.js'
import { asyncHandler } from '../../middlewares/asyncHandler.js'
import { BugsService } from './bugs.service.js'

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


