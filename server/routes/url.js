const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  bulkShortenUrls,
} = require('../controllers/urlController');
const { protect } = require('../middlewares/auth');
const { validateUrlCreate, validateUrlUpdate } = require('../validators/url');

// All URL management routes are protected
router.use(protect);

// GET /api/urls - Get paginated/searchable URLs list
// POST /api/urls - Create short URL
router.route('/')
  .get(getUrls)
  .post(validateUrlCreate, createShortUrl);

// POST /api/urls/bulk - Bulk shorten URLs
router.post('/bulk', bulkShortenUrls);

// GET /api/urls/:id - Get URL details
// PUT /api/urls/:id - Update URL (originalUrl, expiry)
// DELETE /api/urls/:id - Delete URL
router.route('/:id')
  .get(getUrlById)
  .put(validateUrlUpdate, updateUrl)
  .delete(deleteUrl);

module.exports = router;
