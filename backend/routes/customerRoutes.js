const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// Helper function to format phone numbers
const formatPhoneNumber = (phone, countryCode) => {
  // Remove spaces and special characters
  phone = phone.replace(/\D/g, "");

  // Ensure the phone number is 10 digits
  if (phone.length !== 10) {
    throw new Error("Invalid phone number! Must be 10 digits.");
  }

  // Add country code
  return `+${countryCode}${phone}`;
};

// API Route to Add Customer with Country Code
router.post("/add-customer", async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Debugging Log
    
    const { name, phone, countryCode } = req.body;

    if (!name || !phone || !countryCode) {
      return res.status(400).json({ error: "Name, phone, and country code are required" });
    }

    // Format phone number with country code
    const formattedPhone = `+${countryCode}${phone.trim()}`;

    // Check if the phone number already exists
    const existingCustomer = await Customer.findOne({ phone: formattedPhone });
    if (existingCustomer) {
      return res.status(400).json({ error: "A customer with this phone number already exists!" });
    }

    // Save new customer
    const newCustomer = new Customer({ name: name.trim(), phone: formattedPhone });
    await newCustomer.save();

    res.status(201).json({ message: "Customer added successfully!", customer: newCustomer });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Failed to add customer" });
  }
});


// API Route to Fetch Customers (Supports Searching by Name or Phone)
router.get("/customers", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } }, // Case-insensitive search
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const customers = await Customer.find(query);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// API Route to Add/Update Customer Points
router.post("/add-customer-points", async (req, res) => {
  try {
    const { name, points } = req.body;

    if (!name || points === undefined) {
      return res.status(400).json({ error: "Name and points are required" });
    }

    // Find customer and update points
    const updatedCustomer = await Customer.findOneAndUpdate(
      { name }, 
      { $inc: { points } },  // Increment existing points
      { new: true, upsert: true } // Return updated doc, create if not exists
    );

    res.status(200).json({ message: "Points updated successfully", updatedCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update points" });
  }
});

// API Route to Search Customers
router.get("/search-customers", async (req, res) => {
  const searchQuery = req.query.name;  // Get search query from request
  try {
      const customers = await Customer.find({ 
          name: { $regex: searchQuery, $options: "i" } // Case-insensitive search
      }).limit(5); // Limit results to 5 suggestions
      res.json(customers);
  } catch (error) {
      res.status(500).json({ error: "Error fetching customers" });
  }
});
// API Route to Reset Customer Points to 0
router.put("/reset-customer-points/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { points: 0 }, // ✅ Set points to 0
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer points reset successfully", updatedCustomer });
  } catch (error) {
    console.error("Error resetting customer points:", error);
    res.status(500).json({ error: "Failed to reset customer points" });
  }
});
router.put("/update-customer-points/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { points }, // ✅ Save new points value
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer points updated successfully", updatedCustomer });
  } catch (error) {
    console.error("Error updating customer points:", error);
    res.status(500).json({ error: "Failed to update customer points" });
  }
});



module.exports = router;