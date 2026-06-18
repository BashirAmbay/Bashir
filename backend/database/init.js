const path = require('path');
const fs = require('fs');

const dbDir = __dirname;
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log('Initializing SQLite database schema...');
// Importing the database module triggers Database connection and initializeDatabase()
const db = require('../src/config/database.js');

setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
      process.exit(1);
    }
    console.log('Database initialization completed.');
    process.exit(0);
  });
}, 1500);
