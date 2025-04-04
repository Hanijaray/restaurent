const mongoose = require("mongoose");

const GroceryCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model("GroceryCategory", GroceryCategorySchema);

