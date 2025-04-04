const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/authmiddleware");
const router = express.Router();
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify if the user is a manager
const verifyManager = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Access Denied! No token provided." });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "Manager") {
            return res.status(403).json({ message: "Access Denied! Only Managers are allowed." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// ✅ Manager-only protected route
router.get("/protected-manager-route", verifyManager, (req, res) => {
    res.json({ message: "Welcome, Manager!" });
});

// ✅ Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, restaurantName } = req.body;

        if (!username || !email || !password || !restaurantName) 
            return res.status(400).json({ message: "All fields are required" });

        const existingUser = await Admin.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ 
            username, 
            email, 
            password: hashedPassword, 
            restaurantName, // ✅ Store restaurant name
            role: "Manager"
        });

        await newAdmin.save();

        const token = jwt.sign(
            { id: newAdmin._id, role: newAdmin.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "Admin registered successfully",
            token,
            admin: { 
                username: newAdmin.username, 
                role: newAdmin.role, 
                restaurantName: newAdmin.restaurantName 
            }
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ message: "Invalid credentials" });

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ 
            message: "Login successful", 
            token, 
            admin: { username: admin.username, role: admin.role, restaurantName: admin.restaurantName }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
















