require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const User = require('./models/User');
const Url = require('./models/Url');
const Visit = require('./models/Visit');

const connectDB = require('./config/db');

const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'];
const systems = ['Windows', 'macOS', 'iOS', 'Android', 'Linux'];
const devices = ['Desktop', 'Mobile', 'Tablet'];
const referrers = [
  'Direct',
  'https://github.com',
  'https://twitter.com',
  'https://linkedin.com',
  'https://news.ycombinator.com',
  'https://google.com'
];
const locations = [
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

const selectRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing database collections...');
    await User.deleteMany({});
    await Url.deleteMany({});
    await Visit.deleteMany({});

    console.log('Creating demo user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const user = await User.create({
      name: 'Demo Admin',
      email: 'demo@linkpulse.com',
      password: hashedPassword
    });

    console.log(`Demo User created: ${user.email} (Password: password123)`);

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    const linkConfigs = [
      {
        originalUrl: 'https://github.com/trending',
        shortCode: 'trendg',
        customAlias: 'trending-git',
        clicksCount: 84,
        daysOffset: 0, // active
        expiry: null
      },
      {
        originalUrl: 'https://news.ycombinator.com',
        shortCode: 'hacker',
        customAlias: 'hn-news',
        clicksCount: 125,
        daysOffset: 0, // active
        expiry: null
      },
      {
        originalUrl: 'https://react.dev/reference/react',
        shortCode: 'reactd',
        customAlias: null,
        clicksCount: 42,
        daysOffset: 0, // active
        expiry: null
      },
      {
        originalUrl: 'https://tailwindcss.com/docs',
        shortCode: 'tailwd',
        customAlias: 'tailwind-docs',
        clicksCount: 65,
        daysOffset: 0, // active
        expiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // expires in 10 days
      },
      {
        originalUrl: 'https://www.wikipedia.org',
        shortCode: 'wikipd',
        customAlias: 'expired-wiki',
        clicksCount: 18,
        daysOffset: -2, // expired 2 days ago
        expiry: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // expired 2 days ago
      }
    ];

    console.log('Generating URLs & QR codes...');
    const urlDocs = [];

    for (const conf of linkConfigs) {
      const qrCode = await QRCode.toDataURL(`${baseUrl}/${conf.shortCode}`, { width: 400 });
      
      const urlDoc = await Url.create({
        userId: user._id,
        originalUrl: conf.originalUrl,
        shortCode: conf.shortCode,
        customAlias: conf.customAlias || undefined,
        qrCode,
        expiryDate: conf.expiry,
        totalClicks: conf.clicksCount
      });

      urlDocs.push({
        doc: urlDoc,
        clicksCount: conf.clicksCount
      });
    }

    console.log('Populating visits tracking database (generating 330+ analytics entries)...');
    
    // Create random visits distributed over the last 7 days
    const totalVisits = [];
    const now = new Date();

    for (const item of urlDocs) {
      const urlId = item.doc._id;
      const count = item.clicksCount;

      for (let i = 0; i < count; i++) {
        // Generate random date within the last 7 days
        const randomDaysAgo = Math.random() * 7;
        const timestamp = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);

        const loc = selectRandom(locations);

        totalVisits.push({
          urlId,
          timestamp,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
          browser: selectRandom(browsers),
          operatingSystem: selectRandom(systems),
          deviceType: selectRandom(devices),
          country: loc.country,
          city: loc.city,
          referrer: selectRandom(referrers)
        });
      }
    }

    // Insert visits in bulk
    await Visit.insertMany(totalVisits);

    console.log('Seed completed successfully!');
    console.log(`Summary:\n - User: 1\n - URLs: ${urlDocs.length}\n - Visits Logged: ${totalVisits.length}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err.message);
    process.exit(1);
  }
};

seed();
