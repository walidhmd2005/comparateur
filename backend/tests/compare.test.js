const { calculateCost, calculateForOffers } = require('../src/services/calculationService');
const { sortOffers, addRanking } = require('../src/services/sortService');

const sampleOffers = [
  { id: 1, provider_name: 'A', offer_name: 'O1', energy_type: 'electricity', subscription_price: '132.00', price_per_kwh: '0.251600', green_energy: 0 },
  { id: 2, provider_name: 'B', offer_name: 'O2', energy_type: 'electricity', subscription_price: '120.00', price_per_kwh: '0.248000', green_energy: 1 },
  { id: 3, provider_name: 'C', offer_name: 'O3', energy_type: 'electricity', subscription_price: '144.00', price_per_kwh: '0.239500', green_energy: 1 },
];

describe('calculationService', () => {
  it('calculateCost: C = A + (kWh × P_kWh)', () => {
    expect(calculateCost(132, 2400, 0.2516)).toBe(735.84);
  });

  it('calculateForOffers returns annual_cost for each offer', () => {
    const result = calculateForOffers(sampleOffers, 2400);
    expect(result[0]).toHaveProperty('annual_cost');
    expect(result[0].annual_cost).toBe(calculateCost(132, 2400, 0.2516));
  });
});

describe('sortService', () => {
  let withCosts;
  beforeEach(() => {
    withCosts = calculateForOffers(sampleOffers, 2400);
  });

  it('sorts by annual_cost ascending by default', () => {
    const sorted = sortOffers(withCosts);
    expect(sorted[0].annual_cost).toBeLessThanOrEqual(sorted[1].annual_cost);
  });

  it('filters green_only offers', () => {
    const sorted = sortOffers(withCosts, { green_only: true });
    expect(sorted.every(o => o.green_energy)).toBe(true);
  });

  it('addRanking assigns rank starting at 1', () => {
    const ranked = addRanking(sortOffers(withCosts));
    expect(ranked[0].rank).toBe(1);
    expect(ranked[ranked.length - 1].rank).toBe(ranked.length);
  });
});
