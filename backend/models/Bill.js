const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  invoiceNo: { type: Number, required: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    vat: Number,
    discount: Number,
    total: Number
  }],
  gstPercentage: Number, // ✅ Store GST Percentage
  totalAmount: Number,
  orderType: String,
  paymentMethod: String,
  table: { type: String, required: false },
  customer: { // ✅ Store customer details
    name: String,
    phone: String,
    pointsUsed: Number // ✅ Store points used
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema, 'Bills');

