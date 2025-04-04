const express = require("express");
const Worker = require("../models/Worker");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Set storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/"; // Define uploadPath before using it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Ensure recursive directory creation
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Add Worker

router.post("/workers", upload.single("image"), async (req, res) => {
  try {
    console.log("📩 Received request to add worker:", req.body);

    const { 
      name, workerNumber,  phoneNumber, emergencyCall, address, 
      country, username, password, role, joiningDate 
    } = req.body;

    if (!name || !username || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const workerData = {
      name,
      workerNumber,
      phoneNumber,
      emergencyCall,
      address,
      country,
      username,
      password,
      role, // Store role
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(), // Convert joiningDate
    };

    console.log("🖼️ Uploaded File:", req.file);
    if (req.file) {
      workerData.image = req.file.path; // Store image path
    }

    console.log("📦 Worker Data to Save:", workerData);

    const worker = new Worker(workerData);
    await worker.save();
    

    console.log("✅ Worker Added Successfully!");
    res.status(201).json({ message: "Worker added successfully", worker });

  } catch (error) {
    console.error("❌ Error adding worker:", error);
    res.status(500).json({ error: "Failed to add worker", details: error.message });
  }
});


// Get all workers
router.get("/workers", async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 }); // Newest first
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Worker
router.put("/workers/:id", upload.single("image"), async (req, res) => {
  try {
    const workerId = req.params.id;
    const { role, joiningDate, ...updateData } = req.body;

    updateData.role = role;
    updateData.joiningDate = new Date(joiningDate); // Convert joiningDate to Date type

    // Find the existing worker
    const existingWorker = await Worker.findById(workerId);
    if (!existingWorker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // If a new image is uploaded
    if (req.file) {
      // Delete old image if exists
      if (existingWorker.image) {
        try {
          fs.unlinkSync(existingWorker.image); // Remove old image file
          console.log(`🗑️ Deleted old image: ${existingWorker.image}`);
        } catch (err) {
          console.error("⚠️ Error deleting old image:", err);
        }
      }

      updateData.image = req.file.path; // Save new image path
    }

    // Update worker
    const updatedWorker = await Worker.findByIdAndUpdate(workerId, updateData, { new: true });

    res.status(200).json({ message: "Worker updated successfully", updatedWorker });
  } catch (error) {
    console.error("❌ Error updating worker:", error);
    res.status(500).json({ error: "Failed to update worker" });
  }
});


// Delete Worker
router.delete("/workers/:id", async (req, res) => {
  try {
    const workerId = req.params.id;

    // Find the worker first
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // If worker has an image, delete it from server storage
    if (worker.image) {
      try {
        fs.unlinkSync(worker.image); // Delete image file
        console.log(`🗑️ Deleted image file: ${worker.image}`);
      } catch (err) {
        console.error("⚠️ Failed to delete image file:", err);
      }
    }

    // Delete worker from database
    await Worker.findByIdAndDelete(workerId);
    
    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting worker:", error);
    res.status(500).json({ error: "Failed to delete worker" });
  }
});


module.exports = router;
