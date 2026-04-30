const router = require('express').Router();
const { getDashboard, getUsers, getSimulations } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.use(authMiddleware, requireRole('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/simulations', getSimulations);

module.exports = router;
