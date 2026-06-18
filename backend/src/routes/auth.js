const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/database.js');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email.js');

const JWT_SECRET = process.env.JWT_SECRET || 'binuthman_jwt_secret_token_key_2026_water_app';

// REGISTER
router.post('/register', (req, res) => {
  const { email, password, firstName, lastName, phone, address } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Email, password, firstName and lastName are required' });
  }

  // Check if user already exists
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (row) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const role = 'customer'; // Default registration role is customer

    db.run(`
      INSERT INTO users (email, password, firstName, lastName, phone, address, role, isEmailVerified, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1)
    `, [email, passwordHash, firstName, lastName, phone, address], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create user', error: err.message });
      }

      const userId = this.lastID;

      // Generate Email Verification Token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

      db.run(`
        INSERT INTO emailVerificationTokens (userId, token, expiresAt)
        VALUES (?, ?, ?)
      `, [userId, token, expiresAt.toISOString()], (err) => {
        if (err) {
          console.error('Failed to create verification token:', err.message);
          // Still return success for registration but log error
        } else {
          // Send verification email (async, don't wait for response)
          sendVerificationEmail(email, token, firstName).catch(console.error);
        }

        res.status(201).json({
          message: 'Registration successful! Please check your email to verify your account.',
          userId
        });
      });
    });
  });
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Please contact support.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        isEmailVerified: user.isEmailVerified
      }
    });
  });
});

// VERIFY EMAIL
router.get('/verify-email', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  db.get('SELECT * FROM emailVerificationTokens WHERE token = ?', [token], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!row) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    const now = new Date();
    if (new Date(row.expiresAt) < now) {
      return res.status(400).json({ message: 'Verification token has expired. Please register again or request a new verification.' });
    }

    // Verify user
    db.run('UPDATE users SET isEmailVerified = 1 WHERE id = ?', [row.userId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to verify user', error: err.message });
      }

      // Delete token
      db.run('DELETE FROM emailVerificationTokens WHERE id = ?', [row.id]);

      res.json({ message: 'Email verified successfully! You can now log in.' });
    });
  });
});

// REQUEST PASSWORD RESET
router.post('/request-password-reset', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  db.get('SELECT id, firstName FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (!user) {
      // Return 200 for security reasons, so user enumeration is harder
      return res.json({ message: 'If that email exists in our system, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Delete any old tokens first
    db.run('DELETE FROM passwordResetTokens WHERE userId = ?', [user.id], (err) => {
      if (err) console.error(err.message);

      db.run(`
        INSERT INTO passwordResetTokens (userId, token, expiresAt)
        VALUES (?, ?, ?)
      `, [user.id, token, expiresAt.toISOString()], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to generate reset token', error: err.message });
        }

        sendPasswordResetEmail(email, token, user.firstName).catch(console.error);

        res.json({ message: 'If that email exists in our system, a reset link has been sent.' });
      });
    });
  });
});

// RESET PASSWORD
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and newPassword are required' });
  }

  db.get('SELECT * FROM passwordResetTokens WHERE token = ?', [token], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!row) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    const now = new Date();
    if (new Date(row.expiresAt) < now) {
      return res.status(400).json({ message: 'Password reset token has expired' });
    }

    const newPasswordHash = bcrypt.hashSync(newPassword, 10);

    db.run('UPDATE users SET password = ? WHERE id = ?', [newPasswordHash, row.userId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to reset password', error: err.message });
      }

      // Delete token
      db.run('DELETE FROM passwordResetTokens WHERE id = ?', [row.id]);

      res.json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
    });
  });
});

module.exports = router;
