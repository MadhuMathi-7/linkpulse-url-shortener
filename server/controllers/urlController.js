const { nanoid } = require('nanoid');
const QRCode = require('qrcode');
const Url = require('../models/Url');
const Visit = require('../models/Visit');

// Helper to validate a URL format on the server side
const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

// @desc    Create a short URL
// @route   POST /api/urls
// @access  Private
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiryDate } = req.body;
    const userId = req.user.id;
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    let shortCode;

    if (customAlias) {
      const trimmedAlias = customAlias.trim();

      // Check if custom alias is already taken
      const aliasExists = await Url.findOne({
        $or: [{ shortCode: trimmedAlias }, { customAlias: trimmedAlias }],
      });

      if (aliasExists) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias is already in use. Please select another one.',
        });
      }
      shortCode = trimmedAlias;
    } else {
      // Generate unique nanoid shortCode and make sure it does not collide
      let unique = false;
      while (!unique) {
        const potentialCode = nanoid(6);
        const codeExists = await Url.findOne({ shortCode: potentialCode });
        if (!codeExists) {
          shortCode = potentialCode;
          unique = true;
        }
      }
    }

    const shortUrl = `${baseUrl}/${shortCode}`;

    // Generate base64 QR Code
    let qrCode;
    try {
      qrCode = await QRCode.toDataURL(shortUrl, {
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        width: 400,
      });
    } catch (qrError) {
      console.error('QR Code Generation failed:', qrError.message);
      qrCode = 'failed-to-generate';
    }

    const newUrl = await Url.create({
      userId,
      originalUrl,
      shortCode,
      customAlias: customAlias ? customAlias.trim() : undefined,
      qrCode,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      totalClicks: 0,
    });

    res.status(201).json({
      success: true,
      data: newUrl,
    });
  } catch (error) {
    console.error('Create Short URL Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error creating short URL' });
  }
};

// @desc    Get user's short URLs
// @route   GET /api/urls
// @access  Private
const getUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Parse query params for search, pagination, filter, sorting
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all'; // all, active, expired
    const sortBy = req.query.sortBy || 'createdAt'; // createdAt, totalClicks, expiryDate
    const sortOrder = req.query.sortOrder || 'desc'; // asc, desc

    const query = { userId };

    // Search query mapping
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { customAlias: { $regex: search, $options: 'i' } },
      ];
    }

    // Status query filter
    const now = new Date();
    if (status === 'active') {
      query.$or = [
        { expiryDate: null },
        { expiryDate: { $gt: now } }
      ];
    } else if (status === 'expired') {
      query.expiryDate = { $ne: null, $lte: now };
    }

    const sortOption = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const skipIndex = (page - 1) * limit;

    const urls = await Url.find(query)
      .sort(sortOption)
      .skip(skipIndex)
      .limit(limit);

    const total = await Url.countDocuments(query);

    // Get count summaries for cards (dashboard overview stats)
    const totalLinks = await Url.countDocuments({ userId });
    const totalClicksResult = await Url.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$totalClicks' } } },
    ]);
    const totalClicks = totalClicksResult[0] ? totalClicksResult[0].total : 0;

    const activeLinks = await Url.countDocuments({
      userId,
      $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }],
    });

    const expiredLinks = await Url.countDocuments({
      userId,
      expiryDate: { $ne: null, $lte: now },
    });

    res.json({
      success: true,
      data: urls,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalLinks,
        totalClicks,
        activeLinks,
        expiredLinks,
      },
    });
  } catch (error) {
    console.error('Get User URLs Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving URLs' });
  }
};

// @desc    Get individual URL details
// @route   GET /api/urls/:id
// @access  Private
const getUrlById = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    // Check ownership
    if (url.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this URL' });
    }

    res.json({ success: true, data: url });
  } catch (error) {
    console.error('Get URL Details Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving URL details' });
  }
};

// @desc    Update a URL (Destination & Expiry Date)
// @route   PUT /api/urls/:id
// @access  Private
const updateUrl = async (req, res) => {
  try {
    const { originalUrl, expiryDate } = req.body;
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    // Check ownership
    if (url.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this URL' });
    }

    url.originalUrl = originalUrl || url.originalUrl;
    
    if (expiryDate === null || expiryDate === '') {
      url.expiryDate = null;
    } else if (expiryDate) {
      url.expiryDate = new Date(expiryDate);
    }

    await url.save();

    res.json({
      success: true,
      message: 'URL updated successfully',
      data: url,
    });
  } catch (error) {
    console.error('Update URL Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating URL' });
  }
};

// @desc    Delete a URL
// @route   DELETE /api/urls/:id
// @access  Private
const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    // Check ownership
    if (url.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this URL' });
    }

    // Delete URL record
    await Url.deleteOne({ _id: req.params.id });

    // Cascade delete visits tracking records
    await Visit.deleteMany({ urlId: req.params.id });

    res.json({
      success: true,
      message: 'URL deleted successfully along with analytics records',
    });
  } catch (error) {
    console.error('Delete URL Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting URL' });
  }
};

// @desc    Bulk URL Shortening (Supports JSON list submitted from frontend CSV parser)
// @route   POST /api/urls/bulk
// @access  Private
const bulkShortenUrls = async (req, res) => {
  try {
    const { urls } = req.body; // Array: [{ originalUrl, customAlias, expiryDate }]
    const userId = req.user.id;
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bulk payload. Please provide an array of URLs.',
      });
    }

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < urls.length; i++) {
      const row = urls[i];
      let { originalUrl, customAlias, expiryDate } = row;

      // Clean properties
      originalUrl = originalUrl ? originalUrl.trim() : '';
      customAlias = customAlias ? customAlias.trim() : '';
      expiryDate = expiryDate ? expiryDate.trim() : '';

      // Validation 1: Check originalUrl
      if (!originalUrl || !isValidUrl(originalUrl)) {
        results.push({
          originalUrl,
          customAlias,
          status: 'failed',
          error: 'Invalid URL format. Must include http:// or https://',
        });
        failureCount++;
        continue;
      }

      // Validation 2: Check custom alias if exists
      let shortCode = '';
      if (customAlias) {
        const aliasExists = await Url.findOne({
          $or: [{ shortCode: customAlias }, { customAlias }],
        });
        if (aliasExists) {
          results.push({
            originalUrl,
            customAlias,
            status: 'failed',
            error: `Custom alias '${customAlias}' is already in use`,
          });
          failureCount++;
          continue;
        }
        shortCode = customAlias;
      } else {
        // Generate nanoid shortCode
        let unique = false;
        while (!unique) {
          const potentialCode = nanoid(6);
          const codeExists = await Url.findOne({ shortCode: potentialCode });
          if (!codeExists) {
            shortCode = potentialCode;
            unique = true;
          }
        }
      }

      // Check Expiry Date
      let parsedExpiry = null;
      if (expiryDate) {
        const dateVal = new Date(expiryDate);
        if (isNaN(dateVal.getTime()) || dateVal < new Date()) {
          results.push({
            originalUrl,
            customAlias,
            status: 'failed',
            error: 'Expiry date must be a valid future ISO date string',
          });
          failureCount++;
          continue;
        }
        parsedExpiry = dateVal;
      }

      const shortUrl = `${baseUrl}/${shortCode}`;

      // Generate base64 QR Code
      let qrCode;
      try {
        qrCode = await QRCode.toDataURL(shortUrl, { width: 400 });
      } catch (qrErr) {
        qrCode = 'failed';
      }

      // Create Database Record
      try {
        const newUrl = await Url.create({
          userId,
          originalUrl,
          shortCode,
          customAlias: customAlias || undefined,
          qrCode,
          expiryDate: parsedExpiry,
          totalClicks: 0,
        });

        results.push({
          _id: newUrl._id,
          originalUrl: newUrl.originalUrl,
          shortCode: newUrl.shortCode,
          shortUrl,
          customAlias: newUrl.customAlias,
          qrCode: newUrl.qrCode,
          expiryDate: newUrl.expiryDate,
          status: 'success',
        });
        successCount++;
      } catch (dbErr) {
        results.push({
          originalUrl,
          customAlias,
          status: 'failed',
          error: dbErr.message || 'Database error occurred',
        });
        failureCount++;
      }
    }

    res.json({
      success: true,
      summary: {
        total: urls.length,
        success: successCount,
        failure: failureCount,
      },
      results,
    });
  } catch (error) {
    console.error('Bulk Shorten Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error processing bulk URLs' });
  }
};

module.exports = {
  createShortUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  bulkShortenUrls,
};
