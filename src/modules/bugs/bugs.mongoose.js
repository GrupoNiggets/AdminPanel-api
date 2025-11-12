import mongoose from 'mongoose'
import { randomUUID } from 'crypto'

const bugsSchema = new mongoose.Schema({
  id: { type: String, default: () => randomUUID(), index: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  role: { type: String, required: true }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
  collection: 'bugs'
})

export const BugsModel = mongoose.models.Bugs || mongoose.model('Bugs', userSchema)

export default BugsModel

import mongoose from 'mongoose'
import { randomUUID } from 'crypto'
