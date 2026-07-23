const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'binuthman.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  
  db.serialize(() => {
    db.run("ALTER TABLE bookings ADD COLUMN paymentStatus TEXT CHECK(paymentStatus IN ('unpaid', 'paid', 'failed')) DEFAULT 'unpaid'", (err) => {
      if (err) console.error("Error adding paymentStatus:", err.message);
      else console.log("Added paymentStatus column");
    });
    
    db.run("ALTER TABLE bookings ADD COLUMN paystackReference TEXT", (err) => {
      if (err) console.error("Error adding paystackReference:", err.message);
      else console.log("Added paystackReference column");
    });
  });

  setTimeout(() => {
    db.close();
    console.log("Migration finished.");
    process.exit(0);
  }, 1000);
});
