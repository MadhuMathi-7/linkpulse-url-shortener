const { check, validationResult } = require('express-validator');

const validateUrlCreate = [
  check('originalUrl', 'Please enter a valid URL')
    .notEmpty()
    .isURL({
      require_protocol: true,
      protocols: ['http', 'https'],
    }),
  check('customAlias')
    .optional({ checkFalsy: true })
    .isAlphanumeric('en-US', { ignore: '-_' })
    .withMessage('Custom alias must contain only letters, numbers, hyphens, or underscores')
    .isLength({ min: 3, max: 30 })
    .withMessage('Custom alias must be between 3 and 30 characters long'),
  check('expiryDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO8601 date string')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateUrlUpdate = [
  check('originalUrl', 'Please enter a valid URL')
    .notEmpty()
    .isURL({
      require_protocol: true,
      protocols: ['http', 'https'],
    }),
  check('expiryDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO8601 date string')
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateUrlCreate,
  validateUrlUpdate,
};
