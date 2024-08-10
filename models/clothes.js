import mongoose from "mongoose";

const clothesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ["men", "women"],
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Clothes = mongoose.model("Clothes", clothesSchema);

export default Clothes;
