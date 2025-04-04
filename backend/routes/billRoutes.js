const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");
const twilio = require("twilio");
require("dotenv").config();

// Twilio Configuration
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/save-bill", async (req, res) => {
  try {
    const { items, totalAmount, gstPercentage, orderType, paymentMethod, table, customer } = req.body;

    // Fetch the latest invoice number
    const lastInvoice = await Bill.findOne().sort({ invoiceNo: -1 });
    const invoiceNo = lastInvoice ? lastInvoice.invoiceNo + 1 : 2000001;

    // Ensure totalAmount is reduced by customer points used
    const finalAmount = totalAmount - (customer?.pointsUsed || 0);

    // Save the bill in the database
    const newBill = new Bill({
      invoiceNo,
      items,
      gstPercentage,
      totalAmount: finalAmount,
      orderType,
      paymentMethod,
      table,
      customer,
    });

    await newBill.save();
    console.log("✅ Bill saved successfully:", newBill);

    // ✅ Debugging Log: Check if customer exists
    if (customer && customer.phone) {
      console.log("📞 Sending SMS to:", customer.phone);

      const messageBody = `
        Thank you for your purchased!

        Items:
      ${items.map((item, index) =>
        `${index + 1}. ${item.name} (Qty: ${item.quantity}) - Rs. ${item.total.toFixed(2)}`
      ).join("\n")}

        Invoice No: ${invoiceNo}
        Date: ${new Date().toLocaleString()}
        Total Amount: Rs. ${finalAmount.toFixed(2)}
        Order Type: ${orderType}
        Payment Method: ${paymentMethod}
        ${table ? `Table: ${table}` : ""}
        Visit us again!
      `;

      // Send SMS using Twilio
      client.messages
        .create({
          body: messageBody,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: customer.phone, // ✅ Make sure the phone number is in +91XXXXXXXXXX format
        })
        .then((message) => {
          console.log("✅ SMS Sent Successfully! Message SID:", message.sid);
          res.status(200).json({ message: "Bill saved and SMS sent successfully!", invoiceNo });
        })
        .catch((error) => {
          console.error("❌ Error sending SMS:", error.message);
          res.status(500).json({ error: "Bill saved, but SMS sending failed." });
        });
    } else {
      console.log("⚠️ No customer phone number provided.");
      res.status(200).json({ message: "Bill saved, but no SMS sent.", invoiceNo });
    }
  } catch (error) {
    console.error("❌ Error saving bill:", error);
    res.status(500).json({ error: "Failed to save bill and send SMS" });
  }
});


// API to get all bills
router.get('/bills', async (req, res) => {
  try {
    const bills = await Bill.find(); // Fetch all bills from MongoDB
    res.status(200).json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});


router.get("/latest-invoice", async (req, res) => {
  try {
      const lastInvoice = await Bill.findOne().sort({ invoiceNo: -1 });
      res.json({ invoiceNo: lastInvoice ? lastInvoice.invoiceNo + 1 : 2000001 });
  } catch (error) {
      console.error("Error fetching latest invoice number:", error);
      res.status(500).json({ error: "Failed to fetch latest invoice number" });
  }
});

module.exports = router; // ✅ Export the router





