const mongoose = require('mongoose');
const Url = require('../models/Url');
const Visit = require('../models/Visit');

// Helper to get array of last N days formatted as YYYY-MM-DD
const getLastNDaysList = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

// @desc    Get detailed analytics for a URL
// @route   GET /api/analytics/:urlId
// @access  Private
const getUrlAnalytics = async (req, res) => {
  try {
    const { urlId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(urlId)) {
      return res.status(400).json({ success: false, message: 'Invalid URL ID format' });
    }

    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    // Check ownership
    if (url.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view analytics for this URL' });
    }

    // Fetch all visits for this urlId
    const visits = await Visit.find({ urlId }).sort({ timestamp: -1 });

    // Calculate metrics in Javascript
    const totalClicks = visits.length;
    const lastVisit = totalClicks > 0 ? visits[0].timestamp : null;

    // 1. Calculate Active Days
    const activeDaysSet = new Set();
    visits.forEach((v) => {
      if (v.timestamp) {
        activeDaysSet.add(v.timestamp.toISOString().split('T')[0]);
      }
    });
    const activeDaysCount = activeDaysSet.size;

    // 2. Aggregate Device Distribution
    const deviceMap = {};
    // 3. Aggregate Browser Distribution
    const browserMap = {};
    // 4. Aggregate Country Distribution
    const countryMap = {};
    // 5. Aggregate City Distribution
    const cityMap = {};
    // 6. Aggregate Referrer Distribution
    const referrerMap = {};

    visits.forEach((v) => {
      // Devices
      const dev = v.deviceType || 'Desktop';
      deviceMap[dev] = (deviceMap[dev] || 0) + 1;

      // Browsers
      const br = v.browser || 'Unknown';
      browserMap[br] = (browserMap[br] || 0) + 1;

      // Geolocation
      const co = v.country || 'Unknown';
      countryMap[co] = (countryMap[co] || 0) + 1;

      const ci = v.city || 'Unknown';
      cityMap[ci] = (cityMap[ci] || 0) + 1;

      // Referrer
      let ref = 'Direct';
      if (v.referrer && v.referrer !== 'Direct') {
        try {
          const urlObj = new URL(v.referrer);
          ref = urlObj.hostname || 'Direct';
        } catch (e) {
          ref = v.referrer;
        }
      }
      referrerMap[ref] = (referrerMap[ref] || 0) + 1;
    });

    // Find Top Device
    let topDevice = 'None';
    let maxDeviceClicks = 0;
    Object.entries(deviceMap).forEach(([device, clicks]) => {
      if (clicks > maxDeviceClicks) {
        maxDeviceClicks = clicks;
        topDevice = device;
      }
    });

    // Format distributions for recharts
    const deviceStats = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));
    const browserStats = Object.entries(browserMap).map(([name, value]) => ({ name, value }));
    const countryStats = Object.entries(countryMap).map(([name, value]) => ({ name, value }));
    const cityStats = Object.entries(cityMap).map(([name, value]) => ({ name, value }));
    const referrerStats = Object.entries(referrerMap).map(([name, value]) => ({ name, value }));

    // 7. Daily Click Trends (Last 7 Days)
    const last7Days = getLastNDaysList(7);
    const dailyClicksMap = {};
    last7Days.forEach((day) => {
      dailyClicksMap[day] = 0;
    });

    visits.forEach((v) => {
      if (v.timestamp) {
        const dayStr = v.timestamp.toISOString().split('T')[0];
        if (dailyClicksMap[dayStr] !== undefined) {
          dailyClicksMap[dayStr]++;
        }
      }
    });

    const dailyTrends = last7Days.map((date) => ({
      date,
      clicks: dailyClicksMap[date],
    }));

    // Recent 20 visits detail
    const recentVisits = visits.slice(0, 20).map((v) => ({
      _id: v._id,
      timestamp: v.timestamp,
      ipAddress: v.ipAddress,
      browser: v.browser,
      operatingSystem: v.operatingSystem,
      deviceType: v.deviceType,
      country: v.country,
      city: v.city,
      referrer: v.referrer,
    }));

    res.json({
      success: true,
      data: {
        url,
        summary: {
          totalClicks,
          lastVisit,
          activeDays: activeDaysCount,
          topDevice,
        },
        charts: {
          dailyTrends,
          devices: deviceStats,
          browsers: browserStats,
          countries: countryStats,
          cities: cityStats,
          referrers: referrerStats,
        },
        recentVisits,
      },
    });
  } catch (error) {
    console.error('Get URL Analytics Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving analytics' });
  }
};

module.exports = {
  getUrlAnalytics,
};
