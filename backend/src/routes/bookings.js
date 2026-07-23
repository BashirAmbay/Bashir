const express = require('express');
const router = express.Router();
const db = require('../config/database.js');
const { authenticateToken } = require('../middleware/auth.js');

// CREATE BOOKING (Customer)
router.post('/', authenticateToken, (req, res) => {
  const { quantity, deliveryAddress, preferredDeliveryDate, notes } = req.body;
  const userId = req.user.id;

  if (!quantity || !deliveryAddress || !preferredDeliveryDate) {
    return res.status(400).json({ message: 'Quantity, deliveryAddress, and preferredDeliveryDate are required' });
  }

  db.run(`
    INSERT INTO bookings (userId, quantity, deliveryAddress, preferredDeliveryDate, notes, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `, [userId, quantity, deliveryAddress, preferredDeliveryDate, notes || ''], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to create booking', error: err.message });
    }

    const bookingId = this.lastID;
    db.get('SELECT * FROM bookings WHERE id = ?', [bookingId], (err, booking) => {
      if (err) {
        return res.status(500).json({ message: 'Booking created but failed to fetch details', error: err.message });
      }
      res.status(201).json({ message: 'Booking placed successfully', booking });
    });
  });
});

// GET ALL BOOKINGS (Admin: all, Customer: own)
router.get('/', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    db.all(`
      SELECT b.*, u.firstName, u.lastName, u.email, u.phone,
             da.assignedToAdminId, da.status as assignmentStatus, 
             driver.firstName as driverFirstName, driver.lastName as driverLastName
      FROM bookings b
      JOIN users u ON b.userId = u.id
      LEFT JOIN deliveryAssignments da ON b.id = da.bookingId
      LEFT JOIN users driver ON da.assignedToAdminId = driver.id
      ORDER BY b.createdAt DESC
    `, [], (err, bookings) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json(bookings);
    });
  } else {
    db.all(`
      SELECT b.*, da.assignedToAdminId, da.status as assignmentStatus
      FROM bookings b
      LEFT JOIN deliveryAssignments da ON b.id = da.bookingId
      WHERE b.userId = ?
      ORDER BY b.createdAt DESC
    `, [req.user.id], (err, bookings) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json(bookings);
    });
  }
});

// GET BOOKING BY ID
router.get('/:id', authenticateToken, (req, res) => {
  const bookingId = req.params.id;

  db.get(`
    SELECT b.*, u.firstName, u.lastName, u.email, u.phone
    FROM bookings b
    JOIN users u ON b.userId = u.id
    WHERE b.id = ?
  `, [bookingId], (err, booking) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Auth check
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch assignment details if any
    db.get(`
      SELECT da.*, u.firstName as driverFirstName, u.lastName as driverLastName, u.phone as driverPhone
      FROM deliveryAssignments da
      LEFT JOIN users u ON da.assignedToAdminId = u.id
      WHERE da.bookingId = ?
    `, [bookingId], (err, assignment) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json({ ...booking, assignment });
    });
  });
});

// UPDATE BOOKING STATUS (Admin: approve/cancel, Customer: cancel pending)
router.patch('/:id/status', authenticateToken, (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body; // approved, cancelled, completed, etc.

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  db.get('SELECT * FROM bookings WHERE id = ?', [bookingId], (err, booking) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Customer can only cancel pending bookings
    if (req.user.role === 'customer') {
      if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ message: 'Customers can only update status to cancelled' });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    db.run(`
      UPDATE bookings
      SET status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, bookingId], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update booking status', error: err.message });
      }
      res.json({ message: `Booking status updated to ${status}` });
    });
  });
});

// ASSIGN BOOKING TO ADMIN/DRIVER (Admin only)
router.post('/:id/assign', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const bookingId = req.params.id;
  const { assignedToAdminId } = req.body;

  if (!assignedToAdminId) {
    return res.status(400).json({ message: 'assignedToAdminId is required' });
  }

  // Ensure target admin/driver exists and is an admin
  db.get('SELECT id, role FROM users WHERE id = ?', [assignedToAdminId], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user || user.role !== 'admin') {
      return res.status(400).json({ message: 'Target user must be a valid Administrator/Driver' });
    }

    // Ensure booking exists
    db.get('SELECT status FROM bookings WHERE id = ?', [bookingId], (err, booking) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      db.serialize(() => {
        // Upsert assignment entry
        db.run(`
          INSERT INTO deliveryAssignments (bookingId, assignedToAdminId, assignmentDate, status)
          VALUES (?, ?, CURRENT_TIMESTAMP, 'pending')
          ON CONFLICT(bookingId) DO UPDATE SET
            assignedToAdminId = excluded.assignedToAdminId,
            assignmentDate = CURRENT_TIMESTAMP,
            status = 'pending'
        `, [bookingId, assignedToAdminId], (err) => {
          if (err) {
            // SQLite 3.35+ supports ON CONFLICT, if it fails, delete & insert
            // Let's do a safe manually check instead to support older sqlite versions
            db.get('SELECT id FROM deliveryAssignments WHERE bookingId = ?', [bookingId], (err, exist) => {
              if (exist) {
                db.run(`
                  UPDATE deliveryAssignments
                  SET assignedToAdminId = ?, status = 'pending', assignmentDate = CURRENT_TIMESTAMP
                  WHERE bookingId = ?
                `, [assignedToAdminId, bookingId]);
              } else {
                db.run(`
                  INSERT INTO deliveryAssignments (bookingId, assignedToAdminId, assignmentDate, status)
                  VALUES (?, ?, CURRENT_TIMESTAMP, 'pending')
                `, [bookingId, assignedToAdminId]);
              }
            });
          }

          // Update booking status to 'assigned'
          db.run(`
            UPDATE bookings
            SET status = 'assigned', updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [bookingId], (err) => {
            if (err) {
              return res.status(500).json({ message: 'Failed to update booking status to assigned', error: err.message });
            }
            res.json({ message: 'Booking successfully assigned to administrator/driver' });
          });
        });
      });
    });
  });
});

// INITIALIZE PAYMENT (Paystack)
router.post('/:id/pay', authenticateToken, async (req, res) => {
  const bookingId = req.params.id;

  db.get('SELECT b.*, u.email FROM bookings b JOIN users u ON b.userId = u.id WHERE b.id = ?', [bookingId], async (err, booking) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Auth check
    if (booking.userId !== req.user.id) return res.status(403).json({ message: 'Access denied' });
    
    // Check if already paid
    if (booking.paymentStatus === 'paid') return res.status(400).json({ message: 'Booking is already paid' });

    // Calculate amount (e.g. 50 NGN or whatever currency per liter. Assuming 1000 kobo (10 NGN) per liter for test)
    // Paystack requires amount in kobo (base unit). Let's say 1 liter = 50 NGN = 5000 kobo
    const pricePerLiterKobo = 5000; 
    const amountKobo = Math.round(booking.quantity * pricePerLiterKobo);

    const secretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder'; // Use placeholder if not provided

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: booking.email,
          amount: amountKobo,
          reference: `booking_${booking.id}_${Date.now()}`,
          metadata: {
            bookingId: booking.id,
            userId: booking.userId
          },
          // Ensure frontend URL matches where you run the dev server
          callback_url: `${req.protocol}://${req.get('host')}/dashboard`
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ message: 'Paystack API Error', error: data.message });
      }

      // Update booking with pending reference
      db.run('UPDATE bookings SET paystackReference = ? WHERE id = ?', [data.data.reference, booking.id], (err) => {
        if (err) console.error('Failed to update reference:', err.message);
      });

      res.json({ authorization_url: data.data.authorization_url });
    } catch (err) {
      console.error('Payment initialization error:', err);
      res.status(500).json({ message: 'Failed to initialize payment', error: err.message });
    }
  });
});

module.exports = router;
