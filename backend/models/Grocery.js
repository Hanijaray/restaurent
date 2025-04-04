const mongoose = require("mongoose");

const GrocerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: "Kg",
  },
  price: {
    type: Number,
    required: true,
  },
  vat: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  warningLimit: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Grocery", GrocerySchema);


