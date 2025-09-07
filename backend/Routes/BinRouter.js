const express = require('express');
const router = express.Router();
const { submitBinData, getLatestBinData } = require('../Controllers/BinController');

// Public routes - no authentication required
router.post('/submit', submitBinData);
router.get('/latest', getLatestBinData);

module.exports = router;
