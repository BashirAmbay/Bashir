const express = require('express');
const router = express.Router();
const db = require('../config/database.js');
const { authenticateToken, isAdmin } = require('../middleware/auth.js');

// GET USER PROFILE
router.get('/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, email, firstName, lastName, phone, address, role, isEmailVerified, isActive, createdAt FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  });
});

// UPDATE USER PROFILE
router.patch('/profile', authenticateToken, (req, res) => {
  const { firstName, lastName, phone, address } = req.body;
  const userId = req.user.id;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'First name and Last name are required' });
  }

  db.run(`
    UPDATE users
    SET firstName = ?, lastName = ?, phone = ?, address = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [firstName, lastName, phone || null, address || null, userId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to update profile', error: err.message });
    }

    db.get('SELECT id, email, firstName, lastName, phone, address, role, isEmailVerified, isActive, createdAt FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Profile updated but failed to fetch details', error: err.message });
      }
      res.json({ message: 'Profile updated successfully', user });
    });
  });
});

// GET ALL USERS (Admin only)
router.get('/', authenticateToken, isAdmin, (req, res) => {
  db.all('SELECT id, email, firstName, lastName, phone, address, role, isEmailVerified, isActive, createdAt FROM users ORDER BY id ASC', [], (err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.json(users);
  });
});

// UPDATE USER STATUS/ROLE (Admin only)
router.patch('/:id', authenticateToken, isAdmin, (req, res) => {
  const targetUserId = req.params.id;
  const { role, isActive } = req.body;

  if (targetUserId == req.user.id) {
    return res.status(400).json({ message: 'You cannot modify your own role or active status' });
  }

  db.get('SELECT * FROM users WHERE id = ?', [targetUserId], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newRole = role !== undefined ? role : user.role;
    const newActive = isActive !== undefined ? isActive : user.isActive;

    if (role && !['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    db.run(`
      UPDATE users
      SET role = ?, isActive = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newRole, newActive, targetUserId], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update user config', error: err.message });
      }
      res.json({ message: 'User settings updated successfully', userId: targetUserId, role: newRole, isActive: newActive });
    });
  });
});

module.exports = router;
