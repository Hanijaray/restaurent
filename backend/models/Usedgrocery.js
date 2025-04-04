const mongoose = require("mongoose");

const UsedGrocerySchema = new mongoose.Schema({
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  groceries: [
    {
      category: { type: String, required: true },
      grocery: { type: String, required: true },
      count: { type: Number, required: true },
      unit: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("UsedGrocery", UsedGrocerySchema);