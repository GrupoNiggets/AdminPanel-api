import { PostModel } from './post.mongoose.js'

export class PostRepository {
  async list () {
    const docs = await PostModel.find({}).lean().exec()
    return docs
  }

  async getById (postId) {
    const doc = await PostModel.findOne({ postId }).lean().exec()
    return doc || null
  }

  async create (data) {
    const created = await PostModel.create(data)
    return created.toObject()
  }

  async update (postId, changes) {
    const updated = await PostModel.findOneAndUpdate(
      { postId },
      { $set: changes },
      { new: true, lean: true }
    ).exec()
    return updated || null
  }

  async remove (postId) {
    const res = await PostModel.deleteOne({ postId }).exec()
    return res.deletedCount === 1
  }
}

export default PostRepository


