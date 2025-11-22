//IMPORTS
import mongoose from "mongoose";
import { randomUUID } from "crypto";

//chatSchema
const chatSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      index: true,
      unique: true,
    },
    //messageId
    messageId: { type: String, required: false, index: true },
    content: { type: String, required: true },
    //userId
    userId: { type: String, required: true, index: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    //createdAt y updatedAt
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false,
    collection: "chats",
  }
);

//ChatModel (EN MONGOOSE NO SE USA CAMELCASE)
export const ChatModel =
  mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default ChatModel;
