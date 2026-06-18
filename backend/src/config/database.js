const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let dbPath;
if (process.env.VERCEL) {
  // On Vercel, copy the pre-seeded database file from the repository to /tmp so we can write to it.
  const tmpDbPath = '/tmp/binuthman.db';
  const repoDbPath = path.join(__dirname, '../../database/binuthman.db');
  
  if (!fs.existsSync(tmpDbPath)) {
    try {
      if (fs.existsSync(repoDbPath)) {
        fs.copyFileSync(repoDbPath, tmpDbPath);
        console.log('Database file copied to /tmp');
      } else {
        console.log('Repository database file not found at:', repoDbPath);
      }
    } catch (err) {
      console.error('Failed to copy database to /tmp:', err.message);
    }
  }
  dbPath = tmpDbPath;
} else {
  dbPath = path.join(__dirname, '../../database/binuthman.db');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
    initializeDatabase();
  }
});


function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phone TEXT,
        role TEXT CHECK(role IN ('customer', 'admin')) DEFAULT 'customer',
        address TEXT,
        isEmailVerified BOOLEAN DEFAULT 0,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bookings table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        deliveryAddress TEXT NOT NULL,
        preferredDeliveryDate DATETIME NOT NULL,
        notes TEXT,
        status TEXT CHECK(status IN ('pending', 'approved', 'assigned', 'completed', 'cancelled')) DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Delivery Assignments table
    db.run(`
      CREATE TABLE IF NOT EXISTS deliveryAssignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookingId INTEGER UNIQUE NOT NULL,
        assignedToAdminId INTEGER NOT NULL,
        assignmentDate DATETIME NOT NULL,
        actualDeliveryDate DATETIME,
        deliveryNotes TEXT,
        status TEXT CHECK(status IN ('pending', 'in_progress', 'completed', 'failed')) DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (assignedToAdminId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Reports/Complaints table
    db.run(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        bookingId INTEGER,
        type TEXT CHECK(type IN ('complaint', 'feedback', 'issue')) NOT NULL,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        attachments TEXT,
        status TEXT CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
        adminResponse TEXT,
        respondedByAdminId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE SET NULL,
        FOREIGN KEY (respondedByAdminId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Email Verification Tokens table
    db.run(`
      CREATE TABLE IF NOT EXISTS emailVerificationTokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Password Reset Tokens table
    db.run(`
      CREATE TABLE IF NOT EXISTS passwordResetTokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  });
}

module.exports = db;
