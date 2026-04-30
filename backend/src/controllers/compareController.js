const Offer = require('../models/Offer');
const Simulation = require('../models/Simulation');
const { calculateForOffers } = require('../services/calculationService');
const { sortOffers, addRanking } = require('../services/sortService');
const { sendSimulationResult } = require('../services/emailService');
const User = require('../models/User');

async function compare(req, res, next) {
  try {
    const {
      consumption_kwh,
      energy_type,
      green_only = false,
      sort_by = 'annual_cost',
      order = 'asc',
    } = req.body;

    const offers = await Offer.getByEnergyType(energy_type);
    if (offers.length === 0) {
      return res.status(404).json({ error: 'No offers found for this energy type' });
    }

    const withCosts = calculateForOffers(offers, parseFloat(consumption_kwh));
    const sorted = sortOffers(withCosts, { sortBy: sort_by, order, green_only });
    const ranked = addRanking(sorted);

    const user_id = req.user?.id || null;
    const simulation = await Simulation.create({
      user_id,
      consumption_kwh: parseFloat(consumption_kwh),
      energy_type,
      results: ranked,
    });

    if (req.user && ranked.length > 0) {
      const user = await User.findById(req.user.id);
      if (user) sendSimulationResult(user.email, user.name, ranked).catch(() => {});
    }

    res.json({
      simulation_id: simulation.id,
      consumption_kwh: parseFloat(consumption_kwh),
      energy_type,
      results: ranked,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { compare };
