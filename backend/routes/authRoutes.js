const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Worker = require("../models/Worker");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  try {
      // Check if user is a Manager instead of Admin
      const admin = await Admin.findOne({ username });
      if (admin && admin.role === "Manager") { 
          const isPasswordValid = await bcrypt.compare(password, admin.password);
          if (isPasswordValid) {
              console.log("Admin Profile Pic:", admin.profilePic); // ✅ Debugging

              return res.status(200).json({
                  message: "Login successful",
                  token: jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1h" }),
                  role: admin.role,
                  username: username,
                  profilePic: admin.image ? `http://localhost:5000/${admin.image.replace(/\\/g, "/")}` : "https://via.placeholder.com/150"

              });
          }
      }

      // Check if the user is a Worker (password is stored in plain text)
      const worker = await Worker.findOne({ username });
      if (worker) {
          if (worker.password === password) {
              console.log("Worker Profile Pic:", worker.profilePic); // ✅ Debugging

              return res.status(200).json({
                  message: "Login successful",
                  token: jwt.sign({ id: worker._id, role: worker.role }, process.env.JWT_SECRET, { expiresIn: "1h" }),
                  role: worker.role || admin.role,
                  username: username,
                  profilePic: worker.image ? `http://localhost:5000/${worker.image.replace(/\\/g, "/")}` : "https://via.placeholder.com/150"

              });
          }
      }

      return res.status(401).json({ message: "Login failed! Please check your credentials." });

  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


  

module.exports = router;










