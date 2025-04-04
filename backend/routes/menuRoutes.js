const express = require("express");
const Menu = require("../models/Menu");
const router = express.Router();

// Add a new menu item
router.post("/add-menu", async (req, res) => {
  try {
    const { menuName, amount, tax, selectedCategory, category, type, image, discount, state, reason } = req.body;

    if (!menuName || !amount || !tax || !selectedCategory || !category || !type || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (discount !== undefined && (discount < 0 || discount > 100)) {
      return res.status(400).json({ error: "Discount should be between 0 and 100" });
    }

    const newMenu = new Menu({ menuName, amount, tax, selectedCategory, category, type, image, discount, state: state ?? 1, reason: reason || "" });
    await newMenu.save();

    res.status(200).json({ message: "Menu added successfully!" });
  } catch (error) {
    console.error("Error adding menu:", error);
    res.status(500).json({ error: "Failed to add menu" });
  }
});

// Update menu state
router.put("/menu/:id/state", async (req, res) => {
  const { id } = req.params;
  const { state, reason, unavailableDate } = req.body;

  try {
      const updatedMenu = await Menu.findByIdAndUpdate(
          id,
          { state, reason, unavailableDate },
          { new: true, runValidators: true } // Ensure validators are run
      );

      if (!updatedMenu) {
          return res.status(404).json({ error: "Menu item not found" });
      }

      res.json(updatedMenu);
  } catch (error) {
      console.error("Error updating menu:", error);
      res.status(500).json({ error: "Failed to update menu" });
  }
});

// Get a single menu item by ID
router.get("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all menus with filtering
router.get("/menus", async (req, res) => {
  try {
    const { type, category } = req.query;
    let filter = {};

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    const menus = await Menu.find(filter);
    res.status(200).json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Failed to fetch menus" });
  }
});

// Get only menu names
router.get("/menu-names", async (req, res) => {
  try {
    const menus = await Menu.find({}, "menuName");
    res.status(200).json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Failed to fetch menus" });
  }
});

// Update menu state
router.put("/menu/:id/state", async (req, res) => {
  const { id } = req.params;
  const { state, reason, unavailableDate } = req.body;

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { state, reason, unavailableDate },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(updatedMenu);
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ error: "Failed to update menu" });
  }
});
// ✅ Update menu item (used in handleEditSubmit)
router.put("/update-menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { menuName, amount, tax, selectedCategory, category, type, discount, image } = req.body;

    if (!menuName || !amount || !tax || !selectedCategory || !category || !type) {
      return res.status(400).json({ error: "All fields except discount and image are required" });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { menuName, amount, tax, selectedCategory, category, type, discount, image },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu updated successfully!", updatedMenu });

  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ error: "Failed to update menu" });
  }
});

module.exports = router;
