const db = require('../../src/config/database.js');

console.log('Clearing database tables...');

db.serialize(() => {
  db.run('DELETE FROM users', (err) => { if (err) console.error(err.message); });
  db.run('DELETE FROM bookings', (err) => { if (err) console.error(err.message); });
  db.run('DELETE FROM deliveryAssignments', (err) => { if (err) console.error(err.message); });
  db.run('DELETE FROM reports', (err) => { if (err) console.error(err.message); });
  db.run('DELETE FROM emailVerificationTokens', (err) => { if (err) console.error(err.message); });
  db.run('DELETE FROM passwordResetTokens', (err) => { if (err) console.error(err.message); });

  console.log('Database tables cleared.');
  setTimeout(() => {
    db.close();
    process.exit(0);
  }, 1000);
});
