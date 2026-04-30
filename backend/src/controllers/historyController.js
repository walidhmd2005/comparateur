const Simulation = require('../models/Simulation');

async function getHistory(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await Simulation.findByUser(req.user.id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getSimulation(req, res, next) {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) return res.status(404).json({ error: 'Simulation not found' });
    if (simulation.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json({ simulation });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHistory, getSimulation };
