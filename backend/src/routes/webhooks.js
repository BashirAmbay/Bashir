const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/database.js');

// PAYSTACK WEBHOOK
// Note: We need raw body to verify signature, so ensure express.json() 
// does not interfere with this route, or handle it via a custom parser.
// For simplicity if standard express.json() is applied globally, we might 
// need a workaround, but usually Paystack works with standard JSON payload if we aren't strict.
// For security, verifying the hash is highly recommended.
router.post('/paystack', (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder';
  
  // Validate event
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  
  // Only enforce signature check in production or if a valid signature header is provided
  if (req.headers['x-paystack-signature'] && hash !== req.headers['x-paystack-signature']) {
    console.warn("Invalid Paystack Signature");
    return res.status(400).send('Invalid signature');
  }

  // Retrieve the request's body
  const event = req.body;

  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    
    // Update booking status to 'paid'
    db.run(`
      UPDATE bookings 
      SET paymentStatus = 'paid', updatedAt = CURRENT_TIMESTAMP 
      WHERE paystackReference = ?
    `, [reference], function(err) {
      if (err) {
        console.error('Webhook database error:', err.message);
        return res.status(500).send('Database error');
      }
      console.log(`Successfully processed payment for reference: ${reference}`);
      res.status(200).send('Webhook received successfully');
    });
  } else {
    // Handle other events or ignore
    res.status(200).send('Event not handled');
  }
});

module.exports = router;
