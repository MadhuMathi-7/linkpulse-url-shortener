const http = require('http');

// Predefined mock locations for local testing (localhost, ::1, private IPs)
const mockLocations = [
  { country: 'United States', city: 'New York' },
  { country: 'United States', city: 'San Francisco' },
  { country: 'United Kingdom', city: 'London' },
  { country: 'Germany', city: 'Berlin' },
  { country: 'India', city: 'Mumbai' },
  { country: 'India', city: 'Bangalore' },
  { country: 'Singapore', city: 'Singapore' },
  { country: 'Japan', city: 'Tokyo' },
  { country: 'France', city: 'Paris' },
  { country: 'Canada', city: 'Toronto' }
];

const getRandomMockLocation = () => {
  const randomIndex = Math.floor(Math.random() * mockLocations.length);
  return mockLocations[randomIndex];
};

const getGeoLocation = async (ip) => {
  // Check if IP is local/private
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return getRandomMockLocation();
  }

  return new Promise((resolve) => {
    // We request from ip-api.com (free, no token, JSON endpoint)
    // Wrap in a try-catch and timeout to ensure the process never hangs
    const request = http.get(`http://ip-api.com/json/${ip}`, { timeout: 1500 }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.status === 'success') {
            resolve({
              country: parsed.country || 'Unknown',
              city: parsed.city || 'Unknown'
            });
          } else {
            resolve({ country: 'Unknown', city: 'Unknown' });
          }
        } catch (err) {
          resolve({ country: 'Unknown', city: 'Unknown' });
        }
      });
    });

    request.on('error', () => {
      resolve({ country: 'Unknown', city: 'Unknown' });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({ country: 'Unknown', city: 'Unknown' });
    });
  });
};

module.exports = { getGeoLocation };
