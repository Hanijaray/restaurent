const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workerNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emergencyCall: { type: String },
  address: { type: String, required: true },
  country: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String }, 
  role: { type: String, required: true }, // Added worker role
  joiningDate: { type: Date, required: true }, // Added joining date
  date: { type: Date, default: Date.now }, 

},
{ timestamps: true } // ✅ Auto-adds createdAt and updatedAt
);

module.exports = mongoose.model("Worker", workerSchema);