const mongoose = require("mongoose");

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^\+\d{1,3}\d{10}$/ // ✅ Ensures phone number is in E.164 format
  },
  points: { type: Number, default: 0 }, // Add points field
});

module.exports = mongoose.model("Customer", customerSchema);