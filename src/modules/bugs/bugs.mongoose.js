import mongoose from "mongoose";
import { randomUUID } from "crypto";

const bugsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    reporter: { type: String, required: true },
    status: {
      type: String,
      enum: ["ABIERTO", "EN PROGRESO", "RESUELTO"],
      default: "ABIERTO",
    },
    priority: {
      type: String,
      enum: ["ALTA", "MEDIA", "BAJA"],
      default: "MEDIA",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false,
    collection: "bugs",
  }
);

export const BugsModel =
  mongoose.models.Bugs || mongoose.model("Bugs", bugsSchema);
export default BugsModel;
