import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    imageUrl: String,
    category: {
      type: String,
      enum: ["coffee", "tea", "cold", "snacks"],
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

menuItemSchema.index({ name: "text", category: 1 });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
