const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  workerNumber: { type: String, required: true }, // Ensure workerNo is included
  name: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true },
  loginTime: { type: String, required: true },
  logoutTime: { type: String, required: true },
  isLogoutEntered: { type: Boolean, required: true, default: false },
  totalHours: { type: String, default: "N/A" }, // Store total hours
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);