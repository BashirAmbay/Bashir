const bcrypt = require('bcryptjs');
const db = require('../../src/config/database.js');

console.log('Seeding database with default records...');

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

async function seed() {
  try {
    // Clear data to avoid conflicts on repeat runs
    await run('DELETE FROM users');
    await run('DELETE FROM bookings');
    await run('DELETE FROM deliveryAssignments');
    await run('DELETE FROM reports');
    await run('DELETE FROM emailVerificationTokens');
    await run('DELETE FROM passwordResetTokens');

    // Create passwords
    const adminPasswordHash = bcrypt.hashSync('adminpassword', 10);
    const customerPasswordHash = bcrypt.hashSync('customerpassword', 10);

    // Insert Admin
    const adminResult = await run(`
      INSERT INTO users (email, password, firstName, lastName, phone, role, address, isEmailVerified, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['admin@binuthman.com', adminPasswordHash, 'Uthman', 'Admin', '+2348011111111', 'admin', '10 Admin Block Headquarters', 1, 1]);
    const adminId = adminResult.lastID;
    console.log(`Seeded Admin with ID: ${adminId}`);

    // Insert Customer
    const customerResult = await run(`
      INSERT INTO users (email, password, firstName, lastName, phone, role, address, isEmailVerified, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['customer@binuthman.com', customerPasswordHash, 'Sani', 'Customer', '+2348022222222', 'customer', '15 Garden Avenue, Kano', 1, 1]);
    const customerId = customerResult.lastID;
    console.log(`Seeded Customer with ID: ${customerId}`);

    // Insert Unverified Customer
    await run(`
      INSERT INTO users (email, password, firstName, lastName, phone, role, address, isEmailVerified, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['unverified@binuthman.com', customerPasswordHash, 'Amina', 'New', '+2348033333333', 'customer', '24 Estate Road, Kano', 0, 1]);
    console.log('Seeded Unverified Customer');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    // Booking 1 (Pending)
    const b1Result = await run(`
      INSERT INTO bookings (userId, quantity, deliveryAddress, preferredDeliveryDate, notes, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [customerId, 10, '15 Garden Avenue, Kano', tomorrow.toISOString(), 'Please deliver in the morning.', 'pending']);
    console.log(`Seeded Pending Booking with ID: ${b1Result.lastID}`);

    // Booking 2 (Approved -> Assigned)
    const b2Result = await run(`
      INSERT INTO bookings (userId, quantity, deliveryAddress, preferredDeliveryDate, notes, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [customerId, 25, '15 Garden Avenue, Kano', dayAfter.toISOString(), 'Back door delivery.', 'assigned']);
    const booking2Id = b2Result.lastID;
    console.log(`Seeded Assigned Booking with ID: ${booking2Id}`);

    // Create Delivery Assignment for adminId (representing the admin-driver here)
    const da1Result = await run(`
      INSERT INTO deliveryAssignments (bookingId, assignedToAdminId, assignmentDate, status)
      VALUES (?, ?, ?, ?)
    `, [booking2Id, adminId, new Date().toISOString(), 'pending']);
    console.log(`Seeded Delivery Assignment with ID: ${da1Result.lastID}`);

    // Booking 3 (Completed)
    const b3Result = await run(`
      INSERT INTO bookings (userId, quantity, deliveryAddress, preferredDeliveryDate, notes, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [customerId, 5, '15 Garden Avenue, Kano', new Date().toISOString(), '', 'completed']);
    const booking3Id = b3Result.lastID;
    console.log(`Seeded Completed Booking with ID: ${booking3Id}`);

    // Create Completed Delivery Assignment
    const da2Result = await run(`
      INSERT INTO deliveryAssignments (bookingId, assignedToAdminId, assignmentDate, actualDeliveryDate, deliveryNotes, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [booking3Id, adminId, new Date().toISOString(), new Date().toISOString(), 'Delivered to security post.', 'completed']);
    console.log(`Seeded Completed admin with ID: ${da2Result.lastID}`);

    // Seed a Report/Complaint
    const rResult = await run(`
      INSERT INTO reports (userId, type, subject, description, status)
      VALUES (?, ?, ?, ?, ?)
    `, [customerId, 'complaint', 'Delayed Delivery', 'My morning delivery was delayed by 3 hours yesterday.', 'open']);
    console.log(`Seeded Complaint Report with ID: ${rResult.lastID}`);

    console.log('Database seeding successfully finished.');
    setTimeout(() => {
      db.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.error('Seeding failed with error:', err.message);
    setTimeout(() => {
      db.close();
      process.exit(1);
    }, 500);
  }
}

seed();
