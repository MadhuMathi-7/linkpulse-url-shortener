const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../validators/auth');
const { protect } = require('../middlewares/auth');

// POST /api/auth/signup - User registration
router.post('/signup', validateSignup, signup);

// POST /api/auth/login - User login
router.post('/login', validateLogin, login);

// GET /api/auth/me - Retrieve current logged in user details
router.get('/me', protect, getMe);

module.exports = router;
