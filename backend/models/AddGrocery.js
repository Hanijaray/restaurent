const mongoose = require("mongoose");

const AddGrocerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }, // Will store the image path
});

module.exports = mongoose.model("AddGrocery", AddGrocerySchema, "addgrocery");
