const request = require('supertest');

jest.mock('../src/config/db');

const Offer = require('../src/models/Offer');
jest.mock('../src/models/Offer');

const { generateToken } = require('../src/utils/generateToken');
const app = require('../src/app');

const adminToken = generateToken({ id: 1, email: 'admin@test.com', role: 'admin' });
const userToken  = generateToken({ id: 2, email: 'user@test.com',  role: 'user'  });

const mockOffer = {
  id: 1,
  provider_name: 'EDF',
  offer_name: 'Tarif Bleu',
  energy_type: 'electricity',
  subscription_price: '132.00',
  price_per_kwh: '0.251600',
  green_energy: 0,
  contract_duration: null,
};

describe('GET /api/offers', () => {
  it('returns paginated offers without auth', async () => {
    Offer.getAll.mockResolvedValue({ offers: [mockOffer], total: 1, page: 1, limit: 50 });

    const res = await request(app).get('/api/offers');
    expect(res.status).toBe(200);
    expect(res.body.offers).toHaveLength(1);
  });
});

describe('POST /api/offers', () => {
  it('returns 201 for admin', async () => {
    Offer.create.mockResolvedValue(mockOffer);

    const res = await request(app)
      .post('/api/offers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        provider_name: 'EDF',
        offer_name: 'Tarif Bleu',
        energy_type: 'electricity',
        subscription_price: 132,
        price_per_kwh: 0.2516,
      });

    expect(res.status).toBe(201);
  });

  it('returns 403 for regular user', async () => {
    const res = await request(app)
      .post('/api/offers')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        provider_name: 'EDF',
        offer_name: 'Tarif Bleu',
        energy_type: 'electricity',
        subscription_price: 132,
        price_per_kwh: 0.2516,
      });

    expect(res.status).toBe(403);
  });

  it('returns 422 for missing fields', async () => {
    const res = await request(app)
      .post('/api/offers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ provider_name: 'EDF' });

    expect(res.status).toBe(422);
  });
});
