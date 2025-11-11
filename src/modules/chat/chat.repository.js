import { ChatModel } from './chat.mongoose.js'

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

export default ChatRepository



