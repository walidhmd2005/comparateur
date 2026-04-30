const express = require('express');
const router = express.Router();

const exampleRoutes = require('./example.routes');

router.use('/examples', exampleRoutes);

module.exports = router;
