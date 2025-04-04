const express = require("express");
const router = express.Router();
const UsedGrocery = require("../models/Usedgrocery");
const GroceryCategory = require("../models/GroceryCategory"); 
const Grocery = require("../models/Grocery");

// Add Used Grocery Data
// router.post("/add", async (req, res) => {
//   try {
//     let { fromDate, toDate, groceries } = req.body;

//     if (!fromDate || !toDate || !Array.isArray(groceries) || groceries.length === 0) {
//       return res.status(400).json({ message: "From Date, To Date, and at least one grocery item are required." });
//     }

//     // Convert category and grocery IDs into their actual names
//     const updatedGroceries = await Promise.all(
//       groceries.map(async (g) => {
//         const categoryData = await GroceryCategory.findById(g.category);
//         const groceryData = await Grocery.findById(g.grocery);

//         return {
//           category: categoryData ? categoryData.name : "Unknown",
//           grocery: groceryData ? groceryData.name : "Unknown",
//           count: g.count > 0 ? g.count : 0,
//           unit: g.unit?.trim() || "N/A",
//         };
//       })
//     );

//     const newUsedGrocery = new UsedGrocery({ fromDate, toDate, groceries: updatedGroceries });
//     await newUsedGrocery.save();

//     res.status(201).json({ message: "Used grocery data saved successfully!", data: newUsedGrocery });
//   } catch (error) {
//     console.error("❌ Error saving grocery data:", error);
//     res.status(500).json({ message: "Server error. Please try again.", error: error.message });
//   }
// });
// Add Used Grocery Data & Update Grocery Stock
router.post("/add", async (req, res) => {
  try {
    let { fromDate, toDate, groceries } = req.body;

    if (!fromDate || !toDate || !Array.isArray(groceries) || groceries.length === 0) {
      return res.status(400).json({ message: "From Date, To Date, and at least one grocery item are required." });
    }

    const updatedGroceries = await Promise.all(
      groceries.map(async (g) => {
        const categoryData = await GroceryCategory.findById(g.category);
        const groceryData = await Grocery.findById(g.grocery);

        if (!groceryData) {
          return { error: `Grocery item ${g.grocery} not found.` };
        }

        let remainingToSubtract = g.count; // Amount to subtract

        // Fetch all grocery items with the same name, sorted by totalCount (ascending)
        const groceryItems = await Grocery.find({ name: groceryData.name }).sort({ totalCount: 1 });

        for (let groceryItem of groceryItems) {
          if (remainingToSubtract <= 0) break; // If already subtracted, stop.

          let subtractAmount = Math.min(remainingToSubtract, groceryItem.totalCount);
          groceryItem.totalCount -= subtractAmount;
          remainingToSubtract -= subtractAmount;
          await groceryItem.save();
        }

        return {
          category: categoryData ? categoryData.name : "Unknown",
          grocery: groceryData ? groceryData.name : "Unknown",
          count: g.count > 0 ? g.count : 0,
          unit: g.unit?.trim() || "N/A",
        };
      })
    );

    if (updatedGroceries.some((g) => g.error)) {
      return res.status(400).json({ message: "Some grocery items were not found.", details: updatedGroceries });
    }

    const newUsedGrocery = new UsedGrocery({ fromDate, toDate, groceries: updatedGroceries });
    await newUsedGrocery.save();

    res.status(201).json({ message: "Used grocery data saved successfully! Stock updated.", data: newUsedGrocery });
  } catch (error) {
    console.error("❌ Error saving grocery data:", error);
    res.status(500).json({ message: "Server error. Please try again.", error: error.message });
  }
});



// Fetch Used Grocery Data
router.get("/", async (req, res) => {
  try {
    const usedGroceries = await UsedGrocery.find();
    res.json(usedGroceries);
  } catch (error) {
    console.error("❌ Error fetching used grocery history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});





module.exports = router;
