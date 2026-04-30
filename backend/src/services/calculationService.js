/**
 * Annual cost formula: C = A + (kWh × P_kWh)
 * A   = subscription_price (€/year)
 * kWh = annual consumption in kilowatt-hours
 * P_kWh = price per kWh (€/kWh)
 */
function calculateCost(subscriptionPrice, consumptionKwh, pricePerKwh) {
  return parseFloat((subscriptionPrice + consumptionKwh * pricePerKwh).toFixed(2));
}

function calculateForOffers(offers, consumptionKwh) {
  return offers.map(offer => ({
    ...offer,
    annual_cost: calculateCost(
      parseFloat(offer.subscription_price),
      consumptionKwh,
      parseFloat(offer.price_per_kwh)
    ),
  }));
}

module.exports = { calculateCost, calculateForOffers };
