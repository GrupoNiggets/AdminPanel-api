import mongoose from 'mongoose'

const statusSchema = new mongoose.Schema({
  responseCode: Number,
  responseTime: Number,
  timestamp: Date
}, {
  collection: 'status'
})

export const StatusModel = mongoose.models.Status || mongoose.model('Status', statusSchema)

export default StatusModel
