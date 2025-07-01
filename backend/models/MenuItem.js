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
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    category: {
      type: String,
      enum: ["coffee", "tea", "bakery", "snacks"],
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },

    // ✅ Add these fields to support review summaries
    // rating: {
    //   type: Number,
    //   default: 0,
    // },
    // numReviews: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
  }
);

menuItemSchema.index({ name: "text", category: 1 });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
