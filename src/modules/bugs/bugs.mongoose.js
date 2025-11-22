//IMPORTS
import mongoose from "mongoose";
import { randomUUID } from "crypto";

//bugsSchema
const bugsSchema = new mongoose.Schema(
  {
    //id
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
      index: true,
    },
    //title
    title: { type: String, required: true },
    //description
    description: { type: String, required: true },
    //reporter
    reporter: { type: String, required: true },
    status: {
      type: String,
      enum: ["ABIERTO", "EN PROGRESO", "RESUELTO"],
      default: "ABIERTO",
    },
    //priority
    priority: {
      type: String,
      enum: ["ALTA", "MEDIA", "BAJA"],
      default: "MEDIA",
    },
  },
  {
    //createdAt y updatedAt
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false,
    collection: "bugs",
  }
);

//BugsModel (EN MONGOOSE NO SE USA CAMELCASE)
export const BugsModel =
  mongoose.models.Bugs || mongoose.model("Bugs", bugsSchema);

//EXPORT DE BugsModel
export default BugsModel;
