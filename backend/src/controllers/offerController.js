const Offer = require('../models/Offer');

async function getOffers(req, res, next) {
  try {
    const { energy_type, green_energy, page = 1, limit = 50 } = req.query;
    const result = await Offer.getAll({
      energy_type,
      green_energy: green_energy !== undefined ? green_energy === 'true' : undefined,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getOffer(req, res, next) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    res.json({ offer });
  } catch (err) {
    next(err);
  }
}

async function createOffer(req, res, next) {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ offer });
  } catch (err) {
    next(err);
  }
}

async function updateOffer(req, res, next) {
  try {
    const existing = await Offer.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Offer not found' });

    const offer = await Offer.update(req.params.id, req.body);
    res.json({ offer });
  } catch (err) {
    next(err);
  }
}

async function deleteOffer(req, res, next) {
  try {
    const deleted = await Offer.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Offer not found' });
    res.json({ message: 'Offer deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOffers, getOffer, createOffer, updateOffer, deleteOffer };
