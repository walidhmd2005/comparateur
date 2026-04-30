const User = require('../models/User');
const Offer = require('../models/Offer');
const Simulation = require('../models/Simulation');

async function getDashboard(req, res, next) {
  try {
    const [roleStats, simCount30d, offerData, simData] = await Promise.all([
      User.countByRole(),
      Simulation.countRecent(30),
      Offer.getAll({ limit: 1 }),
      Simulation.getAll({ limit: 1 }),
    ]);

    const totalUsers = roleStats.reduce((sum, r) => sum + parseInt(r.count, 10), 0);

    res.json({
      users: {
        total: totalUsers,
        by_role: roleStats,
      },
      offers: {
        total: offerData.total,
      },
      simulations: {
        total: simData.total,
        last_30_days: parseInt(simCount30d, 10),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getUsers(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await User.getAll({ page: parseInt(page, 10), limit: parseInt(limit, 10) });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getSimulations(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await Simulation.getAll({ page: parseInt(page, 10), limit: parseInt(limit, 10) });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard, getUsers, getSimulations };
