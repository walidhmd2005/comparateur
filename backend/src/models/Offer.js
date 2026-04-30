const pool = require('../config/db');

const Offer = {
  async getAll({ energy_type, green_energy, page = 1, limit = 50 } = {}) {
    let where = 'WHERE 1=1';
    const params = [];
    if (energy_type) { where += ' AND energy_type = ?'; params.push(energy_type); }
    if (green_energy !== undefined) { where += ' AND green_energy = ?'; params.push(green_energy ? 1 : 0); }

    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      `SELECT * FROM offers ${where} ORDER BY price_per_kwh ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM offers ${where}`, params);
    return { offers: rows, total, page, limit };
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM offers WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create({ provider_name, offer_name, energy_type, subscription_price, price_per_kwh, green_energy = false, contract_duration = null }) {
    const [result] = await pool.query(
      `INSERT INTO offers (provider_name, offer_name, energy_type, subscription_price, price_per_kwh, green_energy, contract_duration)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [provider_name, offer_name, energy_type, subscription_price, price_per_kwh, green_energy ? 1 : 0, contract_duration]
    );
    return this.findById(result.insertId);
  },

  async update(id, fields) {
    const allowed = ['provider_name', 'offer_name', 'energy_type', 'subscription_price', 'price_per_kwh', 'green_energy', 'contract_duration'];
    const sets = Object.keys(fields).filter(k => allowed.includes(k));
    if (sets.length === 0) return this.findById(id);

    const values = sets.map(k => k === 'green_energy' ? (fields[k] ? 1 : 0) : fields[k]);
    await pool.query(
      `UPDATE offers SET ${sets.map(k => `${k} = ?`).join(', ')}, updated_at = NOW() WHERE id = ?`,
      [...values, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM offers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async getByEnergyType(energy_type) {
    const [rows] = await pool.query(
      'SELECT * FROM offers WHERE energy_type = ? ORDER BY price_per_kwh ASC',
      [energy_type]
    );
    return rows;
  },
};

module.exports = Offer;
