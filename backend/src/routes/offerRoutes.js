const router = require('express').Router();
const { body } = require('express-validator');
const { getOffers, getOffer, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validateMiddleware');

const offerRules = [
  body('provider_name').trim().notEmpty().withMessage('Provider name is required'),
  body('offer_name').trim().notEmpty().withMessage('Offer name is required'),
  body('energy_type').isIn(['electricity', 'gas']).withMessage('energy_type must be electricity or gas'),
  body('subscription_price').isFloat({ min: 0 }).withMessage('subscription_price must be a positive number'),
  body('price_per_kwh').isFloat({ min: 0 }).withMessage('price_per_kwh must be a positive number'),
];

router.get('/', getOffers);
router.get('/:id', getOffer);
router.post('/', authMiddleware, requireRole('admin'), validate(offerRules), createOffer);
router.put('/:id', authMiddleware, requireRole('admin'), updateOffer);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteOffer);

module.exports = router;
