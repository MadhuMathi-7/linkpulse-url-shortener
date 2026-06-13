require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const UAParser = require('ua-parser-js');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');
const Url = require('./models/Url');
const Visit = require('./models/Visit');
const { getGeoLocation } = require('./utils/geo');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Security and Utility Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local base64/assets if needed
}));
app.use(cors({
  origin: '*', // For production, specify real domains or allow all for hackathon convenience
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

app.use('/api/', apiLimiter);

// Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// @desc    Get public statistics for a short link
// @route   GET /stats/:shortCode
// @access  Public
app.get('/stats/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }]
    });

    if (!url) {
      return res.status(404).json({ success: false, message: 'Short URL not found' });
    }

    // Expose only public, non-sensitive data
    const lastVisit = await Visit.findOne({ urlId: url._id }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: {
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        totalClicks: url.totalClicks,
        createdAt: url.createdAt,
        qrCode: url.qrCode,
        lastVisitedTime: lastVisit ? lastVisit.timestamp : null,
      }
    });
  } catch (error) {
    console.error('Public Stats Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving statistics' });
  }
});

// @desc    Redirect short code to original URL
// @route   GET /:shortCode
// @access  Public
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Skip internal resources or favicon.ico
    if (shortCode === 'favicon.ico') {
      return res.status(404).end();
    }

    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }]
    });

    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://linkpulse.vercel.app' // Example default production client
      : 'http://localhost:5173';

    if (!url) {
      return res.redirect(`${frontendUrl}/not-found`);
    }

    // Check expiry
    if (url.expiryDate && new Date(url.expiryDate) < new Date()) {
      return res.redirect(`${frontendUrl}/expired`);
    }

    // Perform redirection immediately to maximize speed
    res.redirect(302, url.originalUrl);

    // Track analytics asynchronously in the background (Non-blocking)
    (async () => {
      try {
        const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
        // Handle comma-separated x-forwarded-for proxy lists
        const ip = rawIp.split(',')[0].trim();

        // User-Agent Parsing
        const parser = new UAParser(req.headers['user-agent']);
        const uaResult = parser.getResult();
        const browser = uaResult.browser.name || 'Unknown';
        const os = uaResult.os.name || 'Unknown';
        
        let deviceType = uaResult.device.type || 'Desktop';
        // Normalize device name to look neat (Desktop, Mobile, Tablet)
        deviceType = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);

        const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';

        // Geolocation Lookup
        const { country, city } = await getGeoLocation(ip);

        // Record Visit
        await Visit.create({
          urlId: url._id,
          ipAddress: ip,
          browser,
          operatingSystem: os,
          deviceType,
          country,
          city,
          referrer,
        });

        // Increment Clicks count
        await Url.updateOne({ _id: url._id }, { $inc: { totalClicks: 1 } });
      } catch (trackError) {
        console.error('Async Redirect Tracking Error:', trackError.message);
      }
    })();

  } catch (error) {
    console.error('Redirection Controller Error:', error.message);
    res.status(500).send('Server Redirection Error');
  }
});

// Root route placeholder
app.get('/', (req, res) => {
  res.send('LinkPulse API is running...');
});

// Fallback 404 Route
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
