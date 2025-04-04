const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://OmegaLC:Omega%40LC2025@cluster0.mrr13.mongodb.net/Restaurant?retryWrites=true&w=majority&appName=Cluster0", {
    //await mongoose.connect("mongodb://localhost:27017/restaurant", { 
    useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected to Restaurant database");
  } catch (err) {
    console.error("Failed to connect MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;