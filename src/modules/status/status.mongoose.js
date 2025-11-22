//IMPORTS
import mongoose from "mongoose";

//statusSchema
const statusSchema = new mongoose.Schema(
  {
    //responseCode
    responseCode: Number,
    //responseTime
    responseTime: Number,
    //timestamp
    timestamp: Date,
  },
  {
    collection: "status",
  }
);

//StatusModel (EN MONGOOSE NO SE USA CAMELCASE)
export const StatusModel =
  mongoose.models.Status || mongoose.model("Status", statusSchema);

export default StatusModel;
