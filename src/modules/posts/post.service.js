import { notFound } from '../../utils/AppError.js'
import { toPublicPost } from './post.model.js'
import { PostRepository } from './post.repository.js'

export class PostService {
  constructor (deps = {}) {
    this.postRepository = deps.postRepository || new PostRepository()
  }

  async listPosts () {
    const items = await this.postRepository.list()
    return items.map(toPublicPost)
  }

  async getPost (postId) {
    const post = await this.postRepository.getById(postId)
    if (!post) {
      throw notFound('Publicación no encontrada')
    }
    return toPublicPost(post)
  }

  async createPost (payload) {
    const created = await this.postRepository.create(payload)
    return toPublicPost(created)
  }

  async updatePost (postId, payload) {
    const updated = await this.postRepository.update(postId, payload)
    if (!updated) {
      throw notFound('Publicación no encontrada')
    }
    return toPublicPost(updated)
  }

  async deletePost (postId) {
    const ok = await this.postRepository.remove(postId)
    if (!ok) {
      throw notFound('Publicación no encontrada')
    }
    return true
  }
}

export default PostService
