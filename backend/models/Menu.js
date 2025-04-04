const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  menuName: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  tax: { type: Number, required: true },
  selectedCategory: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String },
  discount: { type: Number, default: 0 },
  state: { type: Number, default: 1 },
  reason: { type: String, default: "" },
  unavailableDate: { type: Date, default: null } // 🆕 New field to store the date
});

module.exports = mongoose.model("Menu", menuSchema, "Menu");
