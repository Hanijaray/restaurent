const express = require("express");
const Attendance = require("../models/Attendance");
const Worker = require("../models/Worker"); // Import Worker model

const router = express.Router();

// Helper function to calculate total hours
function calculateTotalHours(loginTime, logoutTime) {
  if (loginTime === "Nil" || logoutTime === "Nil") return "N/A";

  const parseTime = (time) => {
    let [hours, minutes, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes; // Convert to total minutes
  };

  const loginMinutes = parseTime(loginTime);
  const logoutMinutes = parseTime(logoutTime);
  const diffMinutes = logoutMinutes - loginMinutes;

  if (diffMinutes < 0) return "N/A"; // Invalid time case
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}.${minutes.toString().padStart(2, "0")} hrs`;
}

router.post("/attendance", async (req, res) => {
  try {
    const { name, status, loginTime, logoutTime, workerNumber } = req.body;
    const today = new Date().toISOString().split("T")[0]; // Get today's date

    // Check if worker exists
    const worker = await Worker.findOne({ name });

    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    console.log("workerNumber:", workerNumber);

    // Find the existing attendance record
    let attendanceRecord = await Attendance.findOne({ name, date: today });

    if (attendanceRecord) {
      // Toggle status if the same worker is marked again
      attendanceRecord.status =
        attendanceRecord.status === "Present" ? "Absent" : "Present";

      // Update login/logout times accordingly
      if (attendanceRecord.status === "Present") {
        attendanceRecord.loginTime = loginTime || "Nil";
        attendanceRecord.logoutTime = logoutTime || "Nil";
      } else {
        attendanceRecord.loginTime = "Nil";
        attendanceRecord.logoutTime = "Nil";
        attendanceRecord.totalHours = 0; // ✅ Set totalHours to 0 when status is "Absent"
      }

      await attendanceRecord.save();
      return res.json({
        message: `Status updated to ${attendanceRecord.status}!`,
      });
    } else {
      // Create a new attendance record if not found
      const newAttendance = new Attendance({
        workerNumber, // Store workerNumber in Attendance collection
        name: worker.name,

        status,
        loginTime: status === "Present" ? loginTime : "Nil",
        logoutTime: status === "Present" ? logoutTime : "Nil",
        totalHours:
          status === "Present" ? calculateTotalHours(loginTime, logoutTime) : 0, //  Default to 0 for "Absent"

        date: today,
      });

      await newAttendance.save();
      return res
        .status(201)
        .json({ message: "Attendance added successfully!" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Retrieve all attendance records
router.get("/attendances", async (req, res) => {
  try {
    const attendances = await Attendance.find();
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

// Update Logout Time
router.put("/attendances/update/:id", async (req, res) => {
  try {
    const { logoutTime } = req.body;

    // Fetch the attendance first to access loginTime
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    if (attendance.status === "Absent") {
      return res
        .status(400)
        .json({ error: "Cannot update logout time for Absent status" });
    }

    // Calculate total hours
    const totalHours = calculateTotalHours(attendance.loginTime, logoutTime);

    // Update attendance record
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { logoutTime, isLogoutEntered: true, totalHours },
      { new: true } // Returns the updated document
    );

    res.json(updatedAttendance);
  } catch (error) {
    console.error("Error updating logout time:", error);
    res.status(500).json({ error: "Failed to update logout time" });
  }
});

router.get("/worker-summary", async (req, res) => {
  try {
    const workers = await Worker.find(); // Fetch all workers
    const attendances = await Attendance.find(); // Fetch all attendance records

    // Create a map to store worker-wise total hours & attendance count
    const workerSummary = new Map();

    workers.forEach((worker) => {
      workerSummary.set(worker.workerNumber, {
        workerNumber: worker.workerNumber,
        phoneNumber: worker.phoneNumber,
        name: worker.name,
        image: worker.image, // Include image path
        presentCount: 0,
        leaveCount: 0,
        totalHours: 0,
      });
    });

    attendances.forEach((attendance) => {
      const { workerNumber, status, totalHours } = attendance;

      if (workerSummary.has(workerNumber)) {
        const workerData = workerSummary.get(workerNumber);

        if (status === "Present") {
          workerData.presentCount++;
        } else {
          workerData.leaveCount++;
        }

        // Convert totalHours (string) to number and sum it up
        if (typeof totalHours === "string" && totalHours !== "N/A") {
          const parsedHours = parseFloat(totalHours);
          if (!isNaN(parsedHours)) {
            workerData.totalHours += parsedHours;
          }
        }

        workerSummary.set(workerNumber, workerData);
      }
    });

    // Convert Map to array and calculate percentages
    const workerSummaryArray = [...workerSummary.values()].map((worker) => {
      const totalDays = worker.presentCount + worker.leaveCount;
      return {
        ...worker,
        presentPercentage: totalDays
          ? ((worker.presentCount / totalDays) * 100).toFixed(2)
          : "0.00",
        leavePercentage: totalDays
          ? ((worker.leaveCount / totalDays) * 100).toFixed(2)
          : "0.00",
      };
    });

    res.json(workerSummaryArray);
  } catch (error) {
    console.error("Error fetching worker summary:", error);
    res.status(500).json({ error: "Failed to fetch worker summary" });
  }
});
router.delete("/attendances/clear", async (req, res) => {
  try {
    await Attendance.deleteMany({}); // Delete all records
    res.status(200).json({ message: "All attendance records cleared." });
  } catch (error) {
    res.status(500).json({ message: "Error clearing records.", error });
  }
});

module.exports = router;
