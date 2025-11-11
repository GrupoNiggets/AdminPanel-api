import { created, noContent, ok } from '../../utils/ApiResponse.js'
import { asyncHandler } from '../../middlewares/asyncHandler.js'
import { PostService } from './post.service.js'

const postService = new PostService()

export const listPosts = asyncHandler(async (req, res) => {
  const data = await postService.listPosts()
  ok(res, data)
})

export const getPost = asyncHandler(async (req, res) => {
  const data = await postService.getPost(req.params.id)
  ok(res, data)
})

export const createPost = asyncHandler(async (req, res) => {
  const data = await postService.createPost(req.body)
  created(res, data)
})

export const updatePost = asyncHandler(async (req, res) => {
  const data = await postService.updatePost(req.params.id, req.body)
  ok(res, data)
})

export const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id)
  noContent(res)
})

