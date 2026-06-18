const express = require('express');
const router = express.Router();
const db = require('../config/database.js');
const { authenticateToken, isAdmin } = require('../middleware/auth.js');

// SUBMIT REPORT (Customer)
router.post('/', authenticateToken, (req, res) => {
  const { bookingId, type, subject, description, attachments } = req.body;
  const userId = req.user.id;

  if (!type || !subject || !description) {
    return res.status(400).json({ message: 'Type, subject, and description are required' });
  }

  const allowedTypes = ['complaint', 'feedback', 'issue'];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid report type' });
  }

  db.run(`
    INSERT INTO reports (userId, bookingId, type, subject, description, attachments, status)
    VALUES (?, ?, ?, ?, ?, ?, 'open')
  `, [userId, bookingId || null, type, subject, description, attachments || ''], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to submit report', error: err.message });
    }

    const reportId = this.lastID;
    db.get('SELECT * FROM reports WHERE id = ?', [reportId], (err, report) => {
      if (err) {
        return res.status(500).json({ message: 'Report submitted but failed to fetch details', error: err.message });
      }
      res.status(201).json({ message: 'Report submitted successfully', report });
    });
  });
});

// GET REPORTS (Admin: all, Customer: own)
router.get('/', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    db.all(`
      SELECT r.*, u.firstName, u.lastName, u.email, u.phone, b.quantity as bookingQuantity, b.status as bookingStatus
      FROM reports r
      JOIN users u ON r.userId = u.id
      LEFT JOIN bookings b ON r.bookingId = b.id
      ORDER BY r.createdAt DESC
    `, [], (err, reports) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json(reports);
    });
  } else {
    db.all(`
      SELECT r.*, b.quantity as bookingQuantity, b.status as bookingStatus
      FROM reports r
      LEFT JOIN bookings b ON r.bookingId = b.id
      WHERE r.userId = ?
      ORDER BY r.createdAt DESC
    `, [req.user.id], (err, reports) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json(reports);
    });
  }
});

// ADMIN RESPONSE TO REPORT (Admin only)
router.post('/:id/respond', authenticateToken, isAdmin, (req, res) => {
  const reportId = req.params.id;
  const { adminResponse, status } = req.body; // open, in_progress, resolved, closed

  if (!adminResponse || !status) {
    return res.status(400).json({ message: 'adminResponse and status are required' });
  }

  const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status type' });
  }

  db.get('SELECT * FROM reports WHERE id = ?', [reportId], (err, report) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    db.run(`
      UPDATE reports
      SET adminResponse = ?, status = ?, respondedByAdminId = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [adminResponse, status, req.user.id, reportId], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update report', error: err.message });
      }
      res.json({ message: 'Response added and report status updated', reportId, status });
    });
  });
});

module.exports = router;
