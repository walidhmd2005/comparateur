const request = require('supertest');

jest.mock('../src/config/db');
jest.mock('../src/services/emailService', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
  sendSimulationResult: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../src/utils/hashPassword', () => ({
  hash: jest.fn().mockResolvedValue('$hashed'),
  compare: jest.fn().mockResolvedValue(true),
}));

const User = require('../src/models/User');
jest.mock('../src/models/User');

const app = require('../src/app');

const mockUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: '$2a$12$KIXsbfpphFVxlOIxilfUg.nOtLX18HiZVREGb5Rq0nEcO9ue.zGOi',
  role: 'user',
  created_at: new Date(),
};

describe('POST /api/auth/register', () => {
  it('returns 201 and a token on success', async () => {
    User.findByEmail.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1, name: 'Alice', email: 'alice@example.com', role: 'user' });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ email: 'alice@example.com' });
  });

  it('returns 409 when email is already used', async () => {
    User.findByEmail.mockResolvedValue(mockUser);

    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(409);
  });

  it('returns 422 for invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  it('returns 200 and token with valid credentials', async () => {
    User.findByEmail.mockResolvedValue(mockUser);

    const res = await request(app).post('/api/auth/login').send({
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('returns 401 for unknown email', async () => {
    User.findByEmail.mockResolvedValue(null);

    const res = await request(app).post('/api/auth/login').send({
      email: 'unknown@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(401);
  });
});
