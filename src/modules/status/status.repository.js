import { UserModel } from './status.mongoose.js'

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

export default UserRepository


