// smsRoutes.js
const express = require('express');
const router = express.Router();
const { sendSMS } = require('../models/Sms');

router.post('/send-sms', async (req, res) => {
  const { to, body } = req.body;

  try {
    const result = await sendSMS(to, body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;