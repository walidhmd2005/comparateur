const SORT_FIELDS = new Set(['annual_cost', 'price_per_kwh', 'subscription_price']);

function sortOffers(offers, { sortBy = 'annual_cost', order = 'asc', green_only = false } = {}) {
  let result = green_only ? offers.filter(o => o.green_energy) : [...offers];

  const field = SORT_FIELDS.has(sortBy) ? sortBy : 'annual_cost';
  const direction = order === 'desc' ? -1 : 1;

  result.sort((a, b) => direction * (parseFloat(a[field]) - parseFloat(b[field])));
  return result;
}

function addRanking(offers) {
  return offers.map((offer, index) => ({ ...offer, rank: index + 1 }));
}

module.exports = { sortOffers, addRanking };
