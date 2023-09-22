import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    livePrice: {
      type: Number,
    },
    timeLeft: {
      type: String,
    },
    photo: {
      type: String,
    },
    photos: {
      type: [String],
    },
    isBox: {
      type: Boolean,
    },
    imei: {
      type: String,
    },
    problems: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    players: {
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      price: {
        type: String,
      },
    },

    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    updateUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Product", ProductSchema);
