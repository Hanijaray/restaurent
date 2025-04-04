const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

// Add a new category
router.post("/add-category", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(200).json({ message: "Category added successfully!" });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
});

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

module.exports = router;
