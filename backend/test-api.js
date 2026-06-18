const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

function post(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, error: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

function get(path, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'GET',
      headers: {}
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, error: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING BACKEND INTEGRATION SMOKE TESTS ---');
  let token = null;

  try {
    // 1. Healthcheck
    console.log('Testing Healthcheck...');
    const health = await get('/api/health');
    console.log(`Health Status: ${health.status} (${JSON.stringify(health.data)})\n`);

    // 2. Login as Seeded Customer
    console.log('Testing Login (customer@binuthman.com)...');
    const loginRes = await post('/api/auth/login', {
      email: 'customer@binuthman.com',
      password: 'customerpassword'
    });
    console.log(`Login Status: ${loginRes.status}`);
    if (loginRes.status === 200 && loginRes.data.token) {
      token = loginRes.data.token;
      console.log('Login successful, token retrieved.');
    } else {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.data)}`);
    }
    console.log();

    // 3. Fetch Profile
    console.log('Testing Fetch Profile...');
    const profileRes = await get('/api/users/profile', token);
    console.log(`Profile Status: ${profileRes.status}`);
    console.log(`Profile Data: ${profileRes.data.firstName} ${profileRes.data.lastName} (${profileRes.data.email})\n`);

    // 4. Place Booking
    console.log('Testing Create Booking (15 Liters)...');
    const bookingRes = await post('/api/bookings', {
      quantity: 15,
      deliveryAddress: '15 Garden Avenue, Kano',
      preferredDeliveryDate: new Date(Date.now() + 86400000).toISOString(),
      notes: 'Test Booking note'
    }, token);
    console.log(`Booking Status: ${bookingRes.status}`);
    console.log(`Booking Data: ${JSON.stringify(bookingRes.data.booking)}\n`);

    // 5. Get Bookings list
    console.log('Testing Get Bookings List...');
    const listRes = await get('/api/bookings', token);
    console.log(`Get List Status: ${listRes.status}`);
    console.log(`Number of Bookings: ${listRes.data.length}\n`);

    console.log('--- ALL BACKEND SMOKE TESTS PASSED SUCCESSFULLY! ---');
    process.exit(0);
  } catch (err) {
    console.error('--- SMOKE TEST FAILED ---');
    console.error(err);
    process.exit(1);
  }
}

// Run server verification
runTests();
