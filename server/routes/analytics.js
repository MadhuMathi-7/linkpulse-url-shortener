const express = require('express');
const router = express.Router();
const { getUrlAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/auth');

// GET /api/analytics/:urlId - Fetch detailed URL analytics
router.get('/:urlId', protect, getUrlAnalytics);

module.exports = router;
