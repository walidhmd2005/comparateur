const pool = require('../config/db');

const parseResults = v => (typeof v === 'string' ? JSON.parse(v) : v);

const Simulation = {
  async create({ user_id = null, consumption_kwh, energy_type, results }) {
    const [result] = await pool.query(
      'INSERT INTO simulations (user_id, consumption_kwh, energy_type, results) VALUES (?, ?, ?, ?)',
      [user_id, consumption_kwh, energy_type, JSON.stringify(results)]
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM simulations WHERE id = ? LIMIT 1', [id]);
    if (!rows[0]) return null;
    return { ...rows[0], results: parseResults(rows[0].results) };
  },

  async findByUser(user_id, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT * FROM simulations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [user_id, limit, offset]
    );
    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) AS total FROM simulations WHERE user_id = ?',
      [user_id]
    );
    return {
      simulations: rows.map(r => ({ ...r, results: parseResults(r.results) })),
      total,
      page,
      limit,
    };
  },

  async getAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT * FROM simulations ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM simulations');
    return {
      simulations: rows.map(r => ({ ...r, results: parseResults(r.results) })),
      total,
      page,
      limit,
    };
  },

  async countRecent(days = 30) {
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM simulations WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    );
    return count;
  },
};

module.exports = Simulation;
