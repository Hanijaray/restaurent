const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  menuName: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  chefName: { type: String, default: "" }, // Add this field
  startTime: { type: Date, default: null }, // ✅ Store the start time
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["New", "Progress", "Completed", "Pending"],
    default: "New",
  }, // Add status field
});

module.exports = mongoose.model("Order", OrderSchema);