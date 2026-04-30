const User = require('../models/User');
const { hash, compare } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');
const { sendWelcomeEmail } = require('../services/emailService');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await hash(password);
    const user = await User.create({ name, email, password: hashed });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    sendWelcomeEmail(email, name).catch(() => {});

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const { password: _, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  res.json({ message: 'Logged out successfully' });
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, me };
