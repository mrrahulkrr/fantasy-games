// server/middleware/validation.js
const { body, param, validationResult } = require('express-validator');

const teamValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Team name must be between 3 and 50 characters'),
  body('players')
    .isArray({ min: 11, max: 11 })
    .withMessage('Team must have exactly 11 players'),
  body('players.*')
    .isMongoId()
    .withMessage('Invalid player ID'),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  teamValidationRules,
  validateRequest,
};