//IMPORTS
import mongoose from "mongoose";
import { randomUUID } from "crypto";

//userSchema
const userSchema = new mongoose.Schema(
  {
    //id
    id: {
      type: String,
      default: () => randomUUID(),
      index: true,
      unique: true,
    },
    //name
    name: { type: String, required: true },
    //email
    email: { type: String, required: true, unique: true, index: true },
    //role
    role: { type: String, required: true },
  },
  {
    //createdAt y updatedAt
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false,
    collection: "users",
  }
);

//UserModel (EN MONGOOSE NO SE USA CAMELCASE)
export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

  //EXPORT DE UserModel
export default UserModel;
