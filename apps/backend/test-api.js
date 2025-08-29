const http = require('http');

// Test the user routes
const testUserRoutes = () => {
  console.log('Testing User Routes...');
  
  // Test GET /api/user/me (should return 401 without auth)
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/user/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`GET /api/user/me - Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Response:', JSON.parse(data));
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
};

// Test the routes endpoint to see all available routes
const testRoutes = () => {
  console.log('\nTesting Routes Endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/routes',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`GET /api/routes - Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      const routes = JSON.parse(data);
      console.log('Available routes:');
      routes.data.routes.forEach(route => {
        if (route.path.includes('/user')) {
          console.log(`  ${route.method} ${route.path} - ${route.description}`);
        }
      });
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
};

// Run tests
console.log('Starting API Tests...\n');
testUserRoutes();
setTimeout(testRoutes, 1000);
