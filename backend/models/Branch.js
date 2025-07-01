import mongoose, { Schema } from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    openHours: {
      type: String,
      default: "8:00 Am - 10:00 pm",
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: { type: String },
    },
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
