const express = require("express");
const GroceryCategory = require("../models/GroceryCategory");

const router = express.Router();

// Add a new category
router.post("/add-grocerycategory", async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new GroceryCategory({ name });
        await newCategory.save();
        res.json({ message: "Category added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding category", error: error.message });
    }
});

// Fetch all categories
router.get("/grocerycategories", async (req, res) => {
    try {
        const categories = await GroceryCategory.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
});

module.exports = router;
