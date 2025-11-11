import mongoose from 'mongoose'
import { randomUUID } from 'crypto'

const chatSchema = new mongoose.Schema({
  id: { type: String, default: () => randomUUID(), index: true, unique: true },
  messageId: { type: String, required: false, index: true },
  content: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
  collection: 'chats'
})

export const ChatModel = mongoose.models.Chat || mongoose.model('Chat', chatSchema)
export default ChatModel


