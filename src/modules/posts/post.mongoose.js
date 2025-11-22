//IMPORTS
import mongoose from "mongoose";
import { randomUUID } from "crypto";

//postSchema
const postSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      default: () => randomUUID(),
      index: true,
      unique: true,
    },
    //userId
    userId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    // https://www.mongodb.com/docs/manual/geospatial-queries/
    //coordinates
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (value) => Array.isArray(value) && value.length === 2,
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },
  },
  {
    //createdAt y updatedAt
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false,
    collection: "posts",
  }
);

//PostModel (EN MONGOOSE NO SE USA CAMELCASE)
export const PostModel =
  mongoose.models.Post || mongoose.model("Post", postSchema);

export default PostModel;
