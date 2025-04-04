const express = require("express");
const router = express.Router();
const Grocery = require("../models/Grocery");
const multer = require("multer");
const path = require("path");
const AddGrocery = require("../models/AddGrocery"); // ✅ Ensure this line is present


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ✅ Add or Update Grocery
router.post("/add-groceriess", async (req, res) => {
  try {
    const { name, category, totalCount, unit, price, vat, expiryDate, warningLimit } = req.body;

    // Fetch image from AddGrocery collection
    const groceryData = await AddGrocery.findOne({ name, category });

    if (!groceryData) {
      return res.status(400).json({ message: "Grocery not found in AddGrocery collection!" });
    }

    const newGrocery = new Grocery({
      name,
      category,
      totalCount,
      unit,
      price,
      vat,
      expiryDate,
      warningLimit,
      image: groceryData.image, // Store image automatically
    });

    await newGrocery.save();
    res.status(201).json({ message: "✅ Grocery added successfully!", newGrocery });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ message: "❌ Error adding grocery", error: error.message });
  }
});

//Update Grocery
// ✅ Update Grocery by ID
router.put("/edit-groceriess/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, totalCount, unit, price, vat, expiryDate, warningLimit } = req.body;

    const updatedGrocery = await Grocery.findByIdAndUpdate(
      id,
      { name, category, totalCount, unit, price, vat, expiryDate, warningLimit },
      { new: true } // Return updated document
    );

    if (!updatedGrocery) {
      return res.status(404).json({ message: "❌ Grocery not found!" });
    }

    res.status(200).json({ message: "✅ Grocery updated successfully!", updatedGrocery });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating grocery", error: error.message });
  }
});

// Update Grocery
router.put("/groceries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGrocery = await Grocery.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "✅ Grocery updated successfully!", updatedGrocery });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating grocery", error: error.message });
  }
});

// ✅ Fetch All Groceries
router.get("/get-groceriess", async (req, res) => {
  try {
    const groceries = await Grocery.find({}, "name category totalCount unit price vat expiryDate warningLimit image");
    res.status(200).json(groceries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groceries", error: error.message });
  }
});
// Delete Grocery
router.delete("/groceries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Grocery.findByIdAndDelete(id);
    res.status(200).json({ message: "✅ Grocery deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting grocery", error: error.message });
  }
});


// Fetch all groceries with category name
router.get("/groceries", async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) {
      filter.category = category; // Filtering by category name
    }

    // Populate category field to return category name
    const groceries = await Grocery.find(filter).populate("category", "name");

    console.log("✅ Groceries Fetched from DB:", groceries); // 🔍 Debugging

    res.json(groceries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groceries", error: error.message });
  }
});

router.put("/update-total/:id", async (req, res) => {
  try {
      const { usedCount } = req.body;
      const grocery = await Grocery.findById(req.params.id);
      if (!grocery) return res.status(404).json({ message: "Grocery not found" });

      grocery.totalCount = Math.max(0, grocery.totalCount - usedCount); // Prevent negative values
      await grocery.save();

      res.json({ message: "Total count updated successfully!", grocery });
  } catch (error) {
      res.status(500).json({ message: "Error updating total count", error: error.message });
  }
});


module.exports = router;

