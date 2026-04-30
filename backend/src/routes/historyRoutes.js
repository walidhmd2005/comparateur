const router = require('express').Router();
const { getHistory, getSimulation } = require('../controllers/historyController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', getHistory);
router.get('/:id', getSimulation);

module.exports = router;
