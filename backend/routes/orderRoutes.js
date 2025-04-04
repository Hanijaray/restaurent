const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { menuId, menuName, quantity, amount } = req.body;

    if (!menuId || !menuName || !quantity || !amount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newOrder = new Order({ menuId, menuName, quantity, amount });
    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});
// Auto-update "New" orders to "Pending" every 5 minutes
setInterval(async () => {
  try {
    const fiveMinutesAgo = new Date(new Date() - 5 * 60 * 1000);

    await Order.updateMany(
      { status: "New", date: { $lte: fiveMinutesAgo } },
      { $set: { status: "Pending" } }
    );

    console.log("Updated orders older than 5 minutes to 'Pending'");
  } catch (error) {
    console.error("Error updating pending orders:", error);
  }
}, 60000); // Runs every 1 minute

router.get("/", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const orders = await Order.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update an order with a chef's name
router.put("/:id/assign-chef", async (req, res) => {
  try {
    const { chefName } = req.body;

    if (!chefName) {
      return res.status(400).json({ error: "Chef name is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { chefName, startTime: new Date(), status: "Progress" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Chef assigned successfully!", order: updatedOrder });
  } catch (error) {
    console.error("Error assigning chef:", error);
    res.status(500).json({ error: "Failed to assign chef" });
  }
});

// Get total order count

router.get("/count", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    console.log(`Total Orders: ${totalOrders}`);
    res.status(200).json({ totalOrders });
  } catch (error) {
    console.error("Error fetching order count:", error);
    res.status(500).json({ error: "Failed to fetch order count" });
  }
});

router.put("/:id/take-order", async (req, res) => {
  try {
    const { chefName } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { chefName, status: "Progress", startTime: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order taken successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error taking order:", error);
    res.status(500).json({ error: "Failed to take order" });
  }
});

module.exports = router;
