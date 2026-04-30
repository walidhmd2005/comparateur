const router = require('express').Router();
const { body } = require('express-validator');
const { compare } = require('../controllers/compareController');
const validate = require('../middlewares/validateMiddleware');

const compareRules = [
  body('consumption_kwh').isFloat({ min: 1 }).withMessage('consumption_kwh must be a positive number'),
  body('energy_type').isIn(['electricity', 'gas']).withMessage('energy_type must be electricity or gas'),
  body('green_only').optional().isBoolean(),
  body('sort_by').optional().isIn(['annual_cost', 'price_per_kwh', 'subscription_price']),
  body('order').optional().isIn(['asc', 'desc']),
];

router.post('/', validate(compareRules), compare);

module.exports = router;
