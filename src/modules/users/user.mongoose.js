//IMPORTS
import mongoose from "mongoose";
import { randomUUID } from "crypto";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      index: true,
      unique: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false,
    collection: "users",
  }
);

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
