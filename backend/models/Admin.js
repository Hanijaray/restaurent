const mongoose = require("mongoose"); 

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "Manager" },
    restaurantName: { type: String, required: true } // ✅ Added restaurant name field
}, { timestamps: true });

AdminSchema.post("save", function(error, doc, next) {
    if (error.code === 11000) {
        next(new Error("Email or Username already exists"));
    } else {
        next(error);
    }
});

module.exports = mongoose.model("Admin", AdminSchema);