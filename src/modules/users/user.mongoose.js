//IMPORTS
import mongoose from "mongoose";
import { randomUUID } from "crypto";

//userSchema
const userSchema = new mongoose.Schema(
  {
    //id
    id: {
      type: Number,
      index: true,
      unique: true,
    },
    //name
    name: { type: String, required: true },
    //email
    email: { type: String, required: true, unique: true, index: true },
    //role
    role: { type: String, required: true },
    //premium
    premium: { type: Boolean, default: false },
  },
  {
    //createdAt y updatedAt
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false,
    collection: "users",
  }
);

// Asignar id incremental automáticamente al crear un usuario nuevo
userSchema.pre("save", async function (next) {
  try {
    // Si no es un documento nuevo o el id ya viene definido, no hacemos nada
    if (!this.isNew || this.id != null) return next();

    const Model = this.constructor;
    const lastUser = await Model.findOne({}).sort({ id: -1 }).lean().exec();
    this.id = lastUser ? lastUser.id + 1 : 1;
    next();
  } catch (err) {
    next(err);
  }
});

//UserModel (EN MONGOOSE NO SE USA CAMELCASE)
export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

  //EXPORT DE UserModel
export default UserModel;
