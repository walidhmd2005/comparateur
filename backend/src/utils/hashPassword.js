const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

async function hash(plaintext) {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

async function compare(plaintext, hashed) {
  return bcrypt.compare(plaintext, hashed);
}

module.exports = { hash, compare };
