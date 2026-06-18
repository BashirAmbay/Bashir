const express = require('express');
const router = express.Router();
const db = require('../config/database.js');
const { authenticateToken, isAdmin } = require('../middleware/auth.js');

// GET ASSIGNED DELIVERIES (Admin/Driver only)
router.get('/', authenticateToken, isAdmin, (req, res) => {
  db.all(`
    SELECT da.*, b.quantity, b.deliveryAddress, b.preferredDeliveryDate, b.notes as bookingNotes, b.status as bookingStatus,
           u.firstName as customerFirstName, u.lastName as customerLastName, u.phone as customerPhone, u.email as customerEmail
    FROM deliveryAssignments da
    JOIN bookings b ON da.bookingId = b.id
    JOIN users u ON b.userId = u.id
    WHERE da.assignedToAdminId = ?
    ORDER BY da.createdAt DESC
  `, [req.user.id], (err, assignments) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.json(assignments);
  });
});

// UPDATE ASSIGNMENT STATUS (Admin/Driver only)
router.patch('/:id', authenticateToken, isAdmin, (req, res) => {
  const assignmentId = req.params.id;
  const { status, deliveryNotes } = req.body; // pending, in_progress, completed, failed

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const allowedStatuses = ['pending', 'in_progress', 'completed', 'failed'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid assignment status' });
  }

  // Get current assignment
  db.get('SELECT * FROM deliveryAssignments WHERE id = ?', [assignmentId], (err, assignment) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Ensure driver owns this assignment or is the assigned admin
    if (assignment.assignedToAdminId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You are not assigned to this delivery' });
    }

    const actualDeliveryDate = status === 'completed' ? new Date().toISOString() : null;

    db.serialize(() => {
      // Update assignment
      db.run(`
        UPDATE deliveryAssignments
        SET status = ?, actualDeliveryDate = ?, deliveryNotes = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [status, actualDeliveryDate, deliveryNotes || assignment.deliveryNotes || '', assignmentId], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Failed to update assignment', error: err.message });
        }

        // Keep booking status synchronized
        let bookingStatusUpdate = 'assigned';
        if (status === 'completed') {
          bookingStatusUpdate = 'completed';
        } else if (status === 'failed') {
          // If delivery fails, we reset booking status back to 'approved' so it can be re-assigned
          bookingStatusUpdate = 'approved';
        }

        db.run(`
          UPDATE bookings
          SET status = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [bookingStatusUpdate, assignment.bookingId], (err) => {
          if (err) {
            console.error('Failed to update booking status:', err.message);
          }
          res.json({ message: 'Delivery status updated successfully', assignmentId, status });
        });
      });
    });
  });
});

module.exports = router;
