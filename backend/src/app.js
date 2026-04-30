require('./config/env');
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const offerRoutes = require('./routes/offerRoutes');
const compareRoutes = require('./routes/compareRoutes');
const historyRoutes = require('./routes/historyRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({
  message: 'Comparateur Energie API',
  routes: ['/health', '/api/auth', '/api/offers', '/api/compare', '/api/history', '/api/admin'],
}));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

module.exports = app;
