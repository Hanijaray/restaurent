const express = require("express");
const multer = require("multer");
const path = require("path");
const AddGrocery = require("../models/AddGrocery");

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Add a new grocery item
router.post("/add-grocery", upload.single("image"), async (req, res) => {
  try {
    const { name, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newGrocery = new AddGrocery({ name, category, image: imagePath });
    await newGrocery.save();

    res.json({ message: "✅ Grocery added successfully!", grocery: newGrocery });
  } catch (error) {
    res.status(500).json({ message: "❌ Error adding grocery", error: error.message });
  }
});

// ✅ Fetch all groceries (fixing the issue)
router.get("/get-groceries", async (req, res) => {
  try {
    const groceries = await AddGrocery.find(); // Ensure correct model is used
    res.json(groceries);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching groceries", error: error.message });
  }
});

// Update a grocery item
router.put("/update-grocery/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, category } = req.body;
    const updateData = { name, category };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedGrocery = await AddGrocery.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "✅ Grocery updated successfully!", grocery: updatedGrocery });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating grocery", error: error.message });
  }
});

// Delete a grocery item
router.delete("/delete-grocery/:id", async (req, res) => {
  try {
    await AddGrocery.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Grocery deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting grocery", error: error.message });
  }
});

module.exports = router;

